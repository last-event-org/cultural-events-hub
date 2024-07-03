import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  // More permittive rules here because these fields must match the db data of a user
  // So the more restrictive rules are configured in validators/register.ts
  vine.object({
    email: vine.string().trim().email().normalizeEmail({
      all_lowercase: true,
    }),
    password: vine.string().maxLength(255),
  })
)
