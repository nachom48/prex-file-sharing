import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import errorMiddleware from './middleware/error.middleware';
import attachmentRoutes from './modules/attachment/attachment.routes';
import { DataSource } from 'typeorm';
import { setupSwagger } from './config/swagger';
import { AppDataSource } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
setupSwagger(app);

export const initializeServer = async (dataSource: DataSource) => {
  try {
    await dataSource.initialize();
    console.log('Conexión a la base de datos establecida con éxito.');

    app.use('/api/auth', authRoutes);
    app.use('/api/attachments', attachmentRoutes);
    app.use(errorMiddleware);

    return app;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
};

// Solo escuchamos en un puerto cuando no estamos en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  initializeServer(AppDataSource).then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  });
}

export default app;
