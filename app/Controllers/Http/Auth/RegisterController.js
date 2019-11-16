'use strict'

const { validateAll } = use('Validator')    
const User = use('App/Models/User')
const randomString = require('random-string')
const mail = use('Mail')

class RegisterController {

    showRegisterForm( {view }){

        return view.render('auth.register')
    }

    async register({ request, session, response }){

        //VALIDATE FORM INPTS
        const validation = await validateAll( request.all(), {
            first_name: 'required',
            last_name: 'required',
            email: 'required|email|unique: users, email',
            password: 'required'
        })

        if(validation.fails()){

            session.withErrors(validation.messages()).flashExcept(['password'])

            return response.redirect('back')
        }

        //VALIDATION PASSED, CREATE USER

        const user = await User.create({
            first_name: request.input('first_name'),
            last_name: request.input('last_name'),
            email: request.input('email'),
            password: request.input('password'),
            is_active: false,
            confirmation_token: randomString({length: 40})
        })
        

        //SEND CONFIRMATION EMAIL

        await mail.send('auth.emails.confirm_email', user.toJSON(), message => {
            message.to(user.email)
            .from('admin@email.com')
            .subject('Please confirm your email address')
        })

        //DISPLAY SUCCESS MESSAGE

        session.flash({
            notification: {
                type: 'success',
                message: 'Registration successful! An email has been sent to your address.  Please confirm it.'
            }
        })

        return response.redirect('back')
    }

    async confirmEmail({ params, session, response}){
        //GET USER WITH THE CONFIRMATION TOKEN

        const user = await User.findBy('confirmation_token', params.token)

        //SET CONFIRMATION TO NULL AND IS_ACTIVE TO TRUE

        user.confirmation_token = null
        user.is_active = true

        //PERSIST USER TO DB

        await user.save()

        //DISPLAY SUCCESS MESSAGE

        session.flash({
            notification: {
                type: 'success',
                message: 'Your email address has been confirmed. Please login.'
            }
        })

        return response.redirect('/login')
    }
}

module.exports = RegisterController
