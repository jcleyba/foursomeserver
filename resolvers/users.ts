import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import sql from '../db'
import { sendEmailVerification, sendPassRecovery } from '../utils/mailer'
import { getUser } from '../utils/user'

export async function login(_: any, args: any) {
  try {
    const { email, password } = args.loginData

    if (!email || !password) return Error('Invalid data')

    const [user] = await sql`select * from users where email = ${email};`

    if (!user) {
      return new Error('No user found')
    }
    if (!user.verified) {
      return new Error('Account not verified')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return Error('Invalid Login')
    }

    if (user) {
      const token = jwt.sign({ user }, process.env.PRIVATE_KEY || 'private', {
        expiresIn: '30d',
      })

      return {
        ...user,
        firstName: user.firstname,
        lastName: user.lastname,
        token,
      }
    } else {
      return Error('No user found')
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function register(_: any, args: any) {
  try {
    const { firstName, lastName, password, email } = args.registerData

    const hashedPassword = await bcrypt.hash(password, 10)
    const verifyToken = crypto.randomBytes(64).toString('hex')

    const [
      user,
    ] = await sql`insert into users (firstname, lastname, email, password, verified, created_on, token) values (${firstName}, ${lastName}, ${email}, ${hashedPassword}, false, ${new Date().toISOString()}, ${verifyToken}) returning *`

    if (user) {
      sendEmailVerification(email, verifyToken)
      const token = jwt.sign({ user }, process.env.PRIVATE_KEY || 'private', {
        expiresIn: '30d',
      })
      return { ...user, token }
    } else {
      return Error('No user found')
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function verify(_: any, args: any) {
  try {
    const token = args.token

    const data = await sql`update users set verified = true, token = NULL where token = ${token}`

    if (data.count === 1) {
      return true
    } else {
      return false
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function forgot(_: any, args: any) {
  try {
    const { email } = args
    const token = jwt.sign({ email }, process.env.PRIVATE_KEY || 'private', {
      expiresIn: '1h',
    })
    const data = await sql`update users set token = ${token} where email = ${email}`

    if (data.count === 1) {
      sendPassRecovery(email, token)
      return true
    } else {
      return new Error('User not found!')
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function resetPassword(_: any, args: any) {
  try {
    const { token, password } = args
    const user = (await getUser(token)) as { email: string }

    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const data = await sql`update users set password = ${hashedPassword}, token = null where email = ${user.email}`

      if (data.count === 1) {
        return true
      } else {
        return new Error('User not found!')
      }
    } else {
      return new Error('User not found!')
    }
  } catch (e) {
    console.error(e)
    return e
  }
}
