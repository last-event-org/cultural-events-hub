import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'prices';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.integer('event_id').unsigned().references('events.id').onDelete('CASCADE');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=119_alter_prices_references.js.map