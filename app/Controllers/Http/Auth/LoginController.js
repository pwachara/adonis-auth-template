'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')

class LoginController {

    showLoginForm({ view }){

        return view.render('auth.login')
    }

    async login({request, auth, session, response}){

        //GET FORM DATA
        const { email, password } = request.all()

        //VALIDATE FORM DATA

        const validation = await validateAll(request.all(), {
            email: 'required:email',
            password: 'required'
        })

        if(validation.fails()){

            session.withErrors(validation.messages())
            .flashExcept(['password'])

            return response.redirect('back')
        }



        
        //RETRIEVE USER
        const user = await User.query()
            .where('email', email)
            .where('is_active', true)
            .first()

        //VERIFY PASSWORD

        if(user){

            const passwordVerified = await Hash.verify(password, user.password)

           if(passwordVerified){

            await auth.login(user)

            return response.route('home')

           }
            
        }

        //SEND ERROR MESSAGE
            
            session.flash({
                notification: {
                    type: 'danger',
                    message: 'Invalid Login.'
                }
            })

            return response.redirect('back')

    }
}

module.exports = LoginController
