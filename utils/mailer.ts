import nodemailer from 'nodemailer'

function transporter() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'inscripciones.golftime@gmail.com',
      pass: 'ulmlvllthvhrcnpv',
    },
  })

  return transporter
}
export function sendEmailVerification(email: string, token: string) {
  const mailOptions = {
    from: 'Golf Time <inscripciones.golftime@gmail.com>',
    to: email,
    subject: '¡Bienvenido!',
    html: `<p>Gracias por registrarse en Golf Time. Para continuar, 
      por favor confirme su dirección de correo electrónico haciendo click 
      <a href="http://localhost:3000/verify?token=${token}">aquí</a></p><p>El equipo de Golf Time</p>`,
  }
  // Enviamos el email
  transporter().sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent')
    }
  })
}

export function sendPassRecovery(email: string, token: string) {
  const mailOptions = {
    from: 'Golf Time <inscripciones.golftime@gmail.com>',
    to: email,
    subject: 'Recuperación de contraseña',
    html: `<p>Para generar una nueva contraseña por favor haga click <a href="${process.env.domain}/verify?token=${token}">aquí</a></p><p>El equipo de Golf Time</p>`,
  }
  // Enviamos el email
  transporter().sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent')
    }
  })
}
