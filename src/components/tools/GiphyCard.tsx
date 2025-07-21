import {
    Image,
    Play,
    ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface GiphyCardProps {
    data: any
}

export default function GiphyCard({ data }: GiphyCardProps) {
    if (!data.gifs || data.gifs.length === 0) {
        // No GIFs found case
        return (
            <Card className="mt-3 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 border-pink-200 dark:border-pink-800">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-pink-800 dark:text-pink-200 text-sm">
                        <Image size={16} />
                        Giphy Search
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{data.message || 'No GIFs found'}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mt-3 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 border-pink-200 dark:border-pink-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-pink-800 dark:text-pink-200 text-sm">
                    <div className="flex items-center gap-2">
                        <Image size={16} />
                        <span>Giphy Results</span>
                        {data.type === 'meme' && <Badge variant="secondary" className="text-xs">Memes</Badge>}
                    </div>
                    <div className="text-xs text-pink-600 dark:text-pink-400">
                        {data.count} of {data.totalFound} found
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {data.gifs.slice(0, 8).map((gif: any, index: number) => (
                        <div key={gif.id || index} className="relative group rounded-lg overflow-hidden bg-background/50 border">
                            <div className="aspect-square relative">
                                <img
                                    src={gif.gifUrl}
                                    alt={gif.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {/* Overlay with play button and info */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={24} className="text-white drop-shadow-md" />
                                    </div>
                                </div>

                                {/* Title overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <p className="text-white text-xs truncate font-medium">
                                        {gif.title}
                                    </p>
                                    {gif.username && (
                                        <p className="text-white/80 text-xs">
                                            by @{gif.username}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* External link button */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-6 w-6 bg-white/90 hover:bg-white"
                                    asChild
                                >
                                    <a
                                        href={gif.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View on Giphy"
                                    >
                                        <ExternalLink size={12} />
                                    </a>
                                </Button>
                            </div>

                            {/* Rating badge */}
                            {gif.rating && gif.rating !== 'g' && (
                                <div className="absolute top-2 left-2">
                                    <Badge variant="outline" className="text-xs bg-white/90">
                                        {gif.rating.toUpperCase()}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Search info */}
                <div className="text-center text-xs text-muted-foreground pt-2 border-t">
                    <span>Searched for "{data.query}"</span>
                    {data.rating && (
                        <span> • Rating: {data.rating.toUpperCase()}</span>
                    )}
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <span>Powered by</span>
                        <a
                            href="https://giphy.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 dark:text-pink-400 hover:underline font-medium"
                        >
                            GIPHY
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
