# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server/ ./server/
COPY --from=frontend-builder /app/client/dist ./client/dist

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server/server.js"]
