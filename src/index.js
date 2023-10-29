import app from './server.js'
import connection  from './database.js'

// Conexion a la DB
connection();

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})
