import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Event from '#models/event'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await Event.createMany([
      {
        title: 'Summer Jazz Festival',
        subtitle: 'A Celebration of Jazz Music Under the Stars',
        description:
          'Join us for an unforgettable night of jazz music featuring talented musicians from around the world. Enjoy smooth melodies and soulful rhythms in a magical outdoor setting.',
        facebookLink: 'https://www.facebook.com/summerjazzfestival',
        instagramLink: 'https://www.instagram.com/summerjazzfestival',
        websiteLink: 'https://www.summerjazzfestival.com',
        youtubeLink: 'https://www.youtube.com/summerjazzfestival',
        eventStart: '2024-06-25T19:00:00',
        eventEnd: '2024-06-25T23:00:00',
        locationId: 3,
      },
      {
        title: 'Food Truck Fiesta',
        subtitle: 'A Culinary Adventure for Food Lovers',
        description:
          'Experience the ultimate food truck extravaganza with a diverse array of gourmet dishes from around the world. Treat your taste buds to a night of delicious food and vibrant atmosphere.',
        facebookLink: 'https://www.facebook.com/foodtruckfiesta',
        instagramLink: 'https://www.instagram.com/foodtruckfiesta',
        websiteLink: 'https://www.foodtruckfiesta.com',
        youtubeLink: 'https://www.youtube.com/foodtruckfiesta',
        eventStart: '2024-07-10T17:00:00',
        eventEnd: '2024-07-10T21:00:00',
        locationId: 8,
      },
      {
        title: 'Art in the Park',
        subtitle: 'Celebrating Creativity and Community',
        description:
          'Join us for an inspiring day of art and culture in the heart of the city park. Explore a diverse range of artworks, interact with artists, and enjoy live performances throughout the day.',
        facebookLink: 'https://www.facebook.com/artinthepark',
        instagramLink: 'https://www.instagram.com/artinthepark',
        websiteLink: 'https://www.artinthepark.com',
        youtubeLink: 'https://www.youtube.com/artinthepark',
        eventStart: '2024-07-15T10:00:00',
        eventEnd: '2024-07-15T15:00:00',
        locationId: 5,
      },
      {
        title: 'Rock the Block Party',
        subtitle: 'An Epic Street Festival of Music and Fun',
        description:
          "Get ready to rock out at the biggest block party of the summer! Enjoy live bands, DJ sets, food trucks, and interactive activities for all ages. Don't miss this high-energy celebration!",
        facebookLink: 'https://www.facebook.com/rocktheblockparty',
        instagramLink: 'https://www.instagram.com/rocktheblockparty',
        websiteLink: 'https://www.rocktheblockparty.com',
        youtubeLink: 'https://www.youtube.com/rocktheblockparty',
        eventStart: '2024-07-28T18:00:00',
        eventEnd: '2024-07-28T22:00:00',
        locationId: 12,
      },
      {
        title: 'Cultural Fusion',
        subtitle: 'Exploring Diversity Through Music and Dance',
        description:
          'Celebrate cultural diversity with a dynamic showcase of music, dance, and traditions from around the world. Immerse yourself in a colorful tapestry of performances that will captivate and inspire.',
        facebookLink: 'https://www.facebook.com/culturalfusion',
        instagramLink: 'https://www.instagram.com/culturalfusion',
        websiteLink: 'https://www.culturalfusion.com',
        youtubeLink: 'https://www.youtube.com/culturalfusion',
        eventStart: '2024-08-05T16:30:00',
        eventEnd: '2024-08-05T20:30:00',
        locationId: 9,
      },
      {
        title: "Midsummer Night's Dream",
        subtitle: 'An Enchanted Evening of Shakespearean Theatre',
        description:
          "Step into the magical world of Shakespeare's 'A Midsummer Night's Dream' performed under the stars. Experience romance, comedy, and enchantment in a captivating outdoor setting.",
        facebookLink: 'https://www.facebook.com/midsummernightsdream',
        instagramLink: 'https://www.instagram.com/midsummernightsdream',
        websiteLink: 'https://www.midsummernightsdream.com',
        youtubeLink: 'https://www.youtube.com/midsummernightsdream',
        eventStart: '2024-08-10T19:30:00',
        eventEnd: '2024-08-10T22:30:00',
        locationId: 6,
      },
      {
        title: 'Summer Salsa Night',
        subtitle: 'Dance the Night Away with Hot Latin Beats',
        description:
          'Heat up the dance floor with sizzling salsa rhythms and Latin beats! Join us for a night of lively music, dance lessons, and performances by top salsa artists. No partner necessary!',
        facebookLink: 'https://www.facebook.com/summersalsanight',
        instagramLink: 'https://www.instagram.com/summersalsanight',
        websiteLink: 'https://www.summersalsanight.com',
        youtubeLink: 'https://www.youtube.com/summersalsanight',
        eventStart: '2024-08-15T20:00:00',
        eventEnd: '2024-08-15T23:00:00',
        locationId: 10,
      },
      {
        title: 'Festival of Lights',
        subtitle: 'A Spectacular Celebration of Cultural Diversity',
        description:
          'Experience a mesmerizing display of lights, performances, and cultural showcases from around the world. Celebrate unity and diversity under the night sky with family-friendly activities.',
        facebookLink: 'https://www.facebook.com/festivaloflights',
        instagramLink: 'https://www.instagram.com/festivaloflights',
        websiteLink: 'https://www.festivaloflights.com',
        youtubeLink: 'https://www.youtube.com/festivaloflights',
        eventStart: '2024-08-20T19:00:00',
        eventEnd: '2024-08-20T23:00:00',
        locationId: 2,
      },
      {
        title: 'Summer Comedy Showcase',
        subtitle: 'Laughs Galore with Top Stand-Up Comedians',
        description:
          'Get ready to bust a gut with hilarious stand-up comedy from some of the best comedians in the business. A night of non-stop laughter and unforgettable moments awaits!',
        facebookLink: 'https://www.facebook.com/summercomedyshowcase',
        instagramLink: 'https://www.instagram.com/summercomedyshowcase',
        websiteLink: 'https://www.summercomedyshowcase.com',
        youtubeLink: 'https://www.youtube.com/summercomedyshowcase',
        eventStart: '2024-08-25T19:30:00',
        eventEnd: '2024-08-25T22:30:00',
        locationId: 4,
      },
      {
        title: 'Carnival Extravaganza',
        subtitle: 'A Festive Celebration of Music, Dance, and Fun',
        description:
          'Step right up to the carnival extravaganza of the summer! Enjoy thrilling rides, delicious treats, live music, and dazzling performances that will delight visitors of all ages.',
        facebookLink: 'https://www.facebook.com/carnivalextravaganza',
        instagramLink: 'https://www.instagram.com/carnivalextravaganza',
        websiteLink: 'https://www.carnivalextravaganza.com',
        youtubeLink: 'https://www.youtube.com/carnivalextravaganza',
        eventStart: '2024-06-28T16:00:00',
        eventEnd: '2024-06-28T21:00:00',
        locationId: 7,
      },
      {
        title: 'Garden Serenade',
        subtitle: 'An Evening of Classical Music in a Botanical Paradise',
        description:
          'Immerse yourself in the beauty of classical music surrounded by blooming gardens. Enjoy enchanting melodies performed by talented musicians in a serene and picturesque setting.',
        facebookLink: 'https://www.facebook.com/gardenserenade',
        instagramLink: 'https://www.instagram.com/gardenserenade',
        websiteLink: 'https://www.gardenserenade.com',
        youtubeLink: 'https://www.youtube.com/gardenserenade',
        eventStart: '2024-07-05T18:30:00',
        eventEnd: '2024-07-05T21:30:00',
        locationId: 11,
      },
      {
        title: 'Summer Movie Marathon',
        subtitle: 'Outdoor Cinema Bliss Under the Stars',
        description:
          'Grab your blankets and popcorn for a cinematic journey under the stars. Experience classic films and family favorites in an enchanting outdoor setting.',
        facebookLink: 'https://www.facebook.com/summermoviemarathon',
        instagramLink: 'https://www.instagram.com/summermoviemarathon',
        websiteLink: 'https://www.summermoviemarathon.com',
        youtubeLink: 'https://www.youtube.com/summermoviemarathon',
        eventStart: '2024-07-20T20:00:00',
        eventEnd: '2024-07-20T23:00:00',
        locationId: 13,
      },
      {
        title: 'Sunset Yoga Retreat',
        subtitle: 'Relax and Rejuvenate with Sunset Yoga',
        description:
          'Unwind with a soothing yoga session as the sun sets over the tranquil beach. Connect with your inner peace and recharge your mind, body, and spirit in a serene natural environment.',
        facebookLink: 'https://www.facebook.com/sunsetyogaretreat',
        instagramLink: 'https://www.instagram.com/sunsetyogaretreat',
        websiteLink: 'https://www.sunsetyogaretreat.com',
        youtubeLink: 'https://www.youtube.com/sunsetyogaretreat',
        eventStart: '2024-07-12T18:00:00',
        eventEnd: '2024-07-12T20:00:00',
        locationId: 14,
      },
      {
        title: 'Summer Fashion Showcase',
        subtitle: 'Glamour, Style, and Runway Excellence',
        description:
          'Experience the latest trends and designs at our summer fashion showcase. From haute couture to casual chic, this event celebrates creativity and style in the world of fashion.',
        facebookLink: 'https://www.facebook.com/summerfashionshowcase',
        instagramLink: 'https://www.instagram.com/summerfashionshowcase',
        websiteLink: 'https://www.summerfashionshowcase.com',
        youtubeLink: 'https://www.youtube.com/summerfashionshowcase',
        eventStart: '2024-07-18T19:30:00',
        eventEnd: '2024-07-18T22:30:00',
        locationId: 15,
      },
      {
        title: 'Summer Wine Tasting',
        subtitle: 'Sip, Swirl, and Savor Delicious Wines',
        description:
          'Indulge in an evening of wine tasting featuring a selection of fine wines from around the world. Discover new favorites and enjoy gourmet pairings in a relaxed and sophisticated atmosphere.',
        facebookLink: 'https://www.facebook.com/summerwinetasting',
        instagramLink: 'https://www.instagram.com/summerwinetasting',
        websiteLink: 'https://www.summerwinetasting.com',
        youtubeLink: 'https://www.youtube.com/summerwinetasting',
        eventStart: '2024-08-03T18:00:00',
        eventEnd: '2024-08-03T21:00:00',
        locationId: 1,
      },
      {
        title: 'Summer Drum Circle',
        subtitle: 'Join the Rhythm of the Summer Beat',
        description:
          'Feel the pulse of the season with a vibrant drum circle under the open sky. Bring your drums or just your hands and join the community in a rhythmic celebration of summer.',
        facebookLink: 'https://www.facebook.com/summerdrumcircle',
        instagramLink: 'https://www.instagram.com/summerdrumcircle',
        websiteLink: 'https://www.summerdrumcircle.com',
        youtubeLink: 'https://www.youtube.com/summerdrumcircle',
        eventStart: '2024-07-08T17:00:00',
        eventEnd: '2024-07-08T19:00:00',
        locationId: 3,
      },
      {
        title: 'Summer Science Fair',
        subtitle: 'Inspiring Curiosity and Innovation',
        description:
          'Explore the wonders of science with interactive exhibits, experiments, and demonstrations for all ages. Join us for a day of discovery and hands-on learning in a fun and educational environment.',
        facebookLink: 'https://www.facebook.com/summersciencefair',
        instagramLink: 'https://www.instagram.com/summersciencefair',
        websiteLink: 'https://www.summersciencefair.com',
        youtubeLink: 'https://www.youtube.com/summersciencefair',
        eventStart: '2024-07-25T10:00:00',
        eventEnd: '2024-07-25T15:00:00',
        locationId: 9,
      },
      {
        title: 'Summer Shakespeare in the Park',
        subtitle: 'Classic Theatre Al Fresco',
        description:
          'Experience the magic of Shakespeare performed in the beauty of nature. Enjoy timeless tales, captivating performances, and the enchantment of live theatre under the summer sky.',
        facebookLink: 'https://www.facebook.com/summershakespeare',
        instagramLink: 'https://www.instagram.com/summershakespeare',
        websiteLink: 'https://www.summershakespeare.com',
        youtubeLink: 'https://www.youtube.com/summershakespeare',
        eventStart: '2024-08-01T19:00:00',
        eventEnd: '2024-08-01T22:00:00',
        locationId: 11,
      },
      {
        title: 'Summer Dance Party',
        subtitle: 'Groove to the Hottest Beats of the Season',
        description:
          'Get ready to dance the night away with an electrifying lineup of DJs and performers. This summer dance party promises non-stop energy, incredible music, and unforgettable moments.',
        facebookLink: 'https://www.facebook.com/summerdanceparty',
        instagramLink: 'https://www.instagram.com/summerdanceparty',
        websiteLink: 'https://www.summerdanceparty.com',
        youtubeLink: 'https://www.youtube.com/summerdanceparty',
        eventStart: '2024-08-08T21:00:00',
        eventEnd: '2024-08-08T23:59:00',
        locationId: 5,
      },
    ])
  }
}
