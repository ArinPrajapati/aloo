import type { Tool } from '../types'

interface GeocodingResult {
  lat: string
  lon: string
  display_name: string
}

interface WeatherData {
  name: string
  sys: { country: string }
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: { speed: number }
}

export function getWeatherTool(): Tool {
  return {
    name: 'weather',
    description: 'Get current weather information for any location using precise coordinates',
    parameters: {
      location:
        "string - The city or location name (e.g., 'London', 'New York', 'Tokyo, Japan')",
    },
    async execute({ location }: { location: string }) {
      try {
        const API_KEY = process.env.OPENWEATHER_API_KEY

        if (!API_KEY) {
          throw new Error('OpenWeather API key not configured')
        }

        // Step 1: Get coordinates using Nominatim geocoding (free, no API key needed)
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=3&addressdetails=1`


        const geocodeResponse = await fetch(geocodeUrl, {
          headers: {
            'User-Agent': 'AlooChat/1.0 (https://github.com/ArinPrajapati/aloo)' // Required by Nominatim
          }
        })

        console.log("Geocoding", geocodeResponse);

        if (!geocodeResponse.ok) {
          throw new Error('Geocoding service unavailable')
        }

        const geocodeData: GeocodingResult[] = await geocodeResponse.json()

        if (geocodeData.length === 0) {
          throw new Error(`Location "${location}" not found`)
        }

        // Use the first result (most relevant)
        const { lat, lon, display_name } = geocodeData[0]

        console.log(lat, lon, display_name);

        // Step 2: Get weather data using coordinates
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

        const weatherResponse = await fetch(weatherUrl)

        if (!weatherResponse.ok) {
          throw new Error('Weather API request failed')
        }

        const weatherData: WeatherData = await weatherResponse.json()

        return {
          location: weatherData.name || display_name.split(',')[0],
          country: weatherData.sys.country,
          coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
          temperature: Math.round(weatherData.main.temp),
          feelsLike: Math.round(weatherData.main.feels_like),
          description: weatherData.weather[0].description,
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 10) / 10, // Round to 1 decimal
          pressure: weatherData.main.pressure,
          icon: weatherData.weather[0].icon,
          fullLocationName: display_name
        }
      } catch (error) {
        console.error('Weather lookup error:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred'
        throw new Error(`Weather lookup failed: ${errorMessage}`)
      }
    },
  }
}
