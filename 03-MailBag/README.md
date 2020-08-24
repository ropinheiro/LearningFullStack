# MailBag

## Local Mail Server Gonfiguratio
(using Greenmail: https://greenmail-mail-test.github.io/greenmail/#deploy_docker_standalone)

**Get Docker image with Greenmail**
> docker pull greenmail/standalone:1.6.0

**Run Docker image**
> docker run -t -i -p 3025:3025 -p 3110:3110 -p 3143:3143 -p 3465:3465 -p 3993:3993 -p 3995:3995 greenmail/standalone:1.6.0
> Note that 3025 is for SMTP and 3143 is for IMAP (see URL above for more information)
