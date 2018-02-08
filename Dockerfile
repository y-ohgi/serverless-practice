FROM node:9.5-alpine

RUN npm install -g yarn && \
    npm install -g serverless
