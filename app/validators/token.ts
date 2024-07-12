import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const tokenValidator = vine.compile(
  vine.object({
    token: vine.string().trim().escape().maxLength(32),
  })
)
