import { createSlice } from '@reduxjs/toolkit'
// import { addHours } from "date-fns";


// const tempEvent = {
//   _id: new Date().getTime(),
//   title: 'Cumpleaños del jefe',
//   note: 'Hay que comprar el pastel',
//   start: new Date(),
//   end: addHours(new Date(), 1),
//   bgColor: '#fafafa',
//   user: {
//       _id: 123,
//       name: 'Ale',
//   }
// }

const initialState = {
  // events: [tempEvent],
  isLoadingEvents: true,
  events: [],
  activeEvent: null,
}

export const calendarSlice = createSlice({
  name:  'calendar',
  initialState,
  reducers: {
    onSetActiveEvent: (state, {payload}) => {
      state.activeEvent = payload
    },
    onAddNewEvent: (state, {payload}) => {
      state.events.push(payload)
      state.activeEvent = null
    },
    onUpdateEvent: (state, {payload}) => {
      state.events = state.events.map(calendarEvent => calendarEvent.id === payload.id ? payload : calendarEvent)
      state.activeEvent = null
    },
    onDeleteEvent: (state) => {
      state.events = state.events.filter(calendarEvent => calendarEvent.id !== state.activeEvent.id)
      state.activeEvent = null
    },
    // I can add or update an event here
    onLoadEvents: (state, {payload = []}) => {
      // state.events = payload
      // state.events = [...state.events,...payload]
      // state.events = state.events

      payload.forEach(event => {
        // const exists = state.events.find(dbEvent => dbEvent.id === event.id) // return an object or undefined
        const exists = state.events.some(dbEvent => dbEvent.id === event.id) // return a boolean

        if (exists) {
          // If event exist update only the old
          state.events = state.events.map( dbEvent => dbEvent.id === event.id ? event : dbEvent )
        } else {
          // If event doesn't exist then add it to the list
          state.events.push(event)
        }

      });

      state.isLoadingEvents = false
    },
    onLogoutCalendar: (state) => {
      state.isLoadingEvents = true
      state.events = []
      state.activeEvent = null
    }
  },
})

// Action creators are generated for each case reducer function
export const { onSetActiveEvent,
   onAddNewEvent ,
   onLogoutCalendar,
   onDeleteEvent,
   onLoadEvents,
   onUpdateEvent ,
  } = calendarSlice.actions
