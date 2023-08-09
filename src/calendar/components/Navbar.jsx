import React from 'react'
import { useAuthStore, useCalendarStore } from '../../hooks'

export const Navbar = () => {

  const {startLogout, user} = useAuthStore()

  const handleLogout = () => {
    startLogout()
  }
  return (
    <div className='navbar navbar-dark bg-dark mb-4 px-4'>
        <span className='navbar-brand capitalize'>
            <i className='fas fa-calendar-alt'></i>
            &nbsp;
            &nbsp;
            {user.name}
        </span>

        <button onClick={handleLogout} className='btn btn-outline-danger'>
            <i className='fa fa-sign-out-alt'></i>
            &nbsp;
            <span>Salir</span>
        </button>
    </div>
  )
}
