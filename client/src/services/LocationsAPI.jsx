const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/api/locations'
    : '/api/locations'

const LocationsAPI = {
  // Get all locations
  async getAllLocations() {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch locations')
    return res.json()
  },

  // Get one location by ID
  async getLocationById(id) {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error(`Failed to fetch location with id ${id}`)
    return res.json()
  },

  // Optional: add, update, delete if needed
  async createLocation(locationData) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData),
    })
    if (!res.ok) throw new Error('Failed to create location')
    return res.json()
  },

  async updateLocation(id, updatedData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
    if (!res.ok) throw new Error('Failed to update location')
    return res.json()
  },

  async deleteLocation(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete location')
    return res.json()
  },
}

export default LocationsAPI
