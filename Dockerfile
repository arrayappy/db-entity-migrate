FROM node:18
WORKDIR /app
COPY package.json .
COPY package-lock.json . 
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]

# Start the docker service and run below commands

# docker build -t migration-app .
# docker run migration-app
