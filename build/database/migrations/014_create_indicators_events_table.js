import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'indicators_events';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('indicator_id').unsigned().references('indicators.id').onDelete('CASCADE');
            table.integer('event_id').unsigned().references('events.id').onDelete('CASCADE');
            table.unique(['indicator_id', 'event_id']);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=014_create_indicators_events_table.js.map