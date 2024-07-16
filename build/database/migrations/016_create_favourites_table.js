import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'favourites';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
            table.integer('vendor_id').unsigned().references('users.id').onDelete('CASCADE');
            table.unique(['user_id', 'vendor_id']);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=016_create_favourites_table.js.map