
// export const getEnvVariables = () => {
 
//     return {
//         ...process.env
//     }

// }

export const getEnvVariables = () => {

    // import.meta.env;

    return {
        ...process.env

        // ...import.meta.env
        // VITE_MODE: import.meta.env.VITE_MODE,
        // VITE_API_URL: import.meta.env.VITE_API_URL
    }
}
