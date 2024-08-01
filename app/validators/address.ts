import vine from '@vinejs/vine'

export const createAddressValidator = vine.compile(
  vine.object({
    name: vine.string().escape().maxLength(255).optional(),
    street: vine.string().escape().maxLength(255),
    number: vine.string().escape().maxLength(10),
    zip_code: vine.number().positive().min(1000).max(9999).withoutDecimals(),
    city: vine.string().escape().maxLength(255),
    country: vine.string().escape().maxLength(255).optional(),
  })
)
