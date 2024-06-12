import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username', 254).nullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('firstname', 254).nullable()
      table.string('lastname', 254).nullable()
      table.string('company_name', 254).nullable()
      table.string('vat_number', 12).nullable()
      table.boolean('is_blocked').defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.integer('role_id').unsigned().references('roles.id').onDelete('SET NULL')
      table
        .integer('billing_address_id')
        .unsigned()
        .nullable()
        .references('addresses.id')
        .onDelete('SET NULL')
      table
        .integer('shipping_address_id')
        .unsigned()
        .nullable()
        .references('addresses.id')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
