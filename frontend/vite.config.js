import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({

    plugins: [

        react(),

        VitePWA({

            registerType: "autoUpdate",

            workbox: {

    globPatterns: [
        "**/*.{js,css,html,png,svg,ico}"
    ],

    runtimeCaching: [

        {
            urlPattern:
                /^http:\/\/localhost:5000\/api\/.*/,

            handler: "NetworkFirst",

            options: {

                cacheName: "api-cache",

                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds:
                        60 * 60 * 24
                }

            }

        }

    ]

},

            manifest: {

                name: "KisanPWA",

                short_name: "Kisan",

                description:
                    "Smart Agriculture Marketplace",

                theme_color: "#198754",

                background_color: "#ffffff",

                display: "standalone",

                start_url: "/",

                icons: [

                    {
                        src: "icon-192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },

                    {
                        src: "icon-512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }

                ]

            }

        })

    ]

});
