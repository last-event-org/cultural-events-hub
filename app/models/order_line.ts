import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import Order from '#models/order'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Price from '#models/price'

export default class OrderLine extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare qty: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare orderId: number | null

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @column()
  declare priceId: number | null

  @belongsTo(() => Price)
  declare price: BelongsTo<typeof Price>
}
