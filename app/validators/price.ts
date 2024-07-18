import vine from '@vinejs/vine'

export const createPricesValidator = vine.compile(
  vine.object({
    prices: vine.array(
      vine.object({
        price_description: vine
          .string()
          .escape()
          .maxLength(255),
        regular_price: vine
          .number()
          .positive(),
        discounted_price: vine
          .number()
          .positive()
          .nullable(),
        available_qty: vine
          .number()
          .withoutDecimals()
          .positive()
          .nullable()
      })
    )
  })
)
