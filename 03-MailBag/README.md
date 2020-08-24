# MailBag

## Local Mail Server Gonfiguration
(using Greenmail: https://greenmail-mail-test.github.io/greenmail/#deploy_docker_standalone)

**Get Docker image with Greenmail**
> docker pull greenmail/standalone:1.6.0

**Run Docker image**
> docker run -t -i -p 3025:3025 -p 3110:3110 -p 3143:3143 -p 3465:3465 -p 3993:3993 -p 3995:3995 greenmail/standalone:1.6.0
> Note that 3025 is for SMTP and 3143 is for IMAP (see URL above for more information)

**Run MailBag server (development mode)**
> npm run dev

**Test MailBag server (with Postman)**
> Send a message:
> URL: localhost:8081/mailboxes
> Method: POST
> In the Body tab, choose raw and JSON (application/json)
> Text:
`
{
  "from": "rmp@olipin.net",
  "to": "rmp@olipin.net",
  "subject": "Testmail",
  "text": "Dies ist eine Testmail"
}
`

**Test MailBag server (with command line)**
> Get mailboxes list: `curl localhost:8081/mailboxes`
> Get messages in the INBOX mailbox: `curl localhost:8081/mailboxes/INBOX`
> Get message with ID 1: `curl localhost:8081/messages/INBOX/1`
> Delete message with ID 1: `curl -X DELETE localhost:8081/messages/INBOX/1`
