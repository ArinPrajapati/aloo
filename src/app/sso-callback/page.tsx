"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

export default function SSOCallback() {
    return (
        <div>
            <AuthenticateWithRedirectCallback />
            {/* Clerk CAPTCHA element for bot protection */}
            <div id="clerk-captcha" style={{ display: 'none' }}></div>
        </div>
    )
}
