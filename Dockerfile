# Force rebuild for seed - v2
FROM node:18-bullseye-slim

WORKDIR /app

COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma

WORKDIR /app/backend
RUN npm install --legacy-peer-deps
RUN npx prisma generate

WORKDIR /app
COPY backend ./backend

WORKDIR /app/backend
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx ts-node prisma/seed.ts && npm start"]
