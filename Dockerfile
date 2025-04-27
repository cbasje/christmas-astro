FROM denoland/deno:latest
WORKDIR /app

COPY . .
RUN deno install
RUN deno task astro build
RUN deno cache dist/server/entry.mjs

USER deno
EXPOSE 3000

CMD ["run", "-A", "dist/server/entry.mjs"]
