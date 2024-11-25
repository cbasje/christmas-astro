FROM denoland/deno:2.0.6
WORKDIR /app

COPY . .
RUN deno install
RUN deno task astro build
RUN deno cache main.ts

USER deno
EXPOSE 3000

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--unstable-kv", "main.ts"]