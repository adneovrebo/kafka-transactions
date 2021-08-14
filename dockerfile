FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "dist/index.js" ]