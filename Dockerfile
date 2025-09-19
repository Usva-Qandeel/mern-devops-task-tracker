#for building stage

FROM node:20 AS build
WORKDIR /app
COPY client/package*.json ./ 
RUN npm install
COPY client/ .
RUN npm run build

#for production stage
 
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

