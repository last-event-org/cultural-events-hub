import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleName: string

  @column()
  declare canCreateEvent: boolean

  @column()
  declare canUpdateEvent: boolean

  @column()
  declare canDeleteEvent: boolean

  @column()
  declare canCreateAddress: boolean

  @column()
  declare canUpdateAddress: boolean

  @column()
  declare canDeleteAddress: boolean

  @column()
  declare canCreateCategory: boolean

  @column()
  declare canUpdateCategory: boolean

  @column()
  declare canDeleteCategory: boolean

  @column()
  declare canBlockUser: boolean

  @column()
  declare canUpdateUser: boolean

  @column()
  declare canDeleteUser: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => User)
  declare users: HasMany<typeof User>
}
