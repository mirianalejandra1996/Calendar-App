import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { calendarSlice } from "./calendar/calendarSlice";
import { uiSlice } from "./ui/uiSlice";
import { authSlice } from "./auth/authSlice";


export const store = configureStore({
    reducer: {
        auth:       authSlice.reducer,
        ui:         uiSlice.reducer,
        calendar:   calendarSlice.reducer,
    },
    // Con esto resolví el problema de fecha
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})