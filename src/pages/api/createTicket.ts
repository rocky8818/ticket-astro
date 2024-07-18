import type { APIContext } from "astro";
import {tickets, db, eq} from "astro:db";
import type { ticket } from "../../../lib/models";



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

    const ticketInfo = {
        empresa, contacto, correo, telefono, descripcion, fecha, hora, detalle, os, navegador, dispositivo, impacto, solucion, prioridad, adicional
    }

    const resumen = `Prioridad ${prioridad}. ${contacto} de ${empresa} tiene el problema ${descripcion}, presentado en ${fecha} a las ${hora} el problema se presentó en ${dispositivo} usando el navegador ${navegador} usando el sistema operativo de ${os}. El problema presenta el siguiente impacto: ${impacto}, con intento de solucion ${solucion}. El usuario dejó la siguiente información. Detalle del problema ${detalle}. Información adicional ${adicional}. Datos del cliente tel:${telefono} y correo ${correo}.`

    const randNumber = await generateUniqueTicketNumber();

    const newTicket: ticket = {
        ticketNumber: randNumber,
        resumen,
        ticketInfo,
    }

    await db.insert(tickets).values([newTicket]);

    /*

    const slackWebhookUrl = '';

    const slackMessage = {
        text: `Nuevo ticket creado:\n\n${resumen}`
    };

    await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
    });

    */
    return context.redirect("/thankyou")
}
