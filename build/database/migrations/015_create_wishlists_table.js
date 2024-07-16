import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'wishlists';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
            table.integer('event_id').unsigned().references('events.id').onDelete('CASCADE');
            table.unique(['user_id', 'event_id']);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=015_create_wishlists_table.js.map