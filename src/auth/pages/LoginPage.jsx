import React from 'react';
import './LoginPage.css';
import { useAuthStore, useForm } from '../../hooks';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'


const loginFormFields = {
    loginEmail:     '',
    loginPassword:  '',
}

const registerFormFields = {
    registerName:       '',
    registerEmail:      '',
    registerPassword:   '',
    registerPassword2:  '',
}

export const LoginPage = () => {

    const { startLogin , startRegister ,  errorMessage} = useAuthStore()

    const {
        loginEmail,
        loginPassword,
        formState: loginFormState,
        onInputChange : onLoginInputChange,
        onResetForm: onLoginResetForm,
        isFormValid : isLoginFormValid
    } = useForm(loginFormFields)
    
    const handleLoginSubmit = (e) => {
        e.preventDefault()
        startLogin({email: loginEmail, password: loginPassword})
    }
    
    const {
        registerName,
        registerEmail,
        registerPassword,
        registerPassword2,
        formState: registerFormState,
        onInputChange : onRegisterInputChange,
        onResetForm: onRegisterResetForm,
        isFormValid : isregisterFormValid
    } = useForm(registerFormFields)
    
    const handleRegisterSubmit = (e) => {
        // TODO: Handle form validations
        e.preventDefault()

        if (registerPassword !== registerPassword2) return Swal.fire('Registration Error', 'Passwords not match', 'error')

        startRegister({name: registerName, email: registerEmail, password: registerPassword})
    }

    useEffect(() => {
        if (errorMessage !== undefined ) Swal.fire('Authentication Error', errorMessage, 'error')

        // ! Not to use return here inside a useEffect because this will be only dispatch only on cleaning
        // if (errorMessage !== null ) return Swal.fire('Error', errorMessage, 'error')

    }, [errorMessage])
    

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Log In</h3>
                    <form aria-label='login-form' onSubmit={handleLoginSubmit}>
                        <div className="form-group mb-2">
                            <input 
                                type="text"
                                aria-label='loginEmail'
                                value={loginEmail}
                                className="form-control"
                                placeholder="Email"
                                onChange={onLoginInputChange}
                                name="loginEmail"
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                aria-label='loginPassword'
                                value={loginPassword}
                                className="form-control"
                                placeholder="Password"
                                onChange={onLoginInputChange}
                                name="loginPassword"
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input 
                                type="submit"
                                className="btnSubmit"
                                value="Login" 
                            />
                        </div>
                    </form>
                </div>

                <div className="col-md-6 login-form-2">
                    <h3>Sign Up</h3>
                    <form aria-label='register-form' onSubmit={handleRegisterSubmit}>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                aria-label='registerName'
                                value={registerName}
                                className="form-control"
                                placeholder="Name"
                                name="registerName"
                                onChange={onRegisterInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="email"
                                aria-label='registerEmail'
                                value={registerEmail}
                                className="form-control"
                                placeholder="Email"
                                name="registerEmail"
                                onChange={onRegisterInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                aria-label='registerPassword'
                                value={registerPassword}
                                className="form-control"
                                placeholder="Contraseña" 
                                name="registerPassword"
                                onChange={onRegisterInputChange}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                aria-label='registerPassword2'
                                value={registerPassword2}
                                className="form-control"
                                placeholder="Repeat Password" 
                                name="registerPassword2"
                                onChange={onRegisterInputChange}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input 
                                type="submit" 
                                className="btnSubmit" 
                                value="Crear cuenta" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}