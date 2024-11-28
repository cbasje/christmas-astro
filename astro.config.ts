import { defineConfig, envField } from "astro/config";

import deno from "@deno/astro-adapter";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: deno({
        hostname: "0.0.0.0",
        port: 3000,
    }),
    security: {
        checkOrigin: true,
    },

    integrations: [
        icon({
            svgoOptions: {
                plugins: [
                    {
                        name: "convertColors",
                        params: {
                            currentColor: true,
                        },
                    },
                ],
            },
        }),
    ],

    site: "https://christmas.benjami.in",

    vite: {
        css: {
            transformer: "lightningcss",
            lightningcss: {
                drafts: {
                    customMedia: true,
                },
            },
        },
        build: {
            cssMinify: "lightningcss",
        },
    },

    experimental: {
        env: {
            schema: {
                DATABASE_URL: envField.string({
                    context: "server",
                    access: "secret",
                }),
            },
        },
    },
});
