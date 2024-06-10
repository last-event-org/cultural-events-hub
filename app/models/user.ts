import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Role from '#models/role'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import Address from '#models/address'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare firstname: string | null

  @column()
  declare lastname: string | null

  @column()
  declare companyName: string | null

  @column()
  declare vatNumber: string | null

  @column()
  declare isBlocked: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => Role)
  declare roleId: HasOne<typeof Role>

  @hasOne(() => Address)
  declare billingAddress: HasOne<typeof Address>

  @hasOne(() => Address)
  declare shippingAddress: HasOne<typeof Address>

  @hasMany(() => User)
  declare favourites: HasMany<typeof User>
}
