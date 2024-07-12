import vine from '@vinejs/vine'

export const checkPriceCategoryTypeValidator = vine.compile(
  vine.object({
    is_free_category: vine
      .boolean()
      .optional()
  })
)
