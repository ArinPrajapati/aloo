import {
    Cloud,
    Sun,
    CloudRain,
    Wind,
    Droplets,
    Eye,
    MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface WeatherCardProps {
    weather: any
}

export default function WeatherCard({ weather }: WeatherCardProps) {
    const getWeatherIcon = (description: string) => {
        const desc = description.toLowerCase()
        if (desc.includes('rain'))
            return <CloudRain className="text-blue-500" size={24} />
        if (desc.includes('cloud'))
            return <Cloud className="text-gray-500" size={24} />
        if (desc.includes('clear') || desc.includes('sun'))
            return <Sun className="text-yellow-500" size={24} />
        return <Cloud className="text-gray-500" size={24} />
    }

    return (
        <Card className="mt-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    {getWeatherIcon(weather.description)}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            Weather in {weather.location}
                            {weather.country && (
                                <span className="text-sm font-normal">({weather.country})</span>
                            )}
                        </div>
                        {weather.coordinates && (
                            <div className="flex items-center gap-1 text-xs font-normal text-blue-600 dark:text-blue-400">
                                <MapPin size={12} />
                                <span>
                                    {weather.coordinates.lat.toFixed(2)}, {weather.coordinates.lon.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                            {weather.temperature}°C
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 capitalize">
                            {weather.description}
                        </div>
                    </div>
                    <div className="text-right text-sm text-blue-600 dark:text-blue-400">
                        <div>Feels like {weather.feelsLike}°C</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <Droplets size={14} className="text-blue-500" />
                        <span>{weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Wind size={14} className="text-blue-500" />
                        <span>{weather.windSpeed} m/s</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye size={14} className="text-blue-500" />
                        <span>{weather.pressure} hPa</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
