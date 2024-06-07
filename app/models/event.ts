import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare subtitle: string

  @column()
  declare description: string

  @column()
  declare facebookLink: string

  @column()
  declare instagramLink: string

  @column()
  declare websiteLink: string

  @column.dateTime()
  declare eventStart: DateTime

  @column.dateTime()
  declare eventEnd: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
