FROM node:16 as build

ARG SUBGRAPH_ENDPOINT
ARG EXPLORER_ENDPOINT
ARG EXCHANGE_ENDPOINT

WORKDIR /app

COPY package.json package.json
RUN yarn install

COPY . .
RUN SUBGRAPH_ENDPOINT=$SUBGRAPH_ENDPOINT \
    EXPLORER_ENDPOINT=$EXPLORER_ENDPOINT \
    EXCHANGE_ENDPOINT=$EXCHANGE_ENDPOINT yarn build

FROM nginxinc/nginx-unprivileged:1.20
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
