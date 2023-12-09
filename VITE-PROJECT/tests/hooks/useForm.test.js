import { renderHook } from "@testing-library/react";
import { useForm } from "../../src/hooks";
import { act } from "react-dom/test-utils";

describe("Tests on useForm hook", () => {
  const initialValues = { username: "", email: "fake-email@example.com" };

  test("should return default values", () => {
    const { result } = renderHook(() => useForm(initialValues));

    // Así podría garantizar la estructura de los valores en caso que otra persona las modifique
    expect(result.current).toEqual({
      username: initialValues.username,
      email: initialValues.email,
      isFormValid: expect.any(Boolean),
      formState: initialValues,
      onInputChange: expect.any(Function),
      onResetForm: expect.any(Function),
    });
  });

  test("onInputChange should update form values", () => {
    const { result } = renderHook(() => useForm(initialValues));

    expect(result.current.username).toBe(initialValues.username);

    const newValueName = "Alejandra";

    act(() => {
      result.current.onInputChange({
        target: { name: "username", value: newValueName },
      });
    });

    expect(result.current.username).toBe(newValueName);
    expect(result.current.email).toBe(initialValues.email);
  });

  test("onResetForm should update form values as initialValues", () => {
    const { result } = renderHook(() => useForm(initialValues));

    // ! This don't work, is better to act separately
    // act(() => {
    //     result.current.onInputChange({ target: { name: 'username', value: newValueName } });
    //     result.current.onInputChange({ target: { name: 'email', value: 'test@mail.com' } });
    // });

    // Update form values
    const newValueName = "Alejandra";
    act(() => {
      result.current.onInputChange({
        target: { name: "username", value: newValueName },
      });
    });

    const newEmail = "test@mail.com";
    act(() => {
      result.current.onInputChange({
        target: { name: "email", value: newEmail },
      });
    });

    // Verify that form values are updated
    expect(result.current.username).toBe(newValueName);
    expect(result.current.email).toBe(newEmail);

    // Reset form
    act(() => {
      result.current.onResetForm();
    });

    // Verify that form values are reset to initial values
    expect(result.current.username).toBe(initialValues.username);
    expect(result.current.email).toBe(initialValues.email);
  });

  test("createValidators should display error messages by specific field", () => {
    const validations = {
      username: [
        (value) => value.length >= 3,
        "Username must be at least 3 characters",
      ],
    };

    const { result } = renderHook(() => useForm(initialValues, validations));

    // Initial form should be invalid
    expect(result.current.isFormValid).toBe(false);

    // specific field should have an error message
    expect(result.current.usernameValid).toBe(
      "Username must be at least 3 characters"
    );

    // Update input to pass validation
    const newValueName = "Alejandra";
    act(() => {
      result.current.onInputChange({
        target: { name: "username", value: newValueName },
      });
    });

    console.log(result.current);

    // now field has no error message
    expect(result.current.usernameValid).toBe(null);
    // Form should now be valid
    expect(result.current.isFormValid).toBe(true);

    // // Verify that form values are updated
    // expect(result.current.username).toBe(newValueName);
    // expect(result.current.email).toBe(newEmail);

    // // Reset form
    // act(() => {
    //   result.current.onResetForm();
    // });

    // // Verify that form values are reset to initial values
    // expect(result.current.username).toBe(initialValues.username);
    // expect(result.current.email).toBe(initialValues.email);
  });
});
