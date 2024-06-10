import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.string('title')
      table.string('subtitle')
      table.string('description')
      table.string('facebook_link')
      table.string('instagram_link')
      table.string('website_link')
      table.timestamp('event_start')
      table.timestamp('event_end')
      table.integer('vendor_id').unsigned().references('users.id').onDelete('SET NULL')
      table.integer('location_id').unsigned().references('addresses.id').onDelete('SET NULL')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
