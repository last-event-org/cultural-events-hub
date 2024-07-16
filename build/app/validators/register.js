import vine from '@vinejs/vine';
export const createRegisterValidator = vine.compile(vine.object({
    password: vine
        .string()
        .minLength(8)
        .confirmed()
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
    first_name: vine.string().escape().maxLength(255),
    last_name: vine.string().escape().maxLength(255),
    email: vine.string().trim().email().escape().normalizeEmail({
        all_lowercase: true,
    }),
}));
//# sourceMappingURL=register.js.map