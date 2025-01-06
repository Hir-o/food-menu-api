FROM node:20.18-alpine

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app
COPY package*.json ./
COPY . . 

USER root
RUN chmod -R a+rw uploads
USER app

EXPOSE 5000

CMD ["npx","pm2-runtime", "ecosystem.config.js"]