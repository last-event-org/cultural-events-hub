import vine from '@vinejs/vine';
export const tokenValidator = vine.compile(vine.object({
    token: vine.string().trim().escape().maxLength(32),
}));
//# sourceMappingURL=token.js.map