import vine from '@vinejs/vine'
vine.convertEmptyStringsToNull = true
export const queryValidator = vine.compile(
  vine.object({
    city: vine.string().optional(),
    date: vine.date().optional(),
    radius: vine.number().positive().withoutDecimals().max(25).optional().requiredIfExists('city'),
    category: vine.number().positive().withoutDecimals().max(6).optional(),
    category_type: vine.number().positive().withoutDecimals().max(42).optional(),
  })
)
