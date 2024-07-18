import vine from '@vinejs/vine'
vine.convertEmptyStringsToNull = true
export const queryValidator = vine.compile(
  vine.object({
    city: vine.string().optional(),
    date: vine.date().optional().nullable(),
    radius: vine.number().positive().withoutDecimals().max(25).optional(),
    category: vine.number().positive().withoutDecimals().max(6).optional(),
    categoryType: vine.number().positive().withoutDecimals().max(42).optional(),
  })
)
