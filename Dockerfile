# Fase de construcción
FROM node:19-alpine as build
WORKDIR /usr/prex-back
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase de despliegue
FROM node:19-alpine as deploy
WORKDIR /usr/prex-back
COPY --from=build /usr/prex-back .

EXPOSE 3000

ENTRYPOINT ["node", "dist/index.js"]
