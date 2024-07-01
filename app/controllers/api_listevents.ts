import Event from '#models/event'

export default class ListEvents {
  /**
   * Display a list of resource
   */
  async getEvents() {
    console.log('getevents api')
    // const events = await db.from('events').select('title', 'subtitle', 'description')
    const events = await Event.query()
      .orderBy('event_start', 'asc')
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')
      .orderBy('event_start', 'asc')
    return events
  }
}
