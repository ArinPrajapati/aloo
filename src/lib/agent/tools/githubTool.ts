import type { Tool } from '../types'

export function getGitHubTool(): Tool {
  return {
    name: 'github',
    description: 'Search for GitHub repositories or get repository information',
    parameters: {
      query:
        "string - Repository name or search query (e.g., 'facebook/react', 'javascript machine learning')",
      type: "string - Either 'search' for searching repositories or 'repo' for specific repository info",
    },
    async execute({
      query,
      type = 'search',
    }: {
      query: string
      type?: string
    }) {
      try {
        let url: string

        if (type === 'repo') {
          // Get specific repository info
          url = `https://api.github.com/repos/${query}`
        } else {
          // Search repositories
          url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`
        }

        const response = await fetch(url, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'AlooChat-Agent',
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Repository "${query}" not found`)
          }
          throw new Error('GitHub API request failed')
        }

        const data = await response.json()

        if (type === 'repo') {
          return {
            name: data.name,
            fullName: data.full_name,
            description: data.description,
            stars: data.stargazers_count,
            forks: data.forks_count,
            language: data.language,
            url: data.html_url,
            topics: data.topics?.slice(0, 5) || [],
          }
        } else {
          return {
            totalCount: data.total_count,
            repositories: data.items.map((repo: any) => ({
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              stars: repo.stargazers_count,
              language: repo.language,
              url: repo.html_url,
            })),
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred'
        throw new Error(`GitHub lookup failed: ${errorMessage}`)
      }
    },
  }
}
