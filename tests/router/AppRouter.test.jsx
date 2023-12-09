// import { useCalendarStore } from "../../src/hooks/useCalendarStore";
import { useAuthStore } from "../../src/hooks/useAuthStore";
// import { useUiStore } from "../../src/hooks/useUiStore";

import { render, screen } from "@testing-library/react";

import { AppRouter } from "../../src/router/AppRouter";

import { MemoryRouter } from "react-router-dom"

jest.mock("../../src/hooks/useAuthStore")


// En lugar de renderizar TODO los elementos que contienen ese componente, se estará
// reemplazando por un h1 solo para probar que llega a ver la pantalla del calendario.
jest.mock("../../src/calendar", () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}))

describe('Tests on <AppRouter />', () => {

    const mockCheckAuthToken = jest.fn()

    beforeEach(() => jest.clearAllMocks() )


    test('should display loading screen and call checkAuthToken fn', () => {
        // const { status, checkAuthToken} = useAuthStore()

        useAuthStore.mockReturnValue({
            status : 'checking',
            checkAuthToken: mockCheckAuthToken,
        })

        render(<AppRouter/>)

        // screen.debug()

        expect(screen.getByLabelText("loading-spinner")).toBeTruthy()

        expect(mockCheckAuthToken).toHaveBeenCalled()
        expect(mockCheckAuthToken).toHaveBeenCalledTimes(1)
    })

    test('should display login screen if user is not logged in', () => {

        useAuthStore.mockReturnValue({
            status : 'not-authenticated',
            checkAuthToken: mockCheckAuthToken,
        })

        const { container } = render(
            // Estoy en una ruta diferente al login para confirmar si me envía a /auth/login
            // el navigate funciona!
            <MemoryRouter initialEntries={[`/`]}>
                <AppRouter />
            </MemoryRouter>
        )

        // screen.debug()

        expect(screen.getByText('Log In')).toBeTruthy()
        
        // Porque considero que esta pantalla no será modificada luego.
        expect(container).toMatchSnapshot()
    })

    test('should display calendar screen if user is logged in', () => {

        useAuthStore.mockReturnValue({
            status : 'authenticated',
            checkAuthToken: mockCheckAuthToken,
        })
        
        render(
            // Estoy en la ruta del login para confirmar si me envía a la ruta "/"
            // el navigate funciona!
                <MemoryRouter initialEntries={[`/auth/login`]}>
                    <AppRouter />
                </MemoryRouter>
        )


        // screen.debug()

        // Hubiera tenido un problema ya que tendría que mockear los otros custom hooks que
        // están involucrados en el CalendarPage, asi que lo que vamos a hacer es mockear el CalendarPage.
        // * Ver arriba el mock


        expect(screen.getByText('CalendarPage')).toBeTruthy()
        
    })
})