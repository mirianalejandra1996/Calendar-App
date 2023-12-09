import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice"

describe('Tests on uiSlice', () => {

    test('should return initial state and call it "ui"', () => {
        

        // Para también garantizar y saber alguien agregó más propiedades nuevas al store por ejemplo.
        expect(uiSlice.getInitialState()).toEqual({isDateModalOpen: false})
        
        expect(uiSlice.name).toBe('ui')
    })

    test('should change isDateModalOpen correctly', () => {

        // empieza en false
        let state = uiSlice.getInitialState()

        // se queda abierto
        state = uiSlice.reducer( state , onOpenDateModal())

        // expect(state).toEqual({isDateModalOpen: true})
        expect(state.isDateModalOpen).toBeTruthy()

        // se queda cerrado
        state = uiSlice.reducer( state , onCloseDateModal())

        // expect(state).toEqual({isDateModalOpen: false})
        expect(state.isDateModalOpen).toBeFalsy()

    
    })

})