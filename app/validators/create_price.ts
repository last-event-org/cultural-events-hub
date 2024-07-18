import vine from '@vinejs/vine'


export const createPriceValidator = (is_free_category: boolean) => {
    return vine.compile(
        vine.object({
            price_description: vine
                .string()
                .escape()
                .maxLength(20),
            regular_price: vine
                .number()
                .positive()
                .optional()
                .requiredWhen((_) => {
                    if (is_free_category) {
                      return false
                    }
                    return true
                  }),
            discounted_price: vine
                .number()
                .positive()
                .optional(),
            available_qty: vine
                .number()
                .withoutDecimals()
                .positive()
                .nullable()
        })
    )
}
