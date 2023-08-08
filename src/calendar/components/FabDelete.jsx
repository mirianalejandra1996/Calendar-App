import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks"

export const FabDelete = () => {

    const { startDeletingEvent, activeEvent, hasEventSelected } = useCalendarStore()
    const { isDateModalOpen } = useUiStore()
    const { user } = useAuthStore()
    const isMyEvent = user?.uid === activeEvent?.user?._id

    const handleDelete = () => {

        if(!activeEvent) return

        startDeletingEvent(activeEvent)
      }

  return (
    <>
    {
      isMyEvent
      ? (
        <button
        onClick={handleDelete}
        className='btn btn-danger fab-danger'
        style={{display: (hasEventSelected && !isDateModalOpen ) ? '' : 'none'}}
    >
        <i className='fas fa-trash-alt'></i>
    </button>
      )
      : null
    }
    </>
  )
}
