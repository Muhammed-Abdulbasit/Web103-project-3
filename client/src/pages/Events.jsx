import React, { useState, useEffect } from 'react'
import EventsAPI from '../services/EventsAPI'
import Event from '../components/Event'


const Events = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await EventsAPI.getAllEvents()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className='events-page'>
      <h2>All Events</h2>
      {events.length > 0 ? (
        <div className='events-list'>
          {events.map((event) => (
            <Event
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              image={event.image}
            />
          ))}
        </div>
      ) : (
        <h3>No events available</h3>
      )}
    </div>
  )
}

export default Events
