import vine from '@vinejs/vine';
export const updateUserProfileMandatoryValidator = vine.compile(vine.object({
    first_name: vine.string().escape().maxLength(255),
    last_name: vine.string().escape().maxLength(255),
    email: vine.string().trim().escape().email().maxLength(255).normalizeEmail({
        all_lowercase: true,
    }),
}));
//# sourceMappingURL=user_profile.js.map