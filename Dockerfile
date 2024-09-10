# Dockerfile

# Fase de desarrollo (Build Stage)
FROM node:19-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase de producción (Production Stage)
FROM node:19-alpine as deploy
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/src/config ./src/config 
COPY --from=build /usr/src/app/src/migrations ./src/migrations
RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/index.js"]
