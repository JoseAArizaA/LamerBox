FROM node:20

WORKDIR /app

# Instalamos un servidor sencillo para desarrollo
RUN npm install -g create-vite

EXPOSE 5173

CMD ["sh", "-c", "npm install && npm run dev -- --host"]