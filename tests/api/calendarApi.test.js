import calendarApi from "../../src/api/calendarApi"


describe('Test on calendarApi', () => {

    test('should have default config', () => {
        // console.log(calendarApi)
        // expect(calendarApi.defaults.baseURL).toBe('http://localhost:4000/api')
        expect(calendarApi.defaults.baseURL).toBe(process.env.REACT_APP_API_URL)

    })

    test('should have the x-token property on header\'s requests', async () => {
        
        // En realidad a mí no me interesa el valor del token en sí.

        // lo qué sí me interesa es que si yo le pongo el token

        const token = 'ABC-123-XYZ'
        localStorage.setItem('token', token)

        // const response = await calendarApi.post('/auth', {
        //     email: 'test@mail.com',
        //     password: '1234567',
        // });


        try {
             // no importa si el endpoint exista o no, pero al no existir hay que atrapar el error.
        const response = await calendarApi.get('/auth')

        console.log(response)

        } catch (error) {
            // console.log('ERROR ===', error.config.headers['x-token'])
            expect(error.config.headers['x-token']).toBe(token)
        }
        
    })
})