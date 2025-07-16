import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    const { message, history } = await req.json();

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
    You are a helpful AI assistant.
    Conversation so far:
    ${history.map((h: any) => `${h.role}: ${h.text}`).join("\n")}
    User: ${message}
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

