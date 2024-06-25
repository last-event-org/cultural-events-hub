import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Address from '#models/address'
import type { HasOne, HasMany, ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Price from '#models/price'
import CategoryType from '#models/category_type'
import Indicator from '#models/indicator'
import Media from './media.js'

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

  @column()
  declare youtubeLink: string

  @column.dateTime()
  declare eventStart: DateTime

  @column.dateTime()
  declare eventEnd: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare vendorId: number

  @belongsTo(() => User)
  declare vendor: BelongsTo<typeof User>

  @column()
  declare locationId: number

  @belongsTo(() => Address, {
    foreignKey: 'locationId',
  })
  declare location: BelongsTo<typeof Address>

  @hasMany(() => Price)
  declare prices: HasMany<typeof Price>

  @hasMany(() => Media)
  declare media: HasMany<typeof Media>

  @manyToMany(() => CategoryType, {
    pivotTable: 'category_types_events',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'category_type_id',
  })
  declare categoryTypes: ManyToMany<typeof CategoryType>

  @manyToMany(() => Indicator, {
    pivotTable: 'indicators_events',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'indicator_id',
  })
  declare indicators: ManyToMany<typeof Indicator>
}
