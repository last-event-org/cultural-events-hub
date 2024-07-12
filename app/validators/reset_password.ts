import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const resetPasswordValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .minLength(8)
      .confirmed()
      // regex rules:
      // - at least 1 uppercase letter
      // - at least 1 number
      // - at least 1 symbol
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
    email: vine.string().trim().email().escape().normalizeEmail({
      all_lowercase: true,
    }),
  })
)
