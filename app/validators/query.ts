import vine from '@vinejs/vine'

export const queryValidator = vine.compile(
  vine.object({
    city: vine.string().escape().maxLength(255).optional(),
    date: vine.date().optional(),
    radius: vine.number().positive().withoutDecimals().max(25).optional(),
    category: vine.number().positive().withoutDecimals().max(6).optional(),
    category_type: vine.number().positive().withoutDecimals().max(42).optional(),
  })
)
