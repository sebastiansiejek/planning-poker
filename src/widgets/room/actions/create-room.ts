'use server';

import {openai} from '@ai-sdk/openai';
import {generateText} from 'ai';
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

    await Promise.all(issues.map(async (issue) => {
      const name = issue.fields.summary;
      let description = getDescriptionText(issue);
      const comments = getComments(issue);
      const issueKey = issue.key;

      description += '\n issue comments: \n' + comments.join('\n')

      const { text: summaryDescription } = await generateText({
        model: openai('gpt-4o'),
        system: 'You are a mid-level software engineer experienced in PHP and React. Given a Jira issue (including title, description, and comments), create a concise technical summary in Polish that helps developers quickly understand the task before estimation. Focus on key elements relevant for evaluating complexity.\\nYour summary should include:\\n- the main goal of the task (what needs to be achieved)\\n- important technical or functional aspects\\n- potential dependencies or risks that may affect estimation\\n- relevant notes or insights from comments (if any)\\nRespond only in Polish.',
        prompt: `
          title: ${name}
          ---
          description: ${description}'
          ---
          comments: ${comments}
        `,
      });


      return gameServiceFactory.create({ name, description, roomId: createdRoom.id, issueKey, summaryDescription  })
    }))

    revalidatePath(routes.dashboard.getPath());

    return {
      success: true,
      data: createdRoom,
    };
  });

export type CreateOrJoinToRoomParameters = z.infer<typeof schema>;
