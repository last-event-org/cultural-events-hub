import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'addresses';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=118_alter_addresses_references.js.map