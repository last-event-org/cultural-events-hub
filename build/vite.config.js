import { defineConfig } from 'vite';
import adonisjs from '@adonisjs/vite/client';
export default defineConfig({
    plugins: [
        adonisjs({
            entrypoints: ['resources/css/app.css', 'resources/js/app.js'],
            reload: ['resources/views/**/*.edge'],
        }),
    ],
});
//# sourceMappingURL=vite.config.js.map