interface JiraSearchByJqlParams {
  fields: string[]
  jql: string
  maxResults: number
}

interface JiraSearchByJqlResponse {
  issues: any[]
}

async function jiraSearchByJql(bodyData: JiraSearchByJqlParams) {
  console.log(process.env.JIRA_API_DOMAIN)
  const response = await fetch(`https://${process.env.JIRA_API_DOMAIN}/rest/api/3/search/jql`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        `${process.env.JIRA_API_EMAIL}:${process.env.JIRA_API_TOKEN}`,
      ).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  })

  return await response.json() as Promise<JiraSearchByJqlResponse>
}

export {jiraSearchByJql}
