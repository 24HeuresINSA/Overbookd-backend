FROM node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 2424

ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}

ENV DATABASE_HOST=db_project_a

ENV DATABASE_PORT=3306

CMD [ "node", "index.js" ]
