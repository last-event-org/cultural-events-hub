import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import OrderLine from '#models/order_line'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import { LucidRow, CherryPick, ModelObject } from '@adonisjs/lucid/types/model'

export default class Order extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare purchaseDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare isPaid: boolean

  @column()
  declare userId: number | null

  @hasOne(() => User)
  declare user: HasOne<typeof User>

  @hasMany(() => OrderLine)
  declare orderLineId: HasMany<typeof OrderLine>
}
