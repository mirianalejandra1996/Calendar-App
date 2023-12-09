import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventsState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarFixtures"

describe('Test on calendarSlice', () => {


    test('calendarSlice should have name as "calendar"', () => {

        expect(calendarSlice.name).toBe("calendar")

    })

    test('calendarSlice should return initial state', () => {
    
        const state = calendarSlice.getInitialState()
        expect(state).toEqual(initialState)

    })

    test('onSetActiveEvent should active an event', () => {
        
        const event = events[1]

        const state = calendarSlice.reducer( calendarWithActiveEventsState, onSetActiveEvent(event) )

        // A veces es mejor ser bien específica que hacer test de TODO el estado.
        expect(state.activeEvent).toEqual(event)

    })


   
    test('onAddNewEvent should create a new event and set active event to null', () => {
    
        const newEvent = events[1]

        // const state = calendarSlice.reducer(calendarWithActiveEventsState, onAddNewEvent(newEvent))
        const state = calendarSlice.reducer(initialState, onAddNewEvent(newEvent))

        expect(state.events).toEqual([newEvent])

    })

    test('onUpdateEvent should update an event', () => {
    
        const newEvent = {...events[0], title: 'Titulo actualizado', notes: 'Descripción actualizada'}
        
        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(newEvent))

        expect(state.events[0]).toEqual(newEvent)
        expect(state.events).toContain(newEvent)
        
    })

    test('onDeleteEvent should remove an active event, and remove it from events', () => {
    
        
        const event = events[0]

        let state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(event))

        state = calendarSlice.reducer(state, onDeleteEvent())

        expect(state.events).toEqual([events[1]])

        // no debería existir el elemento eliminado
        expect(state.events).not.toContain(event)

        expect( state.activeEvent ).toBe(null)

    })

    test('onLoadEvents should load all events', () => {
    
        const state = calendarSlice.reducer(initialState, onLoadEvents(events))

        expect(state.events).toEqual([...events])

    })

    test('onLoadEvents should load all events and update a repeated event', () => {
    
        const newEvent = {...events[0], title: 'Titulo actualizado', notes: 'Descripción actualizada'}

        let state = calendarSlice.reducer(calendarWithEventsState, onLoadEvents([newEvent]))

        expect(state.events).toEqual([newEvent, events[1]])
        expect(state.isLoadingEvents).toBeFalsy()

        // Intentar que las pruebas sean flexibles
        expect(state.events.length).toBe(events.length)

    })

    test('onLogoutCalendar should clean state as initialState', () => {
    
        const state = calendarSlice.reducer(calendarWithEventsState, onLogoutCalendar())

        expect(state).toEqual(initialState)
    })
})