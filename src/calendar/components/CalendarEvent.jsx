

export const CalendarEvent = ({event}) => {

    const { user , title } = event
  return (
    <>
        <strong>{ title}</strong>
        <span> - { user.name }</span>
    </>
  )
}
