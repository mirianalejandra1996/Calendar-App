import { fireEvent, render, screen } from "@testing-library/react";
import { LoginPage } from "../../../src/auth/pages/LoginPage";

import { useAuthStore } from "../../../src/hooks/useAuthStore";

import Swal from "sweetalert2";

jest.mock("../../../src/hooks/useAuthStore");

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("Tests on <LoginPage />", () => {
  const mockStartLogin = jest.fn();
  const mockStartRegister = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test("should display component correctly", () => {
    useAuthStore.mockReturnValue({
      startLogin: mockStartLogin,
      errorMessage: undefined,
      startRegister: mockStartRegister,
    });

    render(<LoginPage />);

    // screen.debug()

    expect(screen.getByText("Log In")).toBeTruthy();
    expect(screen.getByText("Sign Up")).toBeTruthy();
  });

  test("should login a user and call startLogin dispatcher", () => {
    useAuthStore.mockReturnValue({
      startLogin: mockStartLogin,
      errorMessage: undefined,
      startRegister: mockStartRegister,
    });

    render(<LoginPage />);

    const emailValue = "prueba@example.com";
    const pwdValue = "12121212";

    const emailField = screen.getByLabelText("loginEmail");
    const pwdField = screen.getByLabelText("loginPassword");

    fireEvent.change(emailField, {
      target: { name: "loginEmail", value: emailValue },
    });
    fireEvent.change(pwdField, {
      target: { name: "loginPassword", value: pwdValue },
    });

    // screen.debug()

    const form = screen.getByLabelText("login-form");

    fireEvent.submit(form);

    expect(mockStartLogin).toHaveBeenCalledWith({
      email: emailValue,
      password: pwdValue,
    });
  });

  test('should register a user and call startRegister dispatcher', () => {

      useAuthStore.mockReturnValue({
          startLogin: mockStartLogin,
          errorMessage: undefined,
          startRegister: mockStartRegister,
      })

      render(<LoginPage/>)

      const nameValue = "Ale"
      const emailValue = "prueba@example.com"
      const pwdValue = "12121212"

      const nameField = screen.getByLabelText("registerName");
      const emailField = screen.getByLabelText("registerEmail");
      const pwdField = screen.getByLabelText("registerPassword");
      const pwd2Field = screen.getByLabelText("registerPassword2");

      fireEvent.change(nameField, { target: { name: "registerName", value: nameValue }})
      fireEvent.change(emailField, { target: { name: "registerEmail", value: emailValue }})

      fireEvent.change(pwdField, { target: { name: "registerPassword", value: pwdValue }})
      fireEvent.change(pwd2Field, { target: { name: "registerPassword2", value: pwdValue }})

      // screen.debug()

      const form = screen.getByLabelText("register-form");

      fireEvent.submit(form)

      expect(mockStartRegister).toHaveBeenCalledWith({ name: nameValue, email: emailValue, password: pwdValue})
  })

  test('should display an error if passwords are different for registration', () => {

      useAuthStore.mockReturnValue({
          startLogin: mockStartLogin,
          errorMessage: undefined,
          startRegister: mockStartRegister,
      })

      render(<LoginPage/>)

      const nameValue = "Ale"
      const emailValue = "prueba@example.com"
      const pwdValue = "12121212"

      const nameField = screen.getByLabelText("registerName");
      const emailField = screen.getByLabelText("registerEmail");
      const pwdField = screen.getByLabelText("registerPassword");
      const pwd2Field = screen.getByLabelText("registerPassword2");

      fireEvent.change(nameField, { target: { name: "registerName", value: nameValue }})
      fireEvent.change(emailField, { target: { name: "registerEmail", value: emailValue }})

      fireEvent.change(pwdField, { target: { name: "registerPassword", value: pwdValue }})
      fireEvent.change(pwd2Field, { target: { name: "registerPassword2", value: "different-pwd" }})

      // screen.debug()

      const form = screen.getByLabelText("register-form");

      fireEvent.submit(form)

      expect(Swal.fire).toHaveBeenCalledWith(
          "Registration Error",
          "Passwords not match",
          "error"
        );

      // make sure dispatcher is not called
      expect(mockStartRegister).not.toHaveBeenCalled()
  })

  test('should display an error message if authentication failed', () => {

      const errorMessage = "Error message test"

      useAuthStore.mockReturnValue({
          startLogin: mockStartLogin,
          errorMessage,
      })

      render(<LoginPage/>)

      const emailValue = "prueba@example.com"
      const pwdValue = "12121212"

      const emailField = screen.getByLabelText("loginEmail");
      const pwdField = screen.getByLabelText("loginPassword");

      fireEvent.change(emailField, { target: { name: "loginEmail", value: emailValue }})
      fireEvent.change(pwdField, { target: { name: "loginPassword", value: pwdValue }})

      const form = screen.getByLabelText("login-form");

      fireEvent.submit(form)

      // screen.debug()

      expect(Swal.fire).toHaveBeenCalledWith(
          "Authentication Error",
          errorMessage,
          "error"
        );
  })
});
