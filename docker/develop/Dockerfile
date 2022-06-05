# For local development
FROM node:16-alpine AS development

WORKDIR /app

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

# yarn install if package.json or yarn.lock is updated
COPY package.json yarn.lock ./
RUN yarn install

# copy all file except node_modules (see .dockerignore)
COPY . .

EXPOSE 3000
