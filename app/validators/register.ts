import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createRegisterValidator = vine.compile(
  vine.object({
    password: vine.string().trim().minLength(4).confirmed(),
    first_name: vine.string().trim().maxLength(255),
    last_name: vine.string().trim().maxLength(255),
    email: vine.string().trim().escape().email().normalizeEmail({
      all_lowercase: true,
    }),

    // TODO add validation rules for the password strength
  })
)
