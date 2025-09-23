# Step 1: Use Node base image
FROM node:18

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy rest of the project files
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Install serve (to serve the production build)
RUN npm install -g serve

# Step 8: Expose port
EXPOSE 3000

# Step 9: Start the app (serve the build folder)
CMD ["serve", "-s", "build", "-l", "3000"]
