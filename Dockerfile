# Step 1: Use a Node.js base image
FROM node:20.18.0-alpine AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --frozen-lockfile

# Step 5: Copy the entire application code to the container
COPY . .

# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Install only production dependencies
RUN npm prune --production

# Step 8: Use a smaller base image for the final app (to keep the image size smaller)
FROM node:20.18.0-alpine AS runner

# Step 9: Set the working directory again
WORKDIR /app

# Step 10: Copy the built app and node_modules from the builder
COPY --from=builder /app ./

# Step 11: Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Step 12: Expose the Next.js app port
EXPOSE 3000

# Step 13: Start the app
CMD ["npm", "start"]
