import type { APIRoute } from 'astro';
import { db, tickets, eq } from 'astro:db';
import type { ticket } from 'lib/models';

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

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener los datos del cuerpo del POST
    const data = await request.json();
    console.log(data)

    // Validar los datos (opcional pero recomendado)
    const { empresa, telefono, contacto, descripcion, impacto, so, dispositivo, prioridad, adicional } = data;
    if (!empresa || !telefono || !contacto || !descripcion || !impacto || !so || !dispositivo || !prioridad) {
      return new Response('Faltan campos requeridos', { status: 400 });
    }

    const randNumber = await generateUniqueTicketNumber();

    const newTicket: ticket = {
        ticketNumber:  randNumber.toString(),
        resumen: `${contacto}, de ${empresa} tiene el siguiente problema: ${descripcion}. A la empresa le afecta de la sieguiente manera ${impacto}, calificando el problema como prioridad ${prioridad}. El problema sucedio en un ${dispositivo}, con ${so}. El cliente dejó la siguiente información: ${adicional}.`,
        ticketInfo: data,
    }

    // Insertar los datos en la base de datos
    await db.insert(tickets).values([newTicket]);


    // Devolver una respuesta exitosa
    return new Response(JSON.stringify({ message: 'Reporte recibido', id: randNumber }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al procesar el POST:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
};
