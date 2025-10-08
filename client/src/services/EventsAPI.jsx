const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/api/events'
    : '/api/events'

const EventsAPI = {
  // Get all events
  async getAllEvents() {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch events')
    return res.json()
  },

  // Get one event by ID
  async getEventById(id) {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error(`Failed to fetch event with id ${id}`)
    return res.json()
  },

  // Optional: create, update, delete if needed
  async createEvent(eventData) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
    if (!res.ok) throw new Error('Failed to create event')
    return res.json()
  },

  async updateEvent(id, updatedData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
    if (!res.ok) throw new Error('Failed to update event')
    return res.json()
  },

  async deleteEvent(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete event')
    return res.json()
  },
}

export default EventsAPI
