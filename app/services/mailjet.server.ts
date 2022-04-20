import mailjet from 'node-mailjet'
import {env} from "~/services/utils";

export const INIVITATION_CALLBACK_URL = env("INIVITATION_CALLBACK_URL", "http://localhost:3000/invitations")
const MAILJET_API_KEY = env('MAILJET_API_KEY')
const MAILJET_API_SECRET = env('MAILJET_API_SECRET')
const client = mailjet.connect(MAILJET_API_KEY, MAILJET_API_SECRET)

export async function sendHTML({to, subject, body}: {to: string, subject: string, body: string}) {
  const request = await client
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": "valentin@cocaud.com",
            "Name": "La brasserie de l'Éclaircie"
          },
          "To": [{"Email": to}],
          "Subject": subject,
          "HTMLPart": body,
        }
      ]
    })
  console.log('email sent:', request.body)
}
