import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.dateTime('purchase_date')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.boolean('is_paid').defaultTo('false')
      table.integer('user_id').unsigned().references('users.id').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
