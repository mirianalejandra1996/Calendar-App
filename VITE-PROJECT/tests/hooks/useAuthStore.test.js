import { act, renderHook, waitFor } from "@testing-library/react";
// import { authSlice } from "../../src/store";
import { authSlice } from "../../src/store/auth/authSlice";

// import { onLogoutCalendar } from "../../src/store/calendar/calendarSlice";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authenticatedState, initialState, notAuthenticatedState } from "../fixtures/authFixtures";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api";

// import { calendarApi } from "../../src/api";

// jest.mock("../../src/api");


// ! =========
// ! Intentaba ver si podía hacer una verificación de si onLogoutCalendar había sido llamado
// ! en el startLogout
  // const mockOnLogoutCalendar = jest.fn()

// jest.mock("../../src/store/calendar/calendarSlice", () => ({
//   onLogoutCalendar: mockOnLogoutCalendar,
// }))
// ! =========


// comentario: a veces puede ser más fácil usar el store ya que EN ESTE CASO es simple de probar
// es un pequeño objeto inicial

// que hacer el mock del useSelector, del useDispatch

// * Hay que tener siempre presente que nuestras pruebas tienen que ser lo más atómicas posibles.

const getMockedStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: {
      auth: {
        ...initialState,
      },
    },
  });
};

describe("Tests on useAuthStore hook", () => {
  // Es recomendable hacer una limpieza del localStorage para asegurar que no halla grabado
  //  otros datos de otras pruebas.
  beforeEach(() => localStorage.clear());

  test("should return default values", () => {
    const mockedStore = getMockedStore(initialState);

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    // console.log(result)

    expect(result.current).toEqual({
      errorMessage: undefined,
      status: "checking",
      user: {},
      checkAuthToken: expect.any(Function),
      startLogin: expect.any(Function),
      startLogout: expect.any(Function),
      startRegister: expect.any(Function),
    });
  });

  test("startLogin should login a user correctly", async () => {
    // Es recomendable hacer una limpieza del localStorage para asegurar que no halla grabado
    //  otros datos de otras pruebas.
    // localStorage.clear();

    const mockedStore = getMockedStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      // En este momento no me va a dar porque estoy disparando un código asíncrono.
      await result.current.startLogin({ ...testUserCredentials });
    });

    // console.log(result)

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      status: "authenticated",

      // podría evaluar que en vez de que sea exactamente estos valores es que sean un string
      // por ejemplo, sin embargo, sé exactamente los valores que espero en este caso.
      user: { name: testUserCredentials.name, uid: testUserCredentials.uid },
      errorMessage: undefined,
    });

    // usar toEqual en vez de toBe
    expect(localStorage.getItem("token")).toEqual(expect.any(String));

    // Es un string porque todo lo que guardamos en el localStorage se convierte en un string.
    expect(localStorage.getItem("token-init-date")).toEqual(expect.any(String));
  });

  test("startLogin should fail", async () => {
    const mockedStore = getMockedStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      // Este correo DE PRUEBA no existe, espero a que falle
      await result.current.startLogin({
        email: "fakemail@mail.com",
        password: "1234567",
      });
    });

    // console.log(result);

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      status: "not-authenticated",
      user: {},
      errorMessage: "Invalid credentials",
    });

    // console.log(localStorage.getItem("token"));
    expect(localStorage.getItem("token")).toEqual(null);

    // probando el setTimeout
    await waitFor(() => expect(result.current.errorMessage).toBe(undefined));
  });

  test("startRegister should create a user", async () => {
    // todo: deberíamos mockear el crear un usuario
    const newUser = {
      email: "fakemail@mail.com",
      password: "1234567",
      name: "fake name",
    };

    const mockedStore = getMockedStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    // Quiero evitar que se de la petición POST SOLO EN ESTA PRUEBA
    // Creo un mock parcial solo para esta prueba. Y evitar un registro

    // También pude hacer un mock de calendarApi, pero supondría un mock de todos los métodos, pero es mucha cosa
    // para este caso.
    const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
      data: {
        ok: true,
        uid: "fake-uid",
        name: "fake-name",
        token: "fake-token",
      },
    });

    await act(async () => {
      await result.current.startRegister(newUser);
    });

    // console.log(result.current);

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      status: "authenticated",
      user: { name: "fake-name", uid: "fake-uid" },
      errorMessage: undefined,
    });

    // *OJO: Tenemos que destruir el espía para que pueda resetearse y no vaya a afectar a otras pruebas
    //  * que usen también ese POST
    spy.mockRestore();
  });

  test("startRegister should fail - user already created", async () => {
    const mockedStore = getMockedStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      // Este correo DE PRUEBA no existe, espero a que falle
      await result.current.startRegister(testUserCredentials);
    });

    // console.log(result.current);

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: "User already exist",
      status: "not-authenticated",
      user: {},
    });

    // probando el setTimeout
    await waitFor(() => expect(result.current.errorMessage).toBe(undefined));
  });

//   test("checkAuthToken should fail and logout - no token added", async () => {
//     const mockedStore = getMockedStore(initialState);

//     const { result } = renderHook(() => useAuthStore(), {
//       wrapper: ({ children }) => (
//         <Provider store={mockedStore}>{children}</Provider>
//       ),
//     });

//     // expect(localStorage.getItem("token")).toEqual(expect.any(String));

//     await act(async () => {
//       // Este correo DE PRUEBA no existe, espero a que falle
//       await result.current.checkAuthToken();
//     });

//     // console.log(result.current);
//     // console.log(localStorage.getItem("token"));

//     const { errorMessage, status, user } = result.current;

//     expect({ errorMessage, status, user }).toEqual({
//       errorMessage: undefined,
//       status: "not-authenticated",
//       user: {},
//     });
//   });

//   test("checkAuthToken should work and login if a token exist", async () => {
//     // Podría simular hacer un login con un spy en el POST y limpio.
//     // o hacer un login real

//     // * Me fui por un login real con el usuario de prueba que creamos.
//     const { data } = await calendarApi.post("/auth", testUserCredentials);

//     // console.log(data)
//     localStorage.setItem("token", data.token);

//     const mockedStore = getMockedStore(initialState);

//     const { result } = renderHook(() => useAuthStore(), {
//       wrapper: ({ children }) => (
//         <Provider store={mockedStore}>{children}</Provider>
//       ),
//     });

//     await act(async () => {
//       await result.current.checkAuthToken();
//     });

//     // console.log(result.current);

//     const { errorMessage, status, user } = result.current;

//     expect({ errorMessage, status, user }).toEqual({
//       errorMessage: undefined,
//       status: "authenticated",
//       user: {
//         name: testUserCredentials.name,
//         uid: testUserCredentials.uid,
//       },
//     });
//   });

//   test("checkAuthToken should work and login is not real or is expired", async () => {
//     localStorage.setItem("token", "fake-token");
//     // console.log(localStorage.getItem("token"));

//     const mockedStore = getMockedStore(initialState);

//     const { result } = renderHook(() => useAuthStore(), {
//       wrapper: ({ children }) => (
//         <Provider store={mockedStore}>{children}</Provider>
//       ),
//     });

//     await act(async () => {
//       await result.current.checkAuthToken();
//     });

//     // console.log(result.current);


//     // Esto ocurriría porque la función entró en el catch: hace un logout y limpia el caché 
//     expect(localStorage.getItem("token")).toBe(null);
//     expect(localStorage.getItem("token")).toEqual(null);
//   });

//   test('startLogout should logout user and call onLogoutCalendar', async () => {

//     const mockedStore = getMockedStore(authenticatedState);

//  // Espía la función onLogoutCalendar
// //  jest.spyOn(onLogoutCalendar, 'onLogoutCalendar');

// //  const spy = jest.spyOn(onLogoutCalendar, "post").mockReturnValue({
// //   data: {
// //     ok: true,
// //     uid: "fake-uid",
// //     name: "fake-name",
// //     token: "fake-token",
// //   },
// // });

//     const { result } = renderHook(() => useAuthStore(), {
//       wrapper: ({ children }) => (
//         <Provider store={mockedStore}>{children}</Provider>
//       ),
//     });

//     await act(async () => {
//       await result.current.startLogout();
//     });

//     console.log(result.current);

//     expect(result.current.user).toEqual({})

//     // expect(mockOnLogoutCalendar).toHaveBeenCalled()
//   })


})
