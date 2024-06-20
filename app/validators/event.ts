import vine from '@vinejs/vine'


export const createEventValidator = vine.compile(
    vine.object({
      title: vine
        .string()
        .escape()
        .maxLength(255),
      subtitle: vine
        .string()
        .escape()
        .maxLength(255),
      description: vine
        .string()
        .escape()
        .maxLength(255),
      event_start: vine
        .string()
        .escape()
        .trim(),
      event_end: vine
        .string()
        .escape()
        .trim(),
      facebook_link: vine  // urls max length is not set because url() does it automatically
        .string()
        .url({
          require_protocol: true,
          protocols: ['http','https']
        })
        .trim(),
      instagram_link: vine
        .string()
        .url({
          require_protocol: true,
          protocols: ['http','https']
        })
        .trim(),
      website_link: vine
        .string()
        .url({
          require_protocol: true,
          protocols: ['http','https']
        })
        .trim(),
      youtube_link: vine
        .string()
        .url({
          require_protocol: true,
          protocols: ['http','https']
        })
        .trim(),
    })
  )