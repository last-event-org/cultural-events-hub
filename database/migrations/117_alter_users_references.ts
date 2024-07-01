import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
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
