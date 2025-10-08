import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Event from '../components/Event'
import EventsAPI from '../services/EventsAPI'
import LocationsAPI from '../services/LocationsAPI'
import '../css/LocationEvents.css'

const LocationEvents = () => {
    const { id } = useParams() // get location id from URL
    const [location, setLocation] = useState(null)
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const locationData = await LocationsAPI.getLocationById(id)
                setLocation(locationData)

                const eventsData = await EventsAPI.getAllEvents()
                const filteredEvents = eventsData.filter(event => event.location_id === parseInt(id))
                setEvents(filteredEvents)
            } catch (error) {
                console.error('Error loading location or events:', error)
            } finally {
                setLoading(false)
            }
        })()
    }, [id])

    if (loading) return <h2>Loading...</h2>
    if (!location) return <h2>Location not found</h2>

    return (
        <div className='location-events'>
            <header>
                <div className='location-image'>
                    <img src={location.image} alt={location.name} />
                </div>

                <div className='location-info'>
                    <h2>{location.name}</h2>
                    <p>{location.address}, {location.city}, {location.state} {location.zip}</p>
                </div>
            </header>

            <main>
                {events && events.length > 0 ? (
                    events.map((event) => (
                        <Event
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            time={event.time}
                            image={event.image}
                        />
                    ))
                ) : (
                    <h2>
                        <i className="fa-regular fa-calendar-xmark fa-shake"></i>{' '}
                        No events scheduled at this location yet!
                    </h2>
                )}
            </main>
        </div>
    )
}

export default LocationEvents
