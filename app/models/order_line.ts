import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import Order from '#models/order'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Price from '#models/price'

export default class OrderLine extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Order)
  declare orderId: BelongsTo<typeof Order>

  @hasOne(() => Price)
  declare priceId: HasOne<typeof Price>
}