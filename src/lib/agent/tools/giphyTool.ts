import type { Tool } from '../types'

interface GiphyGif {
    id: string
    title: string
    url: string
    images: {
        original: {
            url: string
            width: string
            height: string
        }
        fixed_height: {
            url: string
            width: string
            height: string
        }
        preview_gif: {
            url: string
            width: string
            height: string
        }
    }
    rating: string
    username: string
    source_tld: string
}

interface GiphyResponse {
    data: GiphyGif[]
    meta: {
        status: number
        msg: string
        response_id: string
    }
    pagination: {
        total_count: number
        count: number
        offset: number
    }
}

export function getGiphyTool(): Tool {
    return {
        name: 'giphy',
        description: 'Search for GIFs, memes, and animated images from Giphy based on keywords or topics',
        parameters: {
            query: "string - Search terms for GIFs/memes (e.g., 'coding meme', 'happy dance', 'programming funny', 'celebration')",
            limit: "number - Number of GIFs to return (1-25, default: 8)",
            rating: "string - Content rating filter ('g', 'pg', 'pg-13', 'r', default: 'pg-13')",
            type: "string - Type of content ('gif' for general GIFs, 'meme' for memes, default: 'gif')",
        },
        async execute({
            query,
            limit = 8,
            rating = 'pg-13',
            type = 'gif',
        }: {
            query: string
            limit?: number
            rating?: string
            type?: string
        }) {
            try {
                const API_KEY = process.env.GIPHY_API_KEY

                if (!API_KEY) {
                    throw new Error('Giphy API key not configured')
                }

                if (!query || typeof query !== 'string') {
                    throw new Error('Search query is required')
                }

                // Adjust search query based on type
                let searchQuery = query
                if (type === 'meme' && !query.toLowerCase().includes('meme')) {
                    searchQuery = `${query} meme`
                }

                // Validate and constrain parameters
                const validatedLimit = Math.min(Math.max(1, limit), 25)
                const validRatings = ['g', 'pg', 'pg-13', 'r']
                const validatedRating = validRatings.includes(rating) ? rating : 'pg-13'

                const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=${validatedLimit}&rating=${validatedRating}&lang=en`

                const response = await fetch(url)

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('Giphy API key is invalid or quota exceeded')
                    }
                    if (response.status === 429) {
                        throw new Error('Giphy API rate limit exceeded')
                    }
                    throw new Error(`Giphy API request failed with status: ${response.status}`)
                }

                const data: GiphyResponse = await response.json()

                if (!data.data || data.data.length === 0) {
                    return {
                        query: searchQuery,
                        type,
                        gifs: [],
                        totalFound: 0,
                        message: `No GIFs found for "${query}". Try different keywords!`,
                    }
                }

                // Process and return GIF data
                const processedGifs = data.data.map((gif) => ({
                    id: gif.id,
                    title: gif.title || 'Untitled GIF',
                    url: gif.url, // Giphy page URL
                    gifUrl: gif.images.fixed_height.url, // Direct GIF URL for display
                    previewUrl: gif.images.preview_gif.url, // Smaller preview
                    originalUrl: gif.images.original.url, // Full size
                    width: gif.images.fixed_height.width,
                    height: gif.images.fixed_height.height,
                    rating: gif.rating,
                    username: gif.username || 'Anonymous',
                    source: gif.source_tld || 'Unknown',
                }))

                return {
                    query: searchQuery,
                    type,
                    gifs: processedGifs,
                    totalFound: data.pagination.total_count,
                    count: processedGifs.length,
                    rating: validatedRating,
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
                throw new Error(`Giphy search failed: ${errorMessage}`)
            }
        },
    }
}
