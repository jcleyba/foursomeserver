import nodemailer from 'nodemailer'

function transporter() {
  const transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  })

  return transporter
}
export async function sendEmailVerification(email: string, token: string) {
  const mailOptions = {
    from: 'Golf Time <inscripciones.golftime@gmail.com>',
    to: email,
    subject: '¡Bienvenido!',
    html: `<p>Gracias por registrarse en Golf Time. Para continuar, 
      por favor confirme su dirección de correo electrónico haciendo click 
      <a href="${process.env.DOMAIN}/verify?token=${token}">aquí</a></p><p>El equipo de Golf Time</p>`,
  }
  return new Promise((resolve, reject) => {
    transporter().sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        // Enviamos el email
        console.log('Email sent')
        resolve('Email sent')
      }
    })
  })
}

export async function sendPassRecovery(email: string, token: string) {
  const mailOptions = {
    from: 'Golf Time <inscripciones.golftime@gmail.com>',
    to: email,
    subject: 'Recuperación de contraseña',
    html: `<p>Para generar una nueva contraseña por favor haga click <a href="${process.env.DOMAIN}/reset-password?token=${token}">aquí</a></p><p>El equipo de Golf Time</p>`,
  }
  return new Promise((resolve, reject) => {
    // Enviamos el email
    transporter().sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        console.log('Email sent')
        resolve('Email sent')
      }
    })
  })
}
