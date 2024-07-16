import vine from '@vinejs/vine';
export const loginValidator = vine.compile(vine.object({
    email: vine.string().trim().email().normalizeEmail({
        all_lowercase: true,
    }),
    password: vine.string().maxLength(255),
}));
//# sourceMappingURL=auth.js.map