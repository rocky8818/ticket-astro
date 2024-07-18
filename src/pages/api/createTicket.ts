import type { APIContext } from "astro";
import {tickets, db, eq, like} from "astro:db";
import type { ticket } from "../../../lib/models";

const slack_url = import.meta.env.SLACK_WEBHOOK
const slack_token = import.meta.env.SLACK_TOKEN

let aggregate = ''



async function generateUniqueTicketNumber(): Promise<number> {
    let randNumber: number = 0;
    let isUnique = false;
    let existingTicket;

    while (!isUnique) {
        randNumber = Math.floor(1000 + Math.random() * 9000);
        existingTicket = await db.select().from(tickets).where(eq(tickets.ticketNumber, randNumber));
        isUnique = existingTicket.length == 0;
    }

    return randNumber;
}

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData();
    let prevTicket = formData.get('prevticket')
    const empresa = formData.get('empresa')
    const contacto = formData.get('contacto')
    const correo = formData.get('correo')
    const telefono = formData.get('telefono')
    const descripcion = formData.get('descripcion')
    const fecha = formData.get('fecha')
    const hora = formData.get('hora')
    const detalle = formData.get('detalle')
    const os = formData.get('os')
    const navegador = formData.get('navegador')
    const dispositivo = formData.get('dispositivo')
    const impacto = formData.get('impacto')
    const solucion = formData.get('solucion')
    const prioridad = formData.get('prioridad')
    const adicional = formData.get('adicional')
    const imagen = formData.get("image");
    console.log(imagen)



    const allReports = await db.select().from(tickets)
    const prevReport = allReports.filter((report) => report.ticketNumber == prevTicket)
    if(prevReport.length > 0 ){
        aggregate = allReports.length.toString()
    }else{
        prevTicket = '0'
    }

    const ticketInfo = {
        empresa, contacto, correo, telefono, descripcion, fecha, hora, detalle, os, navegador, dispositivo, impacto, solucion, prioridad, adicional
    }

    const resumen = `Prioridad ${prioridad}. ${contacto} de ${empresa} tiene el problema ${descripcion}, presentado en ${fecha} a las ${hora} el problema se presentó en ${dispositivo} usando el navegador ${navegador} usando el sistema operativo de ${os}. El problema presenta el siguiente impacto: ${impacto}, con intento de solucion ${solucion}. El usuario dejó la siguiente información. Detalle del problema ${detalle}. Información adicional ${adicional}. Datos del cliente tel:${telefono} y correo ${correo}.`

    const randNumber = await generateUniqueTicketNumber();

    const newTicket: ticket = {
        ticketNumber: prevTicket == '0' ? randNumber.toString() : prevTicket!.split('-')[0] + '-' + aggregate,
        resumen,
        ticketInfo,
    }

    await db.insert(tickets).values([newTicket]);

    // Obtener URL de carga de Slack
    const imageFilename = (imagen as File).name;
    const imageSize = (imagen as File).size;
    console.log(imageSize, imageFilename)

    const uploadUrlResponse = await fetch('https://slack.com/api/files.getUploadURLExternal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${slack_token}`,
        },
        body: JSON.stringify({
            filename: imageFilename,
            length: imageSize,
        }),
    });

    const uploadUrlResult = await uploadUrlResponse.json();
    if (!uploadUrlResult.ok) {
        throw new Error('Error getting upload URL from Slack: ' + uploadUrlResult.error);
    }

    const uploadUrl = uploadUrlResult.upload_url;

    // Subir la imagen a Slack
    const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Type': imagen.type,
        },
        body: imagen,
    });

    if (!uploadResponse.ok) {
        throw new Error('Error uploading image to Slack: ' + uploadResponse.statusText);
    }

    const uploadResponseBody = await uploadResponse.json();

    // Completar la carga de la imagen en Slack
    const completeUploadResponse = await fetch('https://slack.com/api/files.completeUploadExternal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${slackToken}`,
        },
        body: JSON.stringify({
            files: [{
                id: uploadResponseBody.file.id,
                title: 'Imagen del Ticket',
                channels: '#ticket-reports', // Reemplaza con el ID de tu canal
            }],
        }),
    });

    const completeUploadResult = await completeUploadResponse.json();
    if (!completeUploadResult.ok) {
        throw new Error('Error completing upload to Slack: ' + completeUploadResult.error);
    }

    // Enviar mensaje a Slack con la imagen
    const slackMessage = {
        text: `Nuevo ticket creado:\n\n${resumen}`,
        attachments: [
            {
                text: "Imagen adjunta",
                image_url: completeUploadResult.files[0].url_private, // URL de la imagen subida
                title: "Imagen del Ticket",
            },
        ],
    };

    await fetch(slack_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
    });

    return context.redirect("/thankyou");
}