import {
    ExternalLink,
    MapPin,
    Calendar,
    Globe,
    BookOpen,
    Image,
    AlertCircle,
    Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface WikipediaCardProps {
    data: any
}

export default function WikipediaCard({ data }: WikipediaCardProps) {
    // Error case
    if (data.error) {
        return (
            <Card className="mt-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200 text-sm">
                        <AlertCircle size={16} />
                        Wikipedia Search Error
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                        {data.message}
                    </p>
                    {data.suggestions && (
                        <div className="text-xs text-red-600 dark:text-red-400">
                            <p className="font-medium mb-1">Suggestions:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                {data.suggestions.map((suggestion: string, index: number) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mt-3 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-blue-800 dark:text-blue-200">
                    <div className="flex items-center gap-2">
                        <BookOpen size={16} />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{data.title}</span>
                            {data.searchResult && data.originalQuery && (
                                <div className="flex items-center gap-1 text-xs font-normal text-blue-600 dark:text-blue-400">
                                    <Search size={10} />
                                    <span>Searched for: "{data.originalQuery}"</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                        <a href={data.url} target="_blank" rel="noopener noreferrer" title="View on Wikipedia">
                            <ExternalLink size={14} />
                        </a>
                    </Button>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Thumbnail and description */}
                <div className="flex gap-3">
                    {data.thumbnail && (
                        <div className="flex-shrink-0">
                            <img
                                src={data.thumbnail}
                                alt={data.title}
                                className="w-20 h-20 rounded-lg object-cover bg-background/50 border"
                                loading="lazy"
                            />
                        </div>
                    )}

                    <div className="flex-1 space-y-2">
                        {data.description && (
                            <Badge variant="secondary" className="text-xs">
                                {data.description}
                            </Badge>
                        )}

                        {data.summary && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {data.summary}
                            </p>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-3 text-xs text-blue-600 dark:text-blue-400">
                    {data.coordinates && (
                        <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>
                                {data.coordinates.lat.toFixed(3)}, {data.coordinates.lon.toFixed(3)}
                            </span>
                        </div>
                    )}

                    {data.language && data.language !== 'en' && (
                        <div className="flex items-center gap-1">
                            <Globe size={12} />
                            <span>{data.language.toUpperCase()}</span>
                        </div>
                    )}

                    {data.lastModified && (
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>Updated {new Date(data.lastModified).toLocaleDateString()}</span>
                        </div>
                    )}

                    {data.type && data.type !== 'standard' && (
                        <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                            {data.type}
                        </Badge>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center justify-center gap-1">
                        <span>Content from</span>
                        <a
                            href="https://wikipedia.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                            Wikipedia
                        </a>
                        <span>• Free Encyclopedia</span>
                    </div>
                    {data.wikibaseItem && (
                        <div className="mt-1 text-xs">
                            <a
                                href={`https://www.wikidata.org/wiki/${data.wikibaseItem}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View on Wikidata
                            </a>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
