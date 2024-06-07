import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('role_name', ['USER', 'VENDOR', 'ADMIN'])
      table.boolean('can_create_event').defaultTo(false)
      table.boolean('can_update_event').defaultTo(false)
      table.boolean('can_delete_event').defaultTo(false)
      table.boolean('can_create_address').defaultTo(false)
      table.boolean('can_update_address').defaultTo(false)
      table.boolean('can_delete_address').defaultTo(false)
      table.boolean('can_create_category').defaultTo(false)
      table.boolean('can_update_category').defaultTo(false)
      table.boolean('can_delete_category').defaultTo(false)
      table.boolean('can_create_indicator').defaultTo(false)
      table.boolean('can_update_indicator').defaultTo(false)
      table.boolean('can_delete_indicator').defaultTo(false)
      table.boolean('can_block_user').defaultTo(false)
      table.boolean('can_update_user').defaultTo(false)
      table.boolean('can_delete_user').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
