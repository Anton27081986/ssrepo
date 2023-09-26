#STAGE 1
FROM node:16.16-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .
ARG configuration=production
RUN npm run build -- --configuration production

#STAGE 2
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/erpss /usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
