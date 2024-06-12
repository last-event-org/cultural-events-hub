import vine from '@vinejs/vine'


export const createEventValidator = vine.compile(
    vine.object({
      title: vine.string().maxLength(255),
      subtitle: vine.string().maxLength(255),
      description: vine.string().maxLength(255),
      // event_start: vine.date(),  // TODO adapt date/time format
      // event_end: vine.date(),  // TODO adapt date/time format
      facebook_link: vine.string().trim().maxLength(255),
      instagram_link: vine.string().trim().maxLength(255),
      website_link: vine.string().trim().maxLength(255),
    })
  )