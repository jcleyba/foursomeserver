import jwt from 'jsonwebtoken'

export async function getUser(token: string) {
  try {
    if (token) {
      return jwt.verify(token, process.env.PRIVATE_KEY || 'someprivatekey')
    }
    return null
  } catch (err) {
    return null
  }
}
