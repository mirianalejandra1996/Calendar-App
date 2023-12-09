
export const demoUser = {
    uid: 'abc123',
    name: 'alejandra',
}

export const initialState = {
    status: 'checking', // 'authenticated','not-authenticated',
    user: {},
    errorMessage: undefined,
}

export const authenticatedState = {
    status: 'authenticated',
    user: demoUser,
    errorMessage: undefined,
}


export const notAuthenticatedState = {
    status: 'not-authenticated',
    user: {},
    errorMessage: undefined,
}

// export const notAuthenticatedStateWithError = {
//     status: 'not-authenticated',
//     user: {},
//     errorMessage: 'Fake error message',
// }

