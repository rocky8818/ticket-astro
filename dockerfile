# 🏗️
# BUILD 
FROM node:lts as BUILD

# ♻️ Copy project
WORKDIR /app/astro
COPY package.json package-lock.json ./
RUN npm i
COPY . .

# 🧙‍♂️ Build react
RUN npm run build-remote
# --

# 🤖
# PRODUCTION
FROM node:lts
ENV NODE_ENV production


# 🚀 Update and install 
# - dumb-init (https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html)
RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends dumb-init \
  && rm -rf /var/lib/apt/lists/*


# ♻️ Copy project to BUILD
WORKDIR /user/app
COPY --from=BUILD /app/astro/dist/ ./_Astro
COPY package.json .
RUN npm i --omit=dev


# 🚀 Run
# - dumb-init (https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html)
ENV HOST=0.0.0.0
EXPOSE ${PORT}
USER node
CMD ["dumb-init", "node", "_Astro/server/entry.mjs"]