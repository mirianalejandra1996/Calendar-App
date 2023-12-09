import { configureStore } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

import {
  calendarWithActiveEventsState,
  // calendarWithActiveEventsState,
  calendarWithEventsState,
  events,
  initialState,
} from "../fixtures/calendarFixtures";
import { useCalendarStore } from "../../src/hooks/useCalendarStore";
import { authSlice, calendarSlice } from "../../src/store";
import { authenticatedState, demoUser } from "../fixtures/authFixtures";

import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react";
import { calendarApi } from "../../src/api";
// import { calendarApi } from "../../src/api";

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

const getMockedStore = ({ initialAuthState, initialCalendarState }) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      calendar: calendarSlice.reducer,
    },
    preloadedState: {
      auth: {
        ...initialAuthState,
      },
      calendar: {
        ...initialCalendarState,
      },
    },
    // cuando se trata con fechas no serializables, puedes desactivar esta comprobación para evitar errores.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

describe("Test on useCalendarStore hook", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeEach(() => localStorage.clear());

  test("should return default values", () => {
    const mockedStore = getMockedStore({
      initialAuthState: authenticatedState,
      initialCalendarState: initialState,
    });

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    // console.log(result)

    expect(result.current).toEqual({
      activeEvent: null,
      events: [],
      hasEventSelected: false,
      setActiveEvent: expect.any(Function),
      startDeletingEvent: expect.any(Function),
      startLoadingEvents: expect.any(Function),
      startSavingEvent: expect.any(Function),
    });
  });

  test("setActiveEvent should active an event", () => {
    const mockedStore = getMockedStore({
      initialAuthState: authenticatedState,
      initialCalendarState: calendarWithEventsState,
    });

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    act(() => {
      result.current.setActiveEvent(events[0]);
    });

    expect(result.current.activeEvent).toEqual(events[0]);
  });

  test("startSavingEvent must fail creating an event", async () => {

    const newEvent = {
      start: new Date("2022-09-08 13:00:00"),
    };

    const mockedStore = getMockedStore({
      initialAuthState: authenticatedState,
      initialCalendarState: initialState,
    });

    localStorage.setItem("token", "fake-token");

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error while saving event",
      expect.any(String),
      "error"
    );

  });

  test("startSavingEvent should create an event if is not on list of events", async () => {
    const mockedStore = getMockedStore({
      initialAuthState: authenticatedState,
      initialCalendarState: initialState,
    });

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    const newEvent = {
      title: "Salir a correr",
      notes: "Llevar mochila y agua",
      start: new Date("2022-11-09 13:00:00"),
      end: new Date("2022-11-09 15:00:00"),
      bgColor: "#fafafa",
    };

    const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
      data: {
        event: {
          id: "fakeId",
          user: demoUser.uid,
          ...newEvent,
        },
      },
    });

    await act(async () => {
      await result.current.startSavingEvent(newEvent);
    });

    // console.log(result.current.events)

    const newEventCreated = {
      ...newEvent,
      id: "fakeId",
      user: { ...demoUser, _id: demoUser.uid },
    };

    expect(result.current.events).toContainEqual(newEventCreated);

    // expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Creation",
      "It has been created successfully",
      "success"
    );

    spy.mockRestore();
  });

  test("startSavingEvent should update an event if is on list of events", async () => {
    const mockedStore = getMockedStore({
      initialAuthState: authenticatedState,
      initialCalendarState: calendarWithEventsState,
    });

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    const event = {
      id: 1,
      title: "Es una nota actualizada",
      notes: "Nota para otra ocasion",
      start: new Date("2022-11-09 13:00:00"),
      end: new Date("2022-11-09 15:00:00"),
      bgColor: "#fafafa",
      // user: { uid: "abc123", name: "alejandra" },
      user: demoUser,

    };

    const spy = jest.spyOn(calendarApi, "put").mockReturnValue({
      data: {
        event: {
          ...event,
        },
      },
    });

    await act(async () => {
      await result.current.startSavingEvent(event);
    });

    console.log(result.current.events)
    expect(result.current.events).toContainEqual(event);

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Update",
      "It has been updated successfully",
      "success"
    );

    spy.mockRestore();
  });

  test("startDeletingEvent should remove an event if is on list of events", async () => {

    const mockedStore = getMockedStore({
      initialAuthState: authenticatedState,
      initialCalendarState: calendarWithActiveEventsState,
    });

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    // console.log(mockedStore.getState().calendar)

    const spy = jest.spyOn(calendarApi, "delete").mockReturnValue({
      data: {
        event: {
          // ...newEvent,
        },
      },
    });

    await act(async () => {
      await result.current.startDeletingEvent();
    });

    // console.log(result.current.activeEvent)

    expect(result.current.activeEvent).toBe(null)

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Elimination",
      "It has been removed successfully",
      "success"
    );

    spy.mockRestore();

  });

  test("startLoadingEvents should load all events", async () => {

    const getEvents = [
      {
        id: "1",
        start: expect.any(Date),
        end: expect.any(Date),
        //     start: "2022-10-21 13:00:00",
        //     end: "2022-10-21 15:00:00",
        // ! =======================================
        // start: "2023-10-21T13:00:00.000Z",
        // end: "2023-10-21T15:00:00.000Z",
        title: "testing 1",
        notes: "Alguna nota",
      },
      {
        id: "2",
        start: expect.any(Date),
        end: expect.any(Date),
        // start: "2022-11-09 13:00:00",
        // end: "2022-11-09 15:00:00",
        title: "testing 2",
        notes: "Alguna nota de Melissa",
      },
    ];

    const mockedStore = getMockedStore({
      initialAuthState: authenticatedState,
      initialCalendarState: initialState,
    });

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    const spy = jest.spyOn(calendarApi, "get").mockReturnValue({
      data: {
        events: getEvents,
      },
    });

    await act(async () => {
      await result.current.startLoadingEvents();
    });

    // console.log(result.current)

    expect(result.current.events).toEqual(getEvents);

    spy.mockRestore();
  });

  test("startLoadingEvents must fail", async () => {

    const mockedStore = getMockedStore({
      initialAuthState: authenticatedState,
      initialCalendarState: initialState,
    });

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockedStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.startLoadingEvents();
    });

    console.log(result.current)

    expect(result.current.events.length).toBe(0)

  });
});
