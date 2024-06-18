import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Event from '#models/event'

export default class Indicator extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Event, {
    pivotTable: 'indicators_events',
    pivotForeignKey: 'indicator_id',
    pivotRelatedForeignKey: 'event_id',
  })
  declare events: ManyToMany<typeof Event>
}
