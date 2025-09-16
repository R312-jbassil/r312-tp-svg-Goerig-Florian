// src/pages/api/generateSVG.js
import { OpenAI } from "openai";

const HF_TOKEN = import.meta.env.HF_TOKEN;
const HF_URL = import.meta.env.HF_URL;
const MODEL = "meta-llama/Llama-3.1-8B-Instruct"; // choisis ton modèle préféré

export const POST = async ({ request }) => {
    try {
        const { prompt } = await request.json();

        const client = new OpenAI({
            baseURL: HF_URL,
            apiKey: HF_TOKEN,
        });

        const chatCompletion = await client.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: "You are an SVG code generator. Generate only valid SVG code." },
                { role: "user", content: prompt },
            ],
        });

        const message = chatCompletion.choices[0]?.message?.content || "";
        const svgMatch = message.match(/<svg[\s\S]*?<\/svg>/i);

        return new Response(
            JSON.stringify({ svg: svgMatch ? svgMatch[0] : "" }),
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ svg: "" }), { status: 500 });
    }
};
