import app from './server.js'
import connection  from './database.js'


app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})

// Conexion a la DB
connection();