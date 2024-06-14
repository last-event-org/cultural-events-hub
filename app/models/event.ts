import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Address from '#models/address'
import type { HasOne, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Price from '#models/price'
import CategoryType from '#models/category_type'
import Indicator from '#models/indicator'

export default class Event extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare subtitle: string

  @column()
  declare description: string

  @column()
  declare facebookLink: string

  @column()
  declare instagramLink: string

  @column()
  declare websiteLink: string

  @column.dateTime()
  declare eventStart: DateTime

  @column.dateTime()
  declare eventEnd: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => User)
  declare vendorId: HasOne<typeof User>

  @hasOne(() => Address)
  declare locationId: HasOne<typeof Address>

  @hasMany(() => Price)
  declare price_id: HasMany<typeof Price>

  @manyToMany(() => CategoryType, {
    pivotTable: 'category_types_events',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'category_type_id',
  })
  declare categoryTypes: ManyToMany<typeof CategoryType>

  @manyToMany(() => Indicator)
  declare indicators: ManyToMany<typeof Indicator>

  async getEventsByLocation(location: string) {
    console.log('location : ' + location)
    // get events where events_location_id = adresses.id.name
  }

  async getEventsByVendor(user: number) {
    console.log('location : ' + user)
    // get events where events.vendor.id = user.id
  }

  async getEventsByCategory(category: number) {
    console.log('category : ' + category)
    // get events where category type ID in the category_type_events table is equal to the FK_parent_category_id
  }

  async getEventsBySubCategory(subCategory: number) {
    console.log('subCategory : ' + subCategory)
    // get events where subcategory type ID is in the category_types_events table
  }

  async getEventsByIndicators(indicator: number) {
    console.log('subCategory : ' + indicator)
    // get events where indicator ID is present in the indicators_events table
  }
}
