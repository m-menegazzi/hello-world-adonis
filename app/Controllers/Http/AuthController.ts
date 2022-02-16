import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      return await auth.use('api').attempt(email, password)
    } catch {
      return response.badRequest('Invalid Credentials')
    }
  }

  public async register({ auth, request }: HttpContextContract) {
    const newUserSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.confirmed()]),
    })

    const data = await request.validate({ schema: newUserSchema })

    const user = await User.create(data)

    return await auth.login(user)
  }
}
