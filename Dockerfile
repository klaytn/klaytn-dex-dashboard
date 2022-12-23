FROM node:16 as build

ARG SUBGRAPH_ENDPOINT
ENV SUBGRAPH_ENDPOINT=$SUBGRAPH_ENDPOINT

ARG EXPLORER_ENDPOINT
ENV EXPLORER_ENDPOINT=$EXPLORER_ENDPOINT

ARG EXCHANGE_ENDPOINT
ENV EXCHANGE_ENDPOINT=$EXCHANGE_ENDPOINT

WORKDIR /app

COPY . .

RUN yarn install
RUN SUBGRAPH_ENDPOINT=$SUBGRAPH_ENDPOINT \
    EXPLORER_ENDPOINT=$EXPLORER_ENDPOINT \
    EXCHANGE_ENDPOINT=$EXCHANGE_ENDPOINT yarn build

FROM nginxinc/nginx-unprivileged:1.23-alpine
COPY --from=build /app/dist /usr/share/nginx/html