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

export async function sendTeeTimes(
  emails: string[],
  eventId: string,
  eventName: string
) {
  const eventFullName = eventName.toLowerCase().startsWith('the')
    ? eventName
    : `el ${eventName}`

  const mailOptions = {
    from: 'Golf Time <inscripciones.golftime@gmail.com>',
    to: 'inscripciones.golftime@gmail.com',
    bcc: emails.toString(),
    subject: `Field disponible para ${eventFullName}!`,
    html: `<p>Amigo golfista,</p><p>Ya se encuentra disponible el field de ${eventFullName} y podés elegir tus jugadores para este torneo haciendo click <a href="${process.env.DOMAIN}/events/${eventId}">aquí</a>.
    </p><p>Buena suerte!</p><p>El Equipo de Golf Time</p>`,
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
