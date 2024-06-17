import vine from '@vinejs/vine'


export const createPriceValidator = vine.compile(
    vine.object({
      price_description: vine.string().maxLength(255),
      regular_price: vine.number().positive(),
      discounted_price: vine.number().positive(),
      available_qty: vine.number().positive(),
    })
  )