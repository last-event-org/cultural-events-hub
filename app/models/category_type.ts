import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Category from '#models/category'
import Event from '#models/event'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class CategoryType extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare categoryId: number

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Event, {
    pivotTable: 'category_types_events',
    pivotForeignKey: 'category_type_id',
    pivotRelatedForeignKey: 'event_id',
  })
  declare events: ManyToMany<typeof Event>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
