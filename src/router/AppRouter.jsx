import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth"
import { CalendarPage } from "../calendar"
import { useAuthStore } from "../hooks"
import { useEffect } from "react"

import { LoadingPage } from "../shared"





export const AppRouter = () => {

  const { status, checkAuthToken} = useAuthStore()

  console.log('env', process.env.NODE_ENV)

    useEffect(() => {
      checkAuthToken()
    }, [checkAuthToken])

    if (status === 'checking') {
        return <LoadingPage/>
    }
    

  return (
    <Routes>

        {
            (status === 'not-authenticated')
            ? (
              <>
                <Route path="auth/*" element={<LoginPage/>}/>
                <Route path="/*" element={<Navigate to={'/auth/login'}/>}/>

              </>
            )
            : (
              <>
                <Route path="/" element={<CalendarPage/>}/>
                <Route path="/*" element={<Navigate to="/" />}/>
              </>
            )
        }

    </Routes>
  )
}