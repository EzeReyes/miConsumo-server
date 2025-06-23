import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './db/connection.js';
import resolvers from './src/resolvers.js';
import typeDefs from './src/schema.js';

const PORT = process.env.PORT || 5050;
const app = express();

// Configuración CORS para aceptar cookies desde frontend en http://localhost:3000
app.use(cors({
  origin: 'https://mi-consumo.vercel.app',
  // origin: 'http://localhost:5173', 
  credentials: true                 // Muy importante para enviar cookies
}));

app.use(express.json());
app.use(cookieParser());

// Conexión a la base de datos
db();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();
