import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Address from '#models/address'
import type { HasOne, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Price from '#models/price'
import CategoryType from '#models/category_type'
import Indicator from '#models/indicator'

export default class Event extends BaseModel {
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

  @manyToMany(() => CategoryType)
  declare categoryTypes: ManyToMany<typeof CategoryType>

  @manyToMany(() => Indicator)
  declare indicators: ManyToMany<typeof Indicator>
}
