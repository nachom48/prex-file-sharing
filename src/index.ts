import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import errorMiddleware from './middleware/error.middleware';
import attachmentRoutes from './modules/attachment/attachment.routes';
import { AppDataSource } from './config/database';
import { setupSwagger } from './config/swagger'; // Importa la configuración de Swagger desde la carpeta config

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setupSwagger(app); 

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');

    app.use('/api/auth', authRoutes);
    app.use('/api/attachments', attachmentRoutes);

    app.use(errorMiddleware);

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

export default app;
