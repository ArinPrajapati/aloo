import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-aloo-background">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          🥔
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-aloo-text-primary">
          Page Not Found
        </h2>
        <p className="text-aloo-text-secondary mb-6 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-aloo-accent hover:bg-aloo-accent-hover text-white rounded-lg transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
