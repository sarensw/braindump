# set the node env
export NODE_ENV=production

# build
npx esbuild src/main/index.js src/main/preload.js --outdir=buildci/main --bundle --platform=node --external:electron --format=cjs
npx snowpack build
npx electron-builder build --linux --publish never