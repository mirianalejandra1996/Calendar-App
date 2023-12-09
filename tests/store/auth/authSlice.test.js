import {
  authSlice,
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../../../src/store/auth/authSlice";
import {
  authenticatedState,
  initialState,
  notAuthenticatedState,
//   demoUser,
//   notAuthenticatedStateWithError,
} from "../../fixtures/authFixtures";
import { testUserCredentials } from "../../fixtures/testUser";

describe("Tests on authSlice", () => {
  test('should return initial state and call it "auth"', () => {
    const state = authSlice.getInitialState();

    expect(state).toEqual(initialState);

    expect(authSlice.name).toBe("auth");
  });

  test("onLogin should make authentication", () => {
    // let state = authSlice.getInitialState();
    // let stateInitial = authSlice.getInitialState();
    
    // state = authSlice.reducer(state, onLogin(demoUser));

    
    // const state = authSlice.reducer(initialState, onLogin(demoUser));
    // expect(state).toEqual(authenticatedState);
    const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
    expect(state).toEqual({
        status: "authenticated",
        user: testUserCredentials,
        errorMessage: undefined,
    });
  });

  test("onLogout should make logout without arguments", () => {
    const state = authSlice.reducer(authenticatedState, onLogout());

    expect(state).toEqual(notAuthenticatedState);
  });

  test("onLogout should make logout with argument and display an error message", () => {

    const errorMessage = "Credenciales no válidas"
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));

    expect(state).toEqual({
        status: 'not-authenticated',
        user: {},
        errorMessage: errorMessage,
    });
  });

  test("clearErrorMessage should clean and dont display an error message", () => {
    
    // set error message
    const errorMessage = "Credenciales no válidas"
    let state = authSlice.reducer(authenticatedState, onLogout(errorMessage));

    // clean message
    state = authSlice.reducer(state,clearErrorMessage());

    expect(state).toEqual(notAuthenticatedState);
  });

  test("onChecking should clean and dont display an error message", () => {

    // o también puedo colocar el estado autenticado. pero que no se parezca al initial porque se parece al onChecking
    const state = authSlice.reducer(notAuthenticatedState, onChecking());
    // expect(state).toEqual(initialState);
    expect(state.errorMessage).toBe(undefined);
    
  });

  
});
