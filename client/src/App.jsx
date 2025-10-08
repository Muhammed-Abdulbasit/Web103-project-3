import React from 'react'
import { useRoutes, Link } from 'react-router-dom'
import Locations from './pages/Locations'
import LocationEvents from './pages/LocationEvents'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <Locations />
    },
    {
      path: '/location/1',
      element: <LocationEvents index={1} />
    },
    {
      path: '/location/2',
      element: <LocationEvents index={2} />
    },
    {
      path: '/location/3',
      element: <LocationEvents index={3} />
    },
    {
      path: '/location/4',
      element: <LocationEvents index={4} />
    }
  ])

  return (
    <div className='app'>
      <header className='main-header'>
        <h1>Fantasy Community Space</h1>
        <div className='header-buttons'>
          <Link to='/' role='button'>Home</Link>
        </div>
      </header>

      <main>
        {element}
      </main>
    </div>
  )
}

export default App
