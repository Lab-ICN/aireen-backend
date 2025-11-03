# ============================
# 1️⃣ Base Stage - Dependencies
# ============================
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy dependency files only for better caching
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# ============================
# 2️⃣ Builder Stage - Transpile TypeScript
# ============================
FROM deps AS builder
WORKDIR /app

# Copy all source files and config
COPY tsconfig.json ./
COPY src ./src

# Build to JavaScript (output dist/)
RUN bun build ./src/main.ts --outdir dist --target bun

# ============================
# 3️⃣ Runtime Stage - Slim & Secure
# ============================
FROM oven/bun:1-slim AS runtime
WORKDIR /app

# Copy only the built app + dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# ============================
# 4️⃣ Environment Configuration
# ============================
ENV NODE_ENV=production \
    APP_MODE=app \
    PORT=3000 \
    LOG_LEVEL=info \
    TZ=Asia/Jakarta

EXPOSE 3000

#HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
#  CMD curl -f http://localhost:$PORT/health || exit 1

# ============================
# 5️⃣ Startup Command
# ============================
# Jalankan app atau worker tergantung APP_MODE
CMD ["bash", "-c", "if [ \"$APP_MODE\" = 'worker' ]; then bun run dist/main.js; else bun run dist/main.js; fi"]
