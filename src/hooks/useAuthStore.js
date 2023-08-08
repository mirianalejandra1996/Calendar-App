import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({email, password}) => {
        dispatch(onChecking())
        try {
            const { data } = await calendarApi.post('/auth', { email, password})
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime()) // In case we would like to do something
            dispatch(onLogin({name: data.name, uid: data.uid}))
        } catch (error) {
            localStorage.removeItem('token')
            localStorage.removeItem('token-init-date')
            dispatch(onLogout('Invalid credentials'))
            setTimeout(() => dispatch(clearErrorMessage()) , 10)
        }
  }

  const startRegister = async ({ name, email, password }) => {
    
    try {
      const { data } = await calendarApi.post('/auth/new', { name, email, password})


      localStorage.setItem('token', data.token)
      localStorage.setItem('token-init-date', new Date().getTime()) // In case we would like to do something
      // with the time
      dispatch(onLogin({name: data.name, uid: data.uid}))

    } catch (error) {
      console.log('error', error)

      // const {error: errorFieds} = error.response.data 
      const { errors, msg } =  error.response.data 

      if (errors) dispatch(onLogout('Please fill all fields correctly'))
      // else if (msg === 'Email not available')  dispatch(onLogout(msg))
      else if (msg)  dispatch(onLogout(msg === 'Email not available' ? 'Email already in use' : msg))

      else dispatch(onLogout(error.message))

      setTimeout(() => dispatch(clearErrorMessage()) , 10)
    }
  }

  const checkAuthToken =  async() => {
    
    const token = localStorage.getItem('token')
    if  (!token) return dispatch(onLogout())

    try {

        const { data } = await calendarApi.get('/auth/renew')

        // * Note: I can create a functionality to set cookies for code optimization
        localStorage.setItem('token', data.token)
        localStorage.setItem('token-init-date', new Date().getTime()) // In case we would like to do something
        // with the time

        dispatch(onLogin({name: data.name, uid: data.uid}))


      } catch (error) {
            console.log('error', error)
            localStorage.clear()
            dispatch(onLogout())
    }
  }

  const startLogout = () => {
    dispatch(onLogout())
    dispatch(onLogoutCalendar())
    localStorage.clear()
  }

  return {
    // * Properties
    status,
    user,
    errorMessage,

    // * Methods
    checkAuthToken,
    startLogin,
    startLogout,
    startRegister,
  };
};
