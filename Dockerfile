# Dockerfile

# Fase de desarrollo (Build Stage)
FROM node:19-alpine as build
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

# Etapa de desarrollo
FROM node:19-alpine as dev
WORKDIR /usr/src/app
COPY . .
RUN npm ci

# Fase de producción (Production Stage)
FROM node:19-alpine as deploy
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/src/config ./src/config 
COPY --from=build /usr/src/app/src/migrations ./src/migrations
RUN npm install --production

EXPOSE 3000

# Comando predeterminado
CMD ["npm", "run", "start"]

# Sobrescribir el comando para la etapa de desarrollo
FROM dev AS development
CMD ["npm", "run", "start:debug"]