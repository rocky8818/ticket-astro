

# Generador de tickets!!

<p align="center">
  <svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:yellow;stop-opacity:1" />
      <stop offset="50%" style="stop-color:orange;stop-opacity:1" />
      <stop offset="100%" style="stop-color:red;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="10" y="20" width="180" height="60" rx="10" ry="10" fill="url(#grad1)" stroke="black" stroke-width="2"/>
  <circle cx="20" cy="50" r="10" fill="black"/>
  <circle cx="180" cy="50" r="10" fill="black"/>
  <text x="100" y="55" font-family="Arial" font-size="20" text-anchor="middle" fill="black">TICKET</text>
</svg>

</p>

## Levantamiento de app
npm i
npm run dev

## Endpoints

 Este proyecto contiene 2 endpoints, uno para generar un reporte desde whatsapp y otro para generar un reporte desde la form contenida en /report o /report/ticketNumber

 ### endpoint de whatsapp
 Al hacer un post a /api/reportwhatsapp se genera una entrada a la base de datos de de astro a la colecci´n de tickets

 ### endpoint de form
 Este endpoint genera una entrada a la colección de tickets ademas de un mensaje a un canal de slack, sin embargo es necesario tener las variables de entorno SLACK_TOKEN, SLACK_WEBHOOK y SLACK_CHANNEL


## Variables de entorno

La variable de SLACK_TOKEN debe de ser un xoxp sin caducidad.
SLACK_CHANNEL es el id del canal al cual llegaran los mensajes

## Versiones
Para 24 de julio para compilar la app, es necesario usar la versión 0.8.8 de astro db