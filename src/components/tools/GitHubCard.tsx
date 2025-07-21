import {
    Star,
    GitFork,
    ExternalLink,
    Users,
    UserCheck,
    Building2,
    Calendar,
    Globe,
    Mail,
    Book,
    Archive,
    MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface GitHubCardProps {
    data: any
}

export default function GitHubCard({ data }: GitHubCardProps) {
    if (data.users) {
        // User search results
        return (
            <Card className="mt-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-purple-800 dark:text-purple-200 text-sm">
                        GitHub Users ({data.totalCount} found)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {data.users.slice(0, 5).map((user: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 bg-background/50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.login}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-medium text-sm">{user.login}</h4>
                                        <p className="text-xs text-muted-foreground">{user.type}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                    <a href={user.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink size={12} />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    } else if (data.login) {
        // Single user profile
        return (
            <Card className="mt-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-purple-800 dark:text-purple-200">
                        <div className="flex items-center gap-3">
                            <img
                                src={data.avatarUrl}
                                alt={data.login}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <span className="text-sm font-medium">{data.name || data.login}</span>
                                <p className="text-xs text-purple-600 dark:text-purple-400">@{data.login}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <a href={data.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={14} />
                            </a>
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {data.bio && (
                        <p className="text-sm text-muted-foreground">{data.bio}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-1">
                            <Users size={12} className="text-purple-500" />
                            <span>{data.followers} followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <UserCheck size={12} className="text-purple-500" />
                            <span>{data.following} following</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Book size={12} className="text-purple-500" />
                            <span>{data.publicRepos} repos</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Archive size={12} className="text-purple-500" />
                            <span>{data.publicGists} gists</span>
                        </div>
                    </div>

                    {(data.company || data.location || data.email || data.blog) && (
                        <div className="space-y-1 text-xs text-muted-foreground">
                            {data.company && (
                                <div className="flex items-center gap-1">
                                    <Building2 size={12} />
                                    <span>{data.company}</span>
                                </div>
                            )}
                            {data.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    <span>{data.location}</span>
                                </div>
                            )}
                            {data.email && (
                                <div className="flex items-center gap-1">
                                    <Mail size={12} />
                                    <span>{data.email}</span>
                                </div>
                            )}
                            {data.blog && (
                                <div className="flex items-center gap-1">
                                    <Globe size={12} />
                                    <a
                                        href={data.blog.startsWith('http') ? data.blog : `https://${data.blog}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-600 dark:text-purple-400 hover:underline"
                                    >
                                        {data.blog}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {data.createdAt && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            <span>Joined {new Date(data.createdAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    } else if (data.repositories) {
        // Repository search results
        return (
            <Card className="mt-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50 border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-gray-800 dark:text-gray-200 text-sm">
                        GitHub Repositories ({data.totalCount} found)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {data.repositories.slice(0, 3).map((repo: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 bg-background/50">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-medium text-sm">{repo.fullName}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {repo.description || 'No description available'}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                    <a href={repo.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink size={12} />
                                    </a>
                                </Button>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {repo.language && (
                                    <Badge variant="secondary" className="text-xs py-0 px-2 h-5">
                                        {repo.language}
                                    </Badge>
                                )}
                                <div className="flex items-center gap-1">
                                    <Star size={12} />
                                    {repo.stars.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    } else {
        // Single repository
        return (
            <Card className="mt-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50 border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                        <span className="text-sm">{data.fullName}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <a href={data.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={14} />
                            </a>
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        {data.description || 'No description available'}
                    </p>

                    <div className="flex items-center gap-3 text-sm">
                        {data.language && (
                            <Badge variant="secondary" className="text-xs">
                                {data.language}
                            </Badge>
                        )}
                        <div className="flex items-center gap-1">
                            <Star size={14} />
                            {data.stars.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <GitFork size={14} />
                            {data.forks.toLocaleString()}
                        </div>
                    </div>

                    {data.topics && data.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {data.topics.map((topic: string) => (
                                <Badge
                                    key={topic}
                                    variant="outline"
                                    className="text-xs py-0 px-2 h-5"
                                >
                                    {topic}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }
}
