
FROM node:8-alpine 
COPY . /var/app
RUN cd /var/app && npm update &&  npm install --silent
WORKDIR /var/app
ENV NODE_ENV=production
CMD ["npm", "start"]