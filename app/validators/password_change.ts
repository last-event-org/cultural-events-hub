import vine from '@vinejs/vine'

export const updateUserPasswordValidator = vine.compile(
  vine.object({
    old_password: vine
      .string()
      .minLength(8)
      // regex rules:
      // - at least 1 uppercase letter
      // - at least 1 number
      // - at least 1 symbol
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
    password: vine
      .string()
      .minLength(8)
      .confirmed()
      // regex rules:
      // - at least 1 uppercase letter
      // - at least 1 number
      // - at least 1 symbol
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
  })
)
