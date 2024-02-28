FROM  --platform=linux/amd64 node:19-alpine
#FROM node:18-alpine3.16
ENV NODE_ENV=production
ENV PORT=2100
ENV COSEC_PORT=2200
RUN apk add g++ make py3-pip
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install pm2 -g
RUN pm2 install pm2-logrotate
RUN npm install
COPY . .
EXPOSE 2100
EXPOSE 2200
#CMD ["pm2-runtime", "server.js"]
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]