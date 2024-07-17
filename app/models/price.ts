import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Event from '#models/event'

export default class Price extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string

  @column()
  declare regularPrice: number

  @column()
  declare discountedPrice: number

  @column()
  declare availableQty: number

  @column()
  declare eventId: number

  @column()
  declare type: string

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
