import app from './server.js'
import connection from './database.js';

 // Conexion a la BDD
connection()
app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})


