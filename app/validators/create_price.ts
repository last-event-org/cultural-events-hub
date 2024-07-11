import vine from '@vinejs/vine'


export const createPriceValidator = vine.compile(
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
        .nullable(),
    })
)
