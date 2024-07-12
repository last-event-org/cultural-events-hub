import vine from '@vinejs/vine'
import Event from '#models/event'

export const createPriceValidator = (event: Event, is_free_category: boolean) => {
    return vine.compile(
        vine.object({
            price_description: vine
                .string()
                .escape()
                .maxLength(255)
                .optional()
                .requiredWhen((_) => {
                    if (event.isFree) {
                      return false
                    }
                    console.log('\n\n\nTEST\n\n\n');
                    return true
                  }),
            regular_price: vine
                .number()
                .positive()
                .optional()
                .requiredWhen((_) => {
                    if (event.isFree || is_free_category) {
                      return false
                    }
                    return true
                  }),
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
}
