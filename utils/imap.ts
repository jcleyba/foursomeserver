//@ts-ignore
import ImapClient from 'emailjs-imap-client'
import isThisWeek from 'date-fns/isThisWeek'

require('dotenv').config()

var client = new ImapClient('imap.gmail.com', 993, {
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  useSecureTransport: true,
})

export async function hasMailBeenSent() {
  try {
    await client.connect()

    const inbox = await client.selectMailbox('[Gmail]/Importantes')

    const [lastMessage] = await client.listMessages(
      '[Gmail]/Importantes',
      inbox.exists,
      ['envelope']
    )

    const date = lastMessage?.envelope?.date
    const hasBeenSent = isThisWeek(new Date(date), { weekStartsOn: 1 })
    console.log('Last Message: ', lastMessage.envelope)

    client.close()

    return hasBeenSent
  } catch (e) {
    console.error('Something went wrong getting last email')
  }

  client.close()
  return true
}
