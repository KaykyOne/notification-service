FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies (using package-lock for reproducible builds)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate || true

# Expose port used by the app
EXPOSE 3012

# Use production env at runtime
ENV NODE_ENV=production

# Default start command (uses `start` script which runs tsx)
CMD ["npm", "start"]
