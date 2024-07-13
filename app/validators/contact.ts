import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const contactValidator = vine.compile(
  vine.object({
    name: vine.string().escape().maxLength(150),
    email: vine.string().trim().email().escape().maxLength(255).normalizeEmail({
      all_lowercase: true,
    }),
    message: vine.string().escape().maxLength(1000),
    copy: vine.accepted().nullable().optional(),
  })
)
