FROM nginx:alpine
COPY .next/static /usr/share/nginx/html/_next/static
COPY .next/standalone /app
WORKDIR /app
EXPOSE 3000
CMD ["node", "server.js"]