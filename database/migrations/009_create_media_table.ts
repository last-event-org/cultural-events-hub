import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('path', 2083)
      table.enum('type', ['VIDEO', 'IMAGE'])
      table.string('alt_name')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.integer('event_id').unsigned().references('events.id').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
