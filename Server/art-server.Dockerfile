FROM node:alpine as builder
COPY . /
RUN npm ci --legacy-peer-deps
RUN npm run Build

FROM node:alpine
COPY --from=builder /Build /
COPY --from=builder /node_modules /node_modules
COPY --from=builder /Configuration.json.docker-template /Configuration.json
CMD node main.js