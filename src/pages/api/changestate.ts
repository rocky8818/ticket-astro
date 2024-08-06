import type { APIContext } from 'astro';
import { db, tickets, eq } from 'astro:db';
import type { ticket } from 'lib/models';

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  let ticket = formData.get('ticketNumber')
  let estado = formData.get('estado')
  console.log( estado)
  let nextState = ''

  if(estado == 'Abierto'){
    nextState = 'Pausa'
  }else if(estado == 'Pausa'){
    nextState = 'Resuelto'
  }else if(estado == 'Resuelto'){
    nextState = 'Cerrado'
  }else{
    nextState = 'Abierto'
  }

  let ticketInfo = await db.select().from(tickets).where(eq(tickets.ticketNumber, ticket))
  console.log(ticketInfo[0])
  try {
    // Obtener los datos del cuerpo del POST
    console.log(ticket);

    // Actualizar el estado del ticket
    await db.update(tickets)
      .set({
        ticketState:  nextState
      })
      .where(eq(tickets.ticketNumber, ticket));

    // Devolver una respuesta exitosa
    return context.redirect(`/admin/ticket/${ticket}`);
  } catch (error) {
    console.error('Error al procesar el POST:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
};
