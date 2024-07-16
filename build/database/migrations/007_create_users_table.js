import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'users';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable();
            table.string('username', 254).nullable().unique();
            table.string('email', 254).notNullable().unique();
            table.string('password').notNullable();
            table.string('firstname', 254).nullable();
            table.string('lastname', 254).nullable();
            table.string('company_name', 254).nullable();
            table.string('vat_number', 12).nullable();
            table.string('verification_token').nullable();
            table.boolean('is_verified').defaultTo(false);
            table.timestamp('verified_at').nullable();
            table.string('reset_token').nullable();
            table.timestamp('reset_token_expires').nullable();
            table.boolean('is_blocked').defaultTo(false);
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=007_create_users_table.js.map