import { fireEvent, render, screen } from "@testing-library/react"
import { Navbar } from "../../../src/calendar/components/Navbar"

import { useAuthStore } from "../../../src/hooks/useAuthStore"
import { demoUser } from "../../fixtures/authFixtures"

jest.mock("../../../src/hooks/useAuthStore")

describe('Tests on <Navbar/>', () => {

    const mockStartLogout = jest.fn()

    beforeEach(() => jest.clearAllMocks())

    test('should display the component correctly if user is logged in', () => {

        useAuthStore.mockReturnValue({
            startLogout: mockStartLogout,
            user: demoUser,
        })

        const { container } = render(<Navbar/>)

        expect(container).toMatchSnapshot()

        // display user name on navbar
        expect(screen.getByText(demoUser.name)).toBeTruthy()

        const logoutBtn = screen.getByLabelText('logout-btn')

        // console.log(logoutBtn)

        fireEvent.click(logoutBtn)

        // screen.debug()

        expect(mockStartLogout).toHaveBeenCalled()
        expect(mockStartLogout).toHaveBeenCalledTimes(1)

    })
})