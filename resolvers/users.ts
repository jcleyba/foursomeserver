import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import sql from '../db'

export async function login(_: any, args: any) {
  try {
    const { email, password } = args.loginData

    if (!email || !password) throw Error('Invalid data')

    const [user] = await sql`select * from users where email = ${email};`

    if (!user) {
      throw Error('No user found')
    }
    if (!user.verified) {
      throw Error('Account not verified')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw Error('Invalid Login')
    }

    if (user) {
      const token = jwt.sign({ user }, process.env.PRIVATE_KEY || 'private', {
        expiresIn: '24h',
      })
      return { ...user, token }
    } else {
      throw Error('No user found')
    }
  } catch (e) {
    throw e
  }
}

export async function register(_: any, args: any) {
  try {
    const { firstName, lastName, password, email } = args.registerData

    const hashedPassword = await bcrypt.hash(password, 10)

    const [
      user,
    ] = await sql`insert into users (firstname, lastname, email, password, verified, created_on) values (${firstName}, ${lastName}, ${email}, ${hashedPassword}, false, ${new Date().toISOString()}) returning *`

    if (user) {
      const token = jwt.sign({ user }, process.env.PRIVATE_KEY || 'private', {
        expiresIn: '24h',
      })
      return { ...user, token }
    } else {
      throw Error('No user found')
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}
