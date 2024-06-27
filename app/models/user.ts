import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Role from '#models/role'
import type { HasOne, HasMany, BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Address from '#models/address'
import Event from '#models/event'

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

  @column()
  declare roleId: number | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @column()
  declare billingAddressId: number | null

  @column()
  declare shippingAddressId: number | null

  @hasOne(() => Address)
  declare billingAddress: HasOne<typeof Address>

  @hasOne(() => Address)
  declare shippingAddress: HasOne<typeof Address>

  @manyToMany(() => User, {
    pivotTable: 'favourites',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'vendor_id',
  })
  declare favouritesUser: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'favourites',
    pivotForeignKey: 'vendor_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare favouritesVendor: ManyToMany<typeof User>

  @manyToMany(() => Event, {
    pivotTable: 'wishlists',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'event_id',
  })
  declare wishlistEvents: ManyToMany<typeof Event>

  async isUser() {
    const userRole = await Role.findBy('role_name', 'USER')
    if (userRole) {
      return this.roleId === userRole.id
    }
    return false
  }

  async isVendor() {
    const userRole = await Role.findBy('role_name', 'VENDOR')
    if (userRole) {
      return this.roleId === userRole.id
    }
    return false
  }

  async isAdmin() {
    const userRole = await Role.findBy('role_name', 'ADMIN')
    if (userRole) {
      return this.roleId === userRole.id
    }
    return false
  }
}
