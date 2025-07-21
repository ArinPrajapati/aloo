import type { Tool } from '../types'

export function getGitHubTool(): Tool {
  return {
    name: 'github',
    description: 'Search for GitHub repositories, users, or get repository/user information',
    parameters: {
      query:
        "string - Repository name, username, or search query (e.g., 'facebook/react', 'torvalds', 'javascript machine learning')",
      type: "string - Either 'search' for searching repositories, 'repo' for specific repository info, 'user' for specific user info, or 'search-users' for searching users",
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
        } else if (type === 'user') {
          // Get specific user info
          url = `https://api.github.com/users/${query}`
        } else if (type === 'search-users') {
          // Search users
          url = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&sort=followers&order=desc&per_page=5`
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
            const itemType = type === 'user' ? 'User' : 'Repository'
            throw new Error(`${itemType} "${query}" not found`)
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
        } else if (type === 'user') {
          return {
            login: data.login,
            id: data.id,
            name: data.name,
            bio: data.bio,
            company: data.company,
            location: data.location,
            email: data.email,
            blog: data.blog,
            followers: data.followers,
            following: data.following,
            publicRepos: data.public_repos,
            publicGists: data.public_gists,
            avatarUrl: data.avatar_url,
            url: data.html_url,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          }
        } else if (type === 'search-users') {
          return {
            totalCount: data.total_count,
            users: data.items.map((user: any) => ({
              login: user.login,
              id: user.id,
              avatarUrl: user.avatar_url,
              url: user.html_url,
              type: user.type,
              score: user.score,
            })),
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
