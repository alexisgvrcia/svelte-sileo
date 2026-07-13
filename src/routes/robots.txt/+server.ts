import type { RequestHandler } from "./$types";

const site = "https://svelte-sileo.alexisgvrcia.dev";

const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml`;

export const GET: RequestHandler = () => {
    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8"
        }
    });
};
