import vine from '@vinejs/vine'


export const createVendorDataValidator = vine.compile(
    vine.object({
        company_name: vine
            .string()
            // .escape()
            .maxLength(255)
            .optional(),
        vat_number: vine
            .string()
            .escape()
            .trim()
            .maxLength(12)
            // regex rules: 
            // - must start with 'BE'
            // - 10 numbers from index 2 to 13
            // - fix numbers of characters (12)
            .regex(/^BE\d{10}$/),
    })
)
