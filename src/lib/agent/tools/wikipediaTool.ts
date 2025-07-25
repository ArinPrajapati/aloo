import type { Tool } from '../types'

export function getWikipediaTool(): Tool {
    return {
        name: 'wikipedia',
        description: 'Search Wikipedia articles and get summaries for educational and factual information. Perfect for questions starting with "What is", "Who is", "Explain", "Tell me about", etc.',
        parameters: {
            query: 'Topic or article title to search for',
            language: 'Language code (default: en)',
            sentences: 'Number of sentences in summary (default: 3)'
        },
        execute: async (params: { query: string; language?: string; sentences?: number }) => {
            try {
                const { query, language = 'en', sentences = 3 } = params

                // Clean and encode the query
                const cleanQuery = query.trim()
                const encodedQuery = encodeURIComponent(cleanQuery)

                // First, search for the page to get the correct title
                const searchUrl = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`

                const response = await fetch(searchUrl, {
                    headers: {
                        'User-Agent': 'AlooChat/1.0 (Educational AI Assistant)',
                        'Accept': 'application/json'
                    }
                })

                if (!response.ok) {
                    // If direct lookup fails, try search API
                    return await searchWikipedia(cleanQuery, language, sentences)
                }

                const data = await response.json()

                // Check if this is a disambiguation page
                if (data.type === 'disambiguation') {
                    return await searchWikipedia(cleanQuery, language, sentences)
                }

                const result = {
                    title: data.title,
                    summary: data.extract,
                    url: data.content_urls?.desktop?.page || `https://${language}.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
                    thumbnail: data.thumbnail?.source || null,
                    coordinates: data.coordinates || null,
                    language: language,
                    type: data.type || 'standard',
                    lastModified: data.timestamp || null,
                    // Additional metadata
                    namespace: data.namespace || null,
                    wikibaseItem: data.wikibase_item || null,
                    description: data.description || null
                }

                // If summary is too long, truncate to requested sentences
                if (result.summary && sentences) {
                    const sentenceArray = result.summary.split('. ')
                    if (sentenceArray.length > sentences) {
                        result.summary = sentenceArray.slice(0, sentences).join('. ') + (sentenceArray.length > sentences ? '.' : '')
                    }
                }

                return result

            } catch (error) {
                console.error('Wikipedia tool error:', error)
                return {
                    error: 'Failed to fetch Wikipedia article',
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                    query: params.query
                }
            }
        }
    }
}

// Helper function to search Wikipedia when direct lookup fails
async function searchWikipedia(query: string, language: string, sentences: number) {
    try {
        // Use the search API to find relevant pages
        const searchApiUrl = `https://${language}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&origin=*`

        const searchResponse = await fetch(searchApiUrl, {
            headers: {
                'User-Agent': 'AlooChat/1.0 (Educational AI Assistant)',
                'Accept': 'application/json'
            }
        })

        if (!searchResponse.ok) {
            throw new Error(`Search failed: ${searchResponse.status}`)
        }

        const searchData = await searchResponse.json()

        if (!searchData.query?.search?.length) {
            return {
                error: 'No Wikipedia articles found',
                message: `No articles found for "${query}". Try a different search term.`,
                query: query,
                suggestions: ['Try more specific terms', 'Check spelling', 'Try related keywords']
            }
        }

        const firstResult = searchData.query.search[0]
        const pageTitle = firstResult.title

        // Now get the summary for this page
        const summaryUrl = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`

        const summaryResponse = await fetch(summaryUrl, {
            headers: {
                'User-Agent': 'AlooChat/1.0 (Educational AI Assistant)',
                'Accept': 'application/json'
            }
        })

        if (!summaryResponse.ok) {
            throw new Error(`Summary fetch failed: ${summaryResponse.status}`)
        }

        const summaryData = await summaryResponse.json()

        let summary = summaryData.extract
        if (summary && sentences) {
            const sentenceArray = summary.split('. ')
            if (sentenceArray.length > sentences) {
                summary = sentenceArray.slice(0, sentences).join('. ') + '.'
            }
        }

        return {
            title: summaryData.title,
            summary: summary,
            url: summaryData.content_urls?.desktop?.page || `https://${language}.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
            thumbnail: summaryData.thumbnail?.source || null,
            coordinates: summaryData.coordinates || null,
            language: language,
            type: summaryData.type || 'standard',
            lastModified: summaryData.timestamp || null,
            description: summaryData.description || null,
            searchResult: true,
            originalQuery: query
        }

    } catch (error) {
        return {
            error: 'Wikipedia search failed',
            message: error instanceof Error ? error.message : 'Failed to search Wikipedia',
            query: query
        }
    }
}
