import vine from '@vinejs/vine'


export const createEventValidator = vine.compile(
    vine.object({
      title: vine.string().maxLength(255),
      subtitle: vine.string().maxLength(255),
      description: vine.string().maxLength(255),
      event_start: vine.string().trim(),  // TODO setup custom validation => event_start < event_end
      event_end: vine.string().trim(),
      facebook_link: vine.string().url().trim().maxLength(255),
      instagram_link: vine.string().url().trim().maxLength(255),
      website_link: vine.string().url().trim().maxLength(255),
      youtube_link: vine.string().url().trim().maxLength(255),
    })
  )