// aqui vamos iniciar el js para el backend
import app from './app.js';
import { ND_PORT } from './config/config.js';

app.listen(ND_PORT)?console.log(`esta funcionando en el en el puerto ${ND_PORT}`):console.log(`algo esta fallando porque no esta funcionando el puerto ${ND_PORT}`);
