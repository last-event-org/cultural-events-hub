import vine from '@vinejs/vine';
export const resetPasswordValidator = vine.compile(vine.object({
    password: vine
        .string()
        .minLength(8)
        .confirmed()
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
    email: vine.string().trim().email().escape().normalizeEmail({
        all_lowercase: true,
    }),
}));
//# sourceMappingURL=reset_password.js.map