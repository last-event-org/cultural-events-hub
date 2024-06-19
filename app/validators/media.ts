import vine from '@vinejs/vine'


export const createMediaValidator = vine.compile(
    vine.object({
      images_link: vine.array(
          vine.file({
            size: '2mb',
            extnames: ['jpg', 'png']
          })
        )
      })
    
  )