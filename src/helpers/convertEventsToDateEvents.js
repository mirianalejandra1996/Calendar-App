import { parseISO } from "date-fns"

export const convertEventsToDateEvents = (events = []) => {
  return events.map( event => ({...event, start: parseISO(event.start), end: parseISO(event.end) }))
}
