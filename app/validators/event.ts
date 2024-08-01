import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    title: vine.string().escape().maxLength(255),
    subtitle: vine.string().escape().maxLength(255),
    description: vine.string().escape().trim().maxLength(1000),
    event_start: vine.string().escape().trim(),
    event_end: vine.string().escape().trim(),
    facebook_link: vine // urls max length is not set because url() does it automatically
      .string()
      .url({
        protocols: ['http', 'https'],
        require_protocol: true,
        require_host: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
      })
      .trim()
      .nullable(),
    instagram_link: vine
      .string()
      .url({
        protocols: ['http', 'https'],
        require_protocol: true,
        require_host: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
      })
      .trim()
      .nullable(),
    website_link: vine
      .string()
      .url({
        protocols: ['http', 'https'],
        require_protocol: true,
        require_host: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
      })
      .trim()
      .nullable(),
    youtube_link: vine
      .string()
      .url({
        protocols: ['http', 'https'],
        require_protocol: true,
        require_host: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
      })
      .trim()
      .nullable(),
    is_free: vine.boolean().optional(),
  })
)
