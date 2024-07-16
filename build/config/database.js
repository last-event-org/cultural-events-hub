import env from '#start/env';
import { defineConfig } from '@adonisjs/lucid';
const dbConfig = defineConfig({
    prettyPrintDebugQueries: true,
    connection: 'mysql',
    connections: {
        mysql: {
            client: 'mysql2',
            connection: {
                host: env.get('DB_HOST'),
                port: env.get('DB_PORT'),
                user: env.get('DB_USER'),
                password: env.get('DB_PASSWORD'),
                database: env.get('DB_DATABASE'),
            },
            debug: true,
            migrations: {
                naturalSort: true,
                paths: ['database/migrations'],
            },
        },
    },
});
export default dbConfig;
//# sourceMappingURL=database.js.map