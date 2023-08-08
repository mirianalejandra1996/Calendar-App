import { store } from "./store"
import {HashRouter,  BrowserRouter } from "react-router-dom"
import { AppRouter } from "./router"
import { Provider } from "react-redux"


export const CalendarApp = () => {
  return (
    <>
        <Provider store={store}>
        <BrowserRouter>
          {/* <HashRouter> */}
              <AppRouter/>
          {/* </HashRouter> */}
        </BrowserRouter>
        </Provider>
    </>
  )
}