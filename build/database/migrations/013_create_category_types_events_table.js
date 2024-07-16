import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'category_types_events';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('category_type_id').unsigned().references('category_types.id');
            table.integer('event_id').unsigned().references('events.id').onDelete('CASCADE');
            table.unique(['category_type_id', 'event_id']);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=013_create_category_types_events_table.js.map