import { column, defineDb, defineTable } from 'astro:db';

const tickets = defineTable({

  columns:{
    _id: column.number({ primaryKey: true}),
    ticketNumber: column.text(),
    resumen: column.text(),
    ticketInfo: column.json(),
  }
})

const User = defineTable({
  columns:{
    id: column.text({primaryKey: true, optional: false, unique: true}),
    username: column.text(),
    password: column.text()
  }
})

const Session = defineTable({
  columns:{
    id: column.text({optional: false, unique: true}),
    userId: column.text({ optional:false, references: () => User.columns.id
    }),
    expiresAt: column.number({ optional: false}),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    tickets,
    User,
    Session
  }
});
