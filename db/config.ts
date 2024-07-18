import { column, defineDb, defineTable } from 'astro:db';

const tickets = defineTable({
  columns:{
    _id: column.number({ primaryKey: true}),
    ticketNumber: column.text(),
    resumen: column.text(),
    ticketInfo: column.json(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    tickets
  }
});
