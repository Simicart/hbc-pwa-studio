git reset --hard
git pull origin master
cd ./packages/siminia
yarn install
yarn run build
cd ../../
yarn install
yarn run build
pm2 delete hbc
NODE_ENV=production PORT=8080 pm2 start --name hbc yarn run stage:siminia
curl -v https://staging.hairbowcenter.com/simiconnector/index/updatepwaversion
