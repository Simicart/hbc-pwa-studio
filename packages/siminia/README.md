# siminia

## 1. Clone pwa-studio
```
git clone https://github.com/magento-research/pwa-studio/
cd pwa-studio
git checkout release/4.0
cp packages/venia-concept/.env.dist packages/venia-concept/.env
```

## 2. Modify package.json

workspaces:
```

  "workspaces": [
...
    "packages/upward-spec",
    "packages/siminia"
  ],

```

scripts:

```
  "scripts": {
	...
    "venia": "yarn workspace @magento/venia-concept",
    "watch:siminia": "yarn workspace @simicart/siminia run watch; cd - >/dev/null",
    "stage:siminia": "yarn workspace @simicart/siminia run start; cd - >/dev/null"
  },
```
## 3. Clone siminia
```
cd  packages
git clone https://github.com/Simicart/siminia
cd ..
yarn install
yarn run build
```
## 4. Run watch/stage
To run watch
```
yarn run watch:siminia
```
To run production
```
NODE_ENV=production PORT=8080 npm run stage:siminia
```
