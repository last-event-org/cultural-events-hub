import vine from '@vinejs/vine'


export const createVendorDataValidator = vine.compile(
    vine.object({
        company_name: vine
            .string()
            .escape()
            .maxLength(255),
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
        street: vine
            .string()
            .escape()
            .maxLength(255),
        number: vine
            .string()
            .escape()
            .maxLength(10),
        zip_code: vine
            .number()
            .positive()
            .withoutDecimals(),
        city: vine
            .string()
            .escape()
            .maxLength(255),
        country: vine
            .string()
            .escape()
            .maxLength(255),
    })
)
