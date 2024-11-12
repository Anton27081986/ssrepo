#STAGE 1
FROM node:20.11-alpine AS build
WORKDIR /usr/src/app
COPY . .
RUN npm install
ARG PROJECT_ENV=development
RUN npm run build:$PROJECT_ENV


#STAGE 2
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/erpss /usr/share/nginx/html
