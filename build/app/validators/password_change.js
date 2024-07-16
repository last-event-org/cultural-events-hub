import vine from '@vinejs/vine';
export const updateUserPasswordValidator = vine.compile(vine.object({
    old_password: vine
        .string()
        .minLength(8)
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
    password: vine
        .string()
        .minLength(8)
        .confirmed()
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
}));
//# sourceMappingURL=password_change.js.map