'use strict'

class AuthenticatedController {

    async logout({ auth, response }){
        
        auth.logout()

        return response.redirect('/login')
    }
}

module.exports = AuthenticatedController
