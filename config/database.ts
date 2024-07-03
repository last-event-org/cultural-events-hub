import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

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
    // localhost: {
    //   client: 'mysql2',
    //   connection: {
    //     host: env.get('DB_HOST_LOCALHOST'),
    //     port: env.get('DB_PORT_LOCALHOST'),
    //     user: env.get('DB_USER_LOCALHOST'),
    //     password: env.get('DB_PASSWORD_LOCALHOST'),
    //     database: env.get('DB_DATABASE_LOCALHOST'),
    //   },
    //   debug: true,
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    // },
  },
})

export default dbConfig
