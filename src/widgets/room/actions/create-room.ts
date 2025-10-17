'use server';

import {openai} from '@ai-sdk/openai';
import {generateObject, generateText} from 'ai';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {jiraSearchByJql} from '@/shared/api/jira/jira-search-by-jql';
import { getSession } from '@/shared/auth/auth';
import {GameServiceFactory} from '@/shared/factories/game-service-factory';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { routes } from '@/shared/routes/routes';

const schema = z.object({
  name: z.string(),
  jql: z.string(),
});

function getComments(issue: any) {
  return issue.fields.comment.comments.map((comment: any) => {
    const text = extractTextFromADF(comment.body);

    return text
  });
}

function extractTextFromADF(adfNode: any) {
  if (!adfNode) return '';

  if (adfNode.type === 'text' && adfNode.text) {
    return adfNode.text;
  }

  if (Array.isArray(adfNode.content)) {
    return adfNode.content.map(extractTextFromADF).join('');
  }

  return '';
}

const issueAnalyzeSchema = z.object({
  missing: z.array(z.string()),
  risks: z.array(z.string()),
  questions_to_PO: z.array(z.string()),
  questions_to_BE: z.array(z.string()),
  questions_to_FE: z.array(z.string()),
  questions_to_QA: z.array(z.string()),
  test_scenarios: z.array(z.string()),
});

const issueEstimateSchema = z.object({
  story_points: z.number(),
  explanation: z.string(),
})

function getDescriptionText(issue: any) {
  const descriptionADF = issue.fields.description;
  if (!descriptionADF) return '';

  const text = extractTextFromADF(descriptionADF);
  return text.replace(/([^\n])(\s*)(?=type=paragraph)/g, '$1\n');
}

export const createRoom = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, jql } }) => {
    const session = await getSession();
    const authorId = session?.user?.id;

    if (!authorId) {
      return {
        error: {
          code: 'unauthorized',
        },
      };
    }

    const roomServiceFactory = RoomServiceFactory.getService();
    const gameServiceFactory = GameServiceFactory.getService();

    const room = await roomServiceFactory.getByAuthorIdAndName({
      name,
      authorId,
    });

    if (room) {
      return {
        success: false,
        data: {
          id: room.id,
        },
        error: {
          code: 'P2002',
        },
      };
    }

    const createdRoom = await roomServiceFactory.create({
      name,
      authorId,
    });

    const { issues } = await jiraSearchByJql({
      fields: [
        'key',
        'summary',
        'description',
        'comment'
      ],
      jql,
      maxResults: 3
    })

    const languagePolicyPrompt = `
    LANGUAGE POLICY:
    - Detect the user's language from the input.
    - Reply in that same language.
    - Keep JSON keys exactly as specified; only localize values.
    - If language is ambiguous or mixed, use the dominant language; if unclear, use English.
    - Do not translate code, product names, or error/status codes.
    `

    await Promise.all(issues.map(async (issue) => {
      const name = issue.fields.summary;
      let description = getDescriptionText(issue);
      const comments = getComments(issue);
      const issueKey = issue.key;

      description += '\n issue comments: \n' + comments.join('\n')

      const prompt = `
          title: ${name}
          ---
          description: ${description}'
          ---
          comments: ${comments}
        `

      const  [{text: summaryDescription}, {object: issueAnalyze}, {object: issueEstimate}] = await Promise.all([
         generateText({
          model: openai('gpt-4o'),
          system: `
          ${languagePolicyPrompt}
          You are a mid-level software engineer experienced in PHP and React. 
          Given a Jira issue (including title, description, and comments), create a concise technical summary that helps developers quickly understand the task before estimation. 
          Focus on key elements relevant for evaluating complexity.
          \\nYour summary should include:\\n- the main goal of the task (what needs to be achieved)\\n- important technical or functional aspects\\n- potential dependencies or risks that may affect estimation\\n- relevant notes or insights from comments (if any)\\n.`,
          prompt,
        }),
        generateObject({
          model: openai('gpt-4o'),
          temperature: 0.3,
          system: `
          ${languagePolicyPrompt}
          You are an Agile estimation clarifier. Your job is to extract missing information, risks, and ask concise, high-leverage questions BEFORE estimation.
          RULES:
        - Output strictly as JSON with keys: missing[], risks[], questions_to_PO[], questions_to_BE[], questions_to_FE[], questions_to_QA[], test_scenarios[].
        - Do NOT propose story points or hours. Do NOT restate the ticket verbatim.
        - Prefer 3–6 items per list. Be concrete, reference fields/behaviors, not generalities.
        - Consider: error mappings, API contracts, edge cases, i18n/copy, telemetry/monitoring, security/PII, rate limiting/lockout, environments (dev/stage/prod), rollback, feature flags.
      `,
          prompt,
          schema: issueAnalyzeSchema
        }),
        generateObject({
          model: openai('gpt-4o'),
          system:  languagePolicyPrompt +
            'You are a mid-level software engineer with experience in PHP and React. Given a Jira issue description, provide a detailed estimation in pure JSON format without markdown or ```json blocks. Include the following fields: story_points: number - explanation: short text explaining the reasoning. Consider all available context: title, description, comments, acceptance criteria, issue type, priority, estimators\' seniority, assignee, and any historical estimates. Example Input: {\\"title\\": \\"Add user API\\", \\"description\\": \\"Create REST endpoint for fetching user data\\"} Example Output: {\\"story_points\\": 5, \\"explanation\\": \\"This task is moderate complexity. It involves backend API creation with frontend dependencies. Past similar tasks took 5 story points on average.\\"}',
          prompt: prompt,
          schema: issueEstimateSchema,
          'temperature': 0,
        })
      ])

      return gameServiceFactory.create({ name, description, roomId: createdRoom.id, issueKey, summaryDescription, issueAnalyze, issueEstimate  })
    }))

    revalidatePath(routes.dashboard.getPath());

    return {
      success: true,
      data: createdRoom,
    };
  });

export type CreateOrJoinToRoomParameters = z.infer<typeof schema>;
