import { addHours } from "date-fns"
import { useUiStore, useCalendarStore } from "../../hooks"

export const FabAddNew = () => {

    const { openDateModal } = useUiStore()
    const { setActiveEvent } = useCalendarStore()

    const handleClickNew = () => {

        setActiveEvent({
            title: '',
            notes: '',
            start: new Date(),
            end: addHours(new Date(), 1),
            bgColor: '#fafafa',
            // user: {
            //     _id: 123,
            //     name: 'Ale',
            // }
          })
        openDateModal()
      }

  return (
    <button
        onClick={handleClickNew}
        className='btn btn-primary fab'
    >
        <i className='fas fa-plus'></i>
    </button>
  )
}
