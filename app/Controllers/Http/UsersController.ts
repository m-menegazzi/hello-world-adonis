import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    return User.query().orderBy('id').paginate(page, limit)
  }

  public async create({ request }: HttpContextContract) {
    const newUserSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.confirmed()]),
    })

    /**
     * Validate request body against the schema
     */
    const data = await request.validate({ schema: newUserSchema })

    return await User.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    const updateUserSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({}, [rules.email()]),
    })

    const payload = await request.validate({ schema: updateUserSchema })

    const saved = await user.merge(payload)

    return saved
  }

  public async destroy({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return user
  }
}
