import { useEffect, useState } from 'react'

import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from "../"

import { getMessagesES, localizer } from '../../helpers'

import { useUiStore, useCalendarStore, useAuthStore} from '../../hooks'

// import { useSelector } from 'react-redux'

export const CalendarPage = () => {
  
  const { user } = useAuthStore()
    
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')
  
  const { events, setActiveEvent, startLoadingEvents} = useCalendarStore()

  const { openDateModal } = useUiStore()

  useEffect(() => {
    startLoadingEvents()
  }, [])


  const eventStyleGetter = (event, start, end, isSelected) => {

    const isMyEvent = user.uid === event?.user?._id

    const style = {
      backgroundColor: isMyEvent ? "#347CF7" : "#465660",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
    }

    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    openDateModal()
  }

  const onSelect = (event) => {
    setActiveEvent(event)
  }

  const onViewChanged = (event) => {
    localStorage.setItem('lastView',  event)
    
  }

  return (
    <>
        <Navbar/>

        <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc( 100vh - 80px )' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
        />

        <CalendarModal/>
        <FabAddNew/>
        <FabDelete/>
    </>
  )
}
