import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import OrderLine from '#models/order_line'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare purchaseDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare isPaid: boolean

  @hasOne(() => User)
  declare user: HasOne<typeof User>

  @hasMany(() => OrderLine)
  declare posts: HasMany<typeof OrderLine>
}
