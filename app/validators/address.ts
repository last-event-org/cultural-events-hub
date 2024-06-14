import vine from '@vinejs/vine'


export const createAddressValidator = vine.compile(
    vine.object({
      name: vine.string().maxLength(255),
      street: vine.string().maxLength(255),
      number: vine.string().maxLength(10),
      zip_code: vine.number(),
      city: vine.string().maxLength(255),
      country: vine.string().maxLength(255),
    })
  )