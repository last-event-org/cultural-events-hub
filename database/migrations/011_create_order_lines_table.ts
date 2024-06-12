import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_lines'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('qty')
      table.integer('order_id').unsigned().references('orders.id').onDelete('RESTRICT')
      table.integer('price_id').unsigned().references('prices.id').onDelete('RESTRICT')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}