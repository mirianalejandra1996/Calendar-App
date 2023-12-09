import { fireEvent, render, screen } from "@testing-library/react"
import { FabAddNew } from "../../../src/calendar/components/FabAddNew"

import { useUiStore } from "../../../src/hooks/useUiStore"
import { useCalendarStore } from "../../../src/hooks/useCalendarStore"

jest.mock("../../../src/hooks/useUiStore")
jest.mock("../../../src/hooks/useCalendarStore")

describe('Tests on <FabAddNew />', () => {
    
    const mockSetActiveEvent = jest.fn()
    const mockOpenDateModal = jest.fn()

    beforeEach(() => jest.clearAllMocks())

    test('should display correctly', () => {

        useUiStore.mockReturnValue({
            openDateModal: mockOpenDateModal,
        })
    
        useCalendarStore.mockReturnValue({
            setActiveEvent: mockSetActiveEvent,
        })

        render(<FabAddNew/>)

        const addEventBtn = screen.getByRole("button")

        fireEvent.click(addEventBtn)

        const event = {
            title: '',
            notes: '',
            start: expect.any(Date),
            end: expect.any(Date),
            bgColor: '#fafafa',
        };

        expect(mockSetActiveEvent).toHaveBeenCalledWith(event)
        expect(mockOpenDateModal).toHaveBeenCalled()

    })
})