# MailBag

## Introduction

This is an webmail application based in the chapters 8 and 9 of the "Modern Full-Stack Development" book from Frank Zammetti. Main differences from the code in the book is the use of Greenmail and the interface in German (as a way for me to include some practice in German while I'm coding).

The Greenmail was used to prevent the need of a real mail configuration and also because I want to commit all code, configuration files included, to make this the most self-contained thing possible, with all third-party dependencies being automatically installed in some way.

## Expected software running in your system

- Docker (for Greenmail)
- Node (for the MailBag)

## Possible configurations

- Listening port for the MailBag Server is defined in the last line of /server/src/main.ts (actually 8081)
- Email credentials are defined in /server/src/serverInfo.json (actually with a fake account to be used with Greenmail)

## Configure a local mail server with Greenmail

(using Greenmail: https://greenmail-mail-test.github.io/greenmail/#deploy_docker_standalone)

**Get Docker image with Greenmail**

> docker pull greenmail/standalone:1.6.0

**Run Docker image**

> docker run -t -i -p 3025:3025 -p 3110:3110 -p 3143:3143 -p 3465:3465 -p 3993:3993 -p 3995:3995 greenmail/standalone:1.6.0
> Note that 3025 is for SMTP and 3143 is for IMAP (see URL above for more information)

## Run MailBag server (development mode)

> Open a Node command prompt
> Go to the /server/src folder
> `npm run dev`

## Directly test MailBag server

**With Postman (POST's)**

> Send a message:
> URL: localhost:8081/mailboxes
> Method: POST
> In the Body tab, choose raw and JSON (application/json)
> Text:
> `{ "from": "rmp@olipin.net", "to": "rmp@olipin.net", "subject": "Testmail", "text": "Dies ist eine Testmail" }`

> Add a contact:
> URL: localhost:8081/contacts
> Method: POST
> In the Body tab, choose raw and JSON (application/json)
> Text:
> `{ "name": "Rui Pinheiro", "email": "rmp@olipin.net" }`

**With CURL (GET's and DELETE's)**

> Get mailboxes list: `curl localhost:8081/mailboxes`
> Get messages in the INBOX mailbox: `curl localhost:8081/mailboxes/INBOX`
> Get message with ID 1: `curl localhost:8081/messages/INBOX/1`
> Delete message with ID 1: `curl -X DELETE localhost:8081/messages/INBOX/1`
> Get contacts list: curl localhost:8081/contacts
> Delete contact (ID is returned after an addition): `curl -X DELETE localhost:8081/contacts/NHFGNI8GeCRFdjoD`

## Run MailBag client (development mode)

> TODO
