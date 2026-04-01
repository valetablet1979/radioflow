# RadioFlow - Dockerfile para producción
# Multi-stage build para optimizar tamaño de imagen

# Stage 1: Dependencias
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json bun.lock* package-lock.json* yarn.lock* ./

# Instalar dependencias - usar npm si no hay package-lock.json
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Argumentos de build
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Build de la aplicación
RUN npm run build

# Stage 3: Runner (Producción)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar archivos de Next.js standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar Prisma para migraciones
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Crear directorio para base de datos y uploads
RUN mkdir -p /app/db /app/uploads && chown -R nextjs:nodejs /app/db /app/uploads

# Copiar base de datos SQLite inicial si existe
COPY --from=builder /app/db ./db

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando de inicio
CMD ["node", "server.js"]
