import { act, renderHook, waitFor } from "@testing-library/react";
import { useUiStore } from "../../src/hooks/useUiStore";
import { uiSlice } from "../../src/store";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// comentario: a veces puede ser más fácil usar el store ya que EN ESTE CASO es simple de probar
// es un pequeño objeto inicial

// que hacer el mock del useSelector, del useDispatch

// * Hay que tener siempre presente que nuestras pruebas tienen que ser lo más atómicas posibles.

const getMockedStore = (initialState) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
    },
    preloadedState: {
      ui: {
        ...initialState,
      },
    },
  });
};

describe("Tests on useUiStore hook", () => {

  beforeEach(() => jest.clearAllMocks());

  test("should return default values", () => {
    const mockedStore = getMockedStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    // console.log(result)
    expect(result.current).toEqual({
      isDateModalOpen: false,
      closeDateModal: expect.any(Function),
      openDateModal: expect.any(Function),
      toggleDateModal: expect.any(Function),
    });
  });

  test("openDateModal should change isDateModalOpen to true", () => {
    const mockedStore = getMockedStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    // como se desestructuró ya no cambian de valor, porque ya se vuelven valores primitivos
    // es como que hayamos creado una variable con ese nombre.
    // const { openDateModal, isDateModalOpen } = result.current;
    const { openDateModal } = result.current;

    act(() => {
      openDateModal();
    });

    // * Es más recomendable que tomemos el isDateModal desde el result.current para confirmar que todo cambió bien.
    expect(result.current.isDateModalOpen).toBeTruthy(); // si va a funcionar
    // expect(isDateModalOpen).toBe(true); // no va a funcionar
    
    // console.log({ result: result.current, isDateModalOpen})
  });

  test("closeDateModal should change isDateModalOpen to true", () => {
    const mockedStore = getMockedStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    // como se desestructuró ya no cambian de valor, porque ya se vuelven valores primitivos
    // es como que hayamos creado una variable con ese nombre.
    const { closeDateModal } = result.current;

    act(() => {
      closeDateModal();
    });

    // * Es más recomendable que tomemos el isDateModal desde el result.current para confirmar que todo cambió bien.
    expect(result.current.isDateModalOpen).toBeFalsy(); // si va a funcionar
    // expect(isDateModalOpen).toBe(true); // no va a funcionar
    
    // console.log({ result: result.current, isDateModalOpen})
  });

  test("toggleDateModal should toggle isDateModalOpen", async () => {
    const mockedStore = getMockedStore({ isDateModalOpen: false });

    // console.log(mockedStore.getState())

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    act(() => {
      result.current.toggleDateModal();
    });

    expect(result.current.isDateModalOpen).toBeTruthy();

    act(() => {
      result.current.toggleDateModal();
    });

    expect(result.current.isDateModalOpen).toBeFalsy(); // si va a funcionar
   
  });
  
});
