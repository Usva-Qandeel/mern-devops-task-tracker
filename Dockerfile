# Step 1: Use Node 22 (Vite requires Node 20+)
FROM node:22-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files
COPY client/package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy rest of project
COPY client ./

# Step 6: Expose Vite port
EXPOSE 5173

# Step 7: Run app
CMD ["npm", "run", "start", "--", "--host"]
