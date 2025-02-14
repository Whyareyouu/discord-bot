FROM node:23.8
WORKDIR ./app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start:deploy"]
CMD ["npm", "run", "start"]
