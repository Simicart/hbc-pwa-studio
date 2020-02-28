cd ./packages/siminia
yarn install
yarn run build
cd ../../
yarn install
yarn run build
NODE_ENV=production PORT=8084 yarn run stage:siminia