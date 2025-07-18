import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        // Add any additional middleware logic here
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow access to auth pages without authentication
                if (req.nextUrl.pathname.startsWith('/auth/')) {
                    return true
                }

                // Require authentication for all other pages
                return !!token
            },
        },
    }
)

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
