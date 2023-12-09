import { fireEvent, render, screen } from "@testing-library/react";
import { FabDelete } from "../../../src/calendar/components/FabDelete";
import { useCalendarStore } from "../../../src/hooks/useCalendarStore";
import { useAuthStore } from "../../../src/hooks/useAuthStore";
import { useUiStore } from "../../../src/hooks/useUiStore";
import { demoUser } from "../../fixtures/authFixtures";

jest.mock("../../../src/hooks/useCalendarStore");
jest.mock("../../../src/hooks/useAuthStore");
jest.mock("../../../src/hooks/useUiStore");

describe("Tests on <FabDelete />", () => {
  const event = {
    id: 1,
    title: "Cumpleaños de Alejandra",
    notes: "Hay que comprar el pastel",
    start: new Date("2022-10-21 13:00:00"),
    end: new Date("2022-10-21 15:00:00"),
    bgColor: "#fafafa",
    user: { ...demoUser, _id: demoUser.uid },
  };

  const mockStartDeletingEvent = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  // Este es para limpiar los intervalos
  beforeEach(() => jest.clearAllTimers());

  test("should display the component correctly", () => {
    // Estoy trabajando el componente de manera aislada,
    // sin la implementación del hook.

    useCalendarStore.mockReturnValue({
      //* Propiedades
      hasEventSelected: false,
      activeEvent: event,
    });

    useUiStore.mockReturnValue({
      isDateModalOpen: true,
    });

    useAuthStore.mockReturnValue({
      user: demoUser,
    });

    render(<FabDelete />);

    // screen.debug()

    const btn = screen.getByLabelText("btn-delete");

    // Así podría visualizar las clases de un elemento (toString())
    // console.log(btn.classList.toString());

    // Esta prueba no es mala, pero es intolerante al cambio, es MUY literal, y las
    // clases pueden cambiar el orden
    // expect(btn.classList.toString()).toBe('btn btn-danger fab-danger')

    // Así sería más flexible
    expect(btn.classList.toString()).toContain("btn");
    expect(btn.classList.toString()).toContain("btn-danger");
    expect(btn.classList.toString()).toContain("fab-danger");

    expect(btn.style.display).toBe("none");
  });

  test("should display the button is there is an event", () => {
    // Estoy trabajando el componente de manera aislada,
    // sin la implementación del hook.

    useCalendarStore.mockReturnValue({
      //* Propiedades
      hasEventSelected: true,
      activeEvent: event,
    });

    useUiStore.mockReturnValue({
      isDateModalOpen: false,
    });

    useAuthStore.mockReturnValue({
      user: demoUser,
    });

    render(<FabDelete />);

    // console.log(store.getState())

    const btn = screen.getByLabelText("btn-delete");

    //   fireEvent.click(btn)

    //   screen.debug()

    expect(btn.style.display).toBe("");
  });

  test("should call startDeletingEvent if exists an event", () => {
    useCalendarStore.mockReturnValue({
      //* Propiedades
      hasEventSelected: true,
      activeEvent: event,

      //* Métodos
      startDeletingEvent: mockStartDeletingEvent,
    });

    useUiStore.mockReturnValue({
      isDateModalOpen: false,
    });

    useAuthStore.mockReturnValue({
      user: demoUser,
    });

    render(<FabDelete />);

    //   screen.debug()

    const btn = screen.getByLabelText("btn-delete");

    fireEvent.click(btn);

    expect(mockStartDeletingEvent).toHaveBeenCalled();
    // expect(mockStartDeletingEvent).toHaveBeenCalledWith('asdsad');
  });
});
