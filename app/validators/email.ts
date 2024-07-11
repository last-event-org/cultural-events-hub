import vine from '@vinejs/vine'

export const EmailValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail({
      all_lowercase: true,
    }),
  })
)
