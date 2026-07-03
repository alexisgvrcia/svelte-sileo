import type { RequestHandler } from "./$types";

const site = "https://svelte-sileo.alexisgvrcia.dev";

const body = `User-agent: *
Disallow:

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${site}/sitemap.xml`;

export const GET: RequestHandler = () => {
    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8"
        }
    });
};
