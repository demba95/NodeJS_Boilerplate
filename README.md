<h1>Last Update - 11/13/2021</h1>

---

<h1 id='contents'>Table of Contents</h1>

- [NODE.JS BOILERPLATE](#nodejs-boilerplate)
  - [Config](#config)
    - [Init Typescript](#init-typescript)
    - [package.json](#packagejson)
    - [Environment Variables](#environment-variables)
    - [Database Connection](#database-connection)
      - [MongoDB](#mongodb)
        - [Warnings](#warnings)
    - [Telegram](#telegram)
  - [Controllers](#controllers)
    - [Api](#api)
      - [Api](#api-1)
      - [Device](#device)
      - [IoT](#iot)
      - [User](#user)
    - [Telegram](#telegram-1)
      - [Actions](#actions)
      - [Commands](#commands)
      - [Helpers](#helpers)
  - [Middlewares](#middlewares)
    - [Authorization](#authorization)
  - [Models](#models)
    - [Api](#api-2)
    - [Device](#device-1)
    - [User](#user-1)
      - [Pre Save](#pre-save)
      - [Compare Password](#compare-password)
      - [Remove Fields](#remove-fields)
  - [Routes](#routes)
    - [Api](#api-3)
    - [Device](#device-2)
    - [IoT](#iot-1)
    - [User](#user-2)
  - [Utilities](#utilities)
    - [Types](#types)
      - [Functions](#functions)
      - [Types](#types-1)
    - [Helpers](#helpers-1)
      - [Functions](#functions-1)
      - [Validator](#validator)
  - [Server](#server)
    - [App.ts](#appts)
    - [Index.ts](#indexts)
  - [Jest - Test](#jest---test)
    - [Init](#init)
    - [Config](#config-1)
    - [Database Connects](#database-connects)
    - [Test Cases](#test-cases)
      - [\_\_mocks\_\_](#__mocks__)
        - [@SENDGRID](#sendgrid)
        - [@TYPES](#types-2)
      - [Coverage Test](#coverage-test)
  - [Babel](#babel)
    - [Config](#config-2)

# NODE.JS BOILERPLATE

## Config

### Init Typescript

[Go Back to Contents](#contents)

Initialize TypesScript, on your root folder

```Bash
  tsc --init
```

This command will generate the `tsconfig.json`

```JSON
  {
      "compilerOptions": {
          "target": "es5",
          "module": "commonjs",
          "allowJs": true,
          "outDir": "./dist",
          "rootDir": "./src",
          "removeComments": true,
          "noEmitOnError": true,
          "resolveJsonModule": true,
          "strict": true,
          "noImplicitAny": true,
          "noUnusedLocals": true,
          "noUnusedParameters": true,
          "noImplicitReturns": false,
          "noFallthroughCasesInSwitch": true,
          "noUncheckedIndexedAccess": true,
          "moduleResolution": "node",
          "suppressImplicitAnyIndexErrors": true,
          "baseUrl": "./src",
          "paths": {
              "~/*": ["./*"],
              "@app": ["./app.ts"],
              "@config/*": ["./config/*"],
              "@controllers/*": ["./controllers/*"],
              "@telegram": ["./controllers/telegram/telegram.ts"],
              "@tHelpers": ["./controllers/telegram/helpers/helpers.ts"],
              "@api": ["./controllers/api/v1/api.ts"],
              "@device": ["./controllers/api/v1/device.ts"],
              "@iot-device": ["./controllers/api/v1/iot-device.ts"],
              "@user": ["./controllers/api/v1/user.ts"],
              "@middlewares/*": ["./middlewares/*"],
              "@auth": ["./middlewares/auth.ts"],
              "@models/*": ["./models/*"],
              "@routes": ["./routes/routes.ts"],
              "@temp": ["./tmp/temp.ts"],
              "@utils/*": ["./utils/*"],
              "@cTypes": ["./utils/@types/types.ts"],
              "@helpers/*": ["./utils/helpers/*"],
              "@cFunctions": ["./utils/helpers/functions.ts"],
              "@validators": ["./utils/helpers/validators.ts"]
          },
          "typeRoots": ["./node_modules/@types", "./src/utils/@types/*"],
          "esModuleInterop": true,
          "skipLibCheck": true,
          "forceConsistentCasingInFileNames": true,
          "types": ["node", "jest"]
      },
      "include": ["./src/**/*"],
      "exclude": ["**/node_modules"]
  }
```

### package.json

[Go Back to Contents](#contents)

After we install everything, we just need to config the **scripts** and **jest**

```JSON
  "scripts": {
      "start": "node dist/index.js",
      "dev": "env-cmd -f ./env/dev.env ts-node-dev -r tsconfig-paths/register --respawn --transpile-only --ignore-watch node_modules --no-notify src/index.ts",
      "build": "babel src --extensions \".js,.ts\" --out-dir dist --copy-files --no-copy-ignored",
      "test": "env-cmd -f ./env/test.env jest --runInBand --detectOpenHandles --config ./jest.config.js --coverage",

  },
  "jest": {
      "bail": 1,
      "verbose": true,
      "testEnvironment": "node",
      "moduleFileExtensions": [
          "ts",
          "js"
      ]
  },
```

- `ts-node-dev --respawn --transpile-only --ignore-watch node_modules --no-notify src/index.ts` responsible for fast reloading the server using TypeScript, `--no-notify` (for linux users)
- `-r tsconfig-paths/register` register (`-r`) custom typescript before executing the rest.

Complete json file

```JSON
  {
      "name": "node.js_boilerplate",
      "version": "1.0.0",
      "description": "Node.js Boilerplate",
      "main": "index.js",
      "scripts": {
          "start": "node dist/index.js",
          "dev": "env-cmd -f ./env/dev.env ts-node-dev -r tsconfig-paths/register --respawn --transpile-only --ignore-watch node_modules --no-notify src/index.ts",
          "prod": "env-cmd -f ./env/prod.env ts-node-dev -r tsconfig-paths/register --respawn --transpile-only --ignore-watch node_modules --no-notify src/index.ts",
          "test": "env-cmd -f ./env/test.env jest --runInBand --detectOpenHandles --config ./jest.config.js --coverage",
          "build": "babel src --extensions \".js,.ts\" --out-dir dist --copy-files --no-copy-ignored"
      },
      "jest": {
          "bail": 1,
          "verbose": true,
          "testEnvironment": "node",
          "moduleFileExtensions": [
              "ts",
              "js"
          ]
      },
      "repository": {
          "type": "git",
          "url": "git+https://github.com/Roger-Takeshita/Node.js_Boilerplate.git"
      },
      "author": "Roger Takeshita",
      "license": "ISC",
      "bugs": {
          "url": "https://github.com/Roger-Takeshita/Node.js_Boilerplate/issues"
      },
      "homepage": "https://github.com/Roger-Takeshita/Node.js_Boilerplate#readme",
      "dependencies": {
          "@sendgrid/mail": "^7.4.4",
          "bcrypt": "^5.0.1",
          "cors": "^2.8.5",
          "crypto-js": "^4.0.0",
          "env-cmd": "^10.1.0",
          "express": "^4.17.1",
          "helmet": "^4.6.0",
          "jsonwebtoken": "^8.5.1",
          "mongoose": "^5.12.13",
          "morgan": "^1.10.0",
          "node-fetch": "^2.6.1",
          "telegraf": "^4.4.0"
      },
      "devDependencies": {
          "@babel/cli": "^7.12.1",
          "@babel/core": "^7.14.5",
          "@babel/node": "^7.14.5",
          "@babel/preset-env": "^7.14.5",
          "@babel/preset-typescript": "^7.14.5",
          "@types/bcrypt": "^5.0.0",
          "@types/cors": "^2.8.10",
          "@types/crypto-js": "^4.0.1",
          "@types/express": "^4.17.12",
          "@types/jest": "^27.0.2",
          "@types/jsonwebtoken": "^8.5.1",
          "@types/morgan": "^1.9.2",
          "@types/node": "^15.12.2",
          "@types/node-fetch": "^2.5.12",
          "@types/supertest": "^2.0.11",
          "babel-plugin-module-resolver": "^4.1.0",
          "jest": "^27.3.1",
          "supertest": "^6.1.6",
          "ts-jest": "^27.0.3",
          "ts-node-dev": "^1.1.6",
          "tsconfig-paths": "^3.9.0",
          "typescript": "^4.3.2"
      }
  }
```

### Environment Variables

[Go Back to Contents](#contents)

In `env/dev.env`

```Bash
  ENV=test
  JWT_DEVICE_SECRET_KEY=MyUltra$3cr3tK3yIoT
  JWT_SECRET_EXPIRES_IN=7
  JWT_SECRET_KEY=SuperSecretKey
  JWT_VERIFICATION_EXPIRES_IN=7
  JWT_VERIFICATION_SECRET_KEY=SuperSecretKeyVerification
  LOGIN_MAX_TRY=2
  LOGIN_WAIT_TIME=2
  PASSWORD_LEN=4
  PORT=3001
  SECRET_KEY_BASE=replace-me
  SENDGRID_EMAIL=replace-me
  SENDGRID_KEY=replace-me
  TELEGRAM_ADM_ID=replace-me
  TELEGRAM_BOT_TOKEN=replace-me
  TELEGRAM_GROUP_ID=replace-me
  TELEGRAM_CLEAR_CHAT_MSG=15
  TELEGRAM_CLEAR_GROUP_MSG=15
  TELEGRAM_WEBHOOK=replace-me
  URL_DATABASE=mongodb://127.0.0.1:27017/BackendBoilerplateDB
  URL_FRONTEND=http://127.0.0.1:3000
```

### Database Connection

#### MongoDB

[Go Back to Contents](#contents)

In `src/config/database.ts`

```TypeScript
  import mongoose from 'mongoose';
  const db = mongoose.connection;

  mongoose.connect(process.env.URL_DATABASE!, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
  });

  db.once('connected', () => {
      console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
  });
```

##### Warnings

[Go Back to Contents](#contents)

To fix all deprecation warnings, follow the below steps:

- `mongoose.set('useNewUrlParser', true);`
- `mongoose.set('useFindAndModify', false);`
- `mongoose.set('useCreateIndex', true);`
- `mongoose.set('useUnifiedTopology', true);`
- Replace `update()` with `updateOne()`, `updateMany()`, or `replaceOne()`
- Replace `remove()` with `deleteOne()` or `deleteMany()`.
- Replace `count()` with `countDocuments()`, unless you want to count how many documents are in the whole collection (no filter). In the latter case, use `estimatedDocumentCount()`.

Mongoose connection options:

- `useNewUrlParser`, by default `mongoose.connect()` will print out the bellow warning
  > DeprecationWarning: current URL string parser is deprecated, and will be
  > removed in a future version. To use the new parser, pass option
  > `{ useNewUrlParser: true }` to MongoClient.connect.
- `useCreateIndex`, by default, Mongoose 5.x calls the MongoDB driver's `ensureIndex()` function. The MongoDB driver deprecated this function in favor of `createIndex()`. Set the useCreateIndex global option to opt in to making Mongoose use `createIndex()` instead.
- `useUnifiedTopology`, by default, `mongoose.connect()` will print out the below warning:
  > DeprecationWarning: current Server Discovery and Monitoring engine is
  > deprecated, and will be removed in a future version. To use the new Server
  > Discover and Monitoring engine, pass option `{ useUnifiedTopology: true }` to
  > the MongoClient **constructor**.
  - Mongoose 5.7 uses MongoDB driver 3.3.x, which introduced a significant refactor of how it handles monitoring all the servers in a replica set or sharded cluster. In MongoDB parlance, this is known as server discovery and monitoring.
  - The **useUnifiedTopology** option removes support for several connection options that are no longer relevant with the new topology engine:
    - autoReconnect
    - reconnectTries
    - reconnectInterval
  - When you enable **useUnifiedTopology**, please remove those options from your `mongoose.connect()` or `createConnection()` calls.
- `useFindAndModify`, if you use `Model.findOneAndUpdate()`, by default you'll see one of the below deprecation warnings.
  > DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: <https://mongoosejs.com/docs/deprecations.html#findandmodify>
  > DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
  - **findByIdAndUpdate** method bypass mongoose. It performs a direct operation on the database, this means that if we have a middleware, it won't be executed.

### Telegram

[Go Back to Contents](#table-of-contents)

In `src/config/telegram.ts`

```TypeScript
  import { Telegraf } from 'telegraf';

  const TELEGRAM_BOT_TOKEN: string = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_WEBHOOK: string = process.env.TELEGRAM_WEBHOOK!;

  if (TELEGRAM_BOT_TOKEN === undefined) throw new Error('TELEGRAM_BOT_TOKEN must be defined');

  const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
  const secretPath: string = `/telegram/${bot.secretPathComponent()}`;
  const webhook: string = `${TELEGRAM_WEBHOOK}${secretPath}`;

  if (process.env.ENV! !== 'test') {
      bot.telegram.setWebhook(webhook);
      console.log(`Telegram running on ${webhook}`);
  }

  export { bot, secretPath };
```

## Controllers

### Api

#### Api

[Go Back to Contents](#table-of-contents)

In `src/controllers/api/v1/api.ts`

```TypeScript
  import * as CF from '@cFunctions';
  import * as Type from '@cTypes';
  import Api from '@models/api';
  import * as validate from '@validators';
  import { RequestHandler } from 'express';

  const permittedFields: string[] = ['name', 'key', 'value', 'url', 'description', 'active'];

  export const newApi: RequestHandler = async (req, res) => {
      const form: Type.ApiForm = req.body;
      const { valid, errors } = validate.apiForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const api: Type.ApiI = await Api.findOne({
              name: form.name,
              userId: req.user!._id,
          });
          if (api) return res.status(400).json({ message: 'API already exists.' });

          delete form._id;
          const newApi = new Api(form);
          newApi.userId = req.user!._id;

          res.status(201).json(await newApi.save());
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while trying to create a new api.' });
      }
  };

  export const getApis: RequestHandler = async (req, res) => {
      const page: number = +req.query.page! || 1;
      const docs: number = +req.query.docs! || 30;
      const apisArray: Type.ApiForm[] = [];

      try {
          const apis: Type.ApiI[] = await Api.find({ userId: req.user!._id })
              .skip((page - 1) * docs)
              .limit(docs);

          apis.forEach((api) => {
              api!.getKey!((key, value) => {
                  apisArray.push({
                      _id: api!._id,
                      name: api!.name,
                      active: api!.active,
                      url: api!.url,
                      key: key!.toString(),
                      value: value!.toString(),
                      description: api!.description,
                  });
              });
          });

          res.json(apisArray);
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while getting your apis.' });
      }
  };

  export const getApi: RequestHandler = async (req, res) => {
      const apiId: string = req.params.id!;

      try {
          const api: Type.ApiI = await Api.findOne({
              _id: apiId,
              userId: req.user!._id,
          });
          if (!api) return res.status(404).json({ message: 'API not found.' });

          api.getKey!((key, value) => {
              res.json({
                  _id: api._id,
                  name: api.name,
                  active: api.active,
                  url: api.url,
                  key,
                  value,
              });
          });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while getting your api.' });
      }
  };

  export const updateApi: RequestHandler = async (req, res) => {
      const apiId: string = req.params.id!;
      const form: Type.ApiForm = req.body;
      const { valid, errors } = validate.apiForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const apiExists: Type.ApiI = await Api.findOne({
              name: req.body.name!.trim(),
              userId: req.user!._id,
          });
          if (apiExists && apiExists._id.toString() !== apiId)
              return res.status(400).json({ message: 'API name already in use, please use a different name.' });

          const api = await Api.findById(apiId);
          if (!api) return res.status(404).json({ message: 'API not found.' });
          CF.updateDocument(api, req.body, permittedFields);
          await api.save();

          res.json({ message: 'API has been updated successfully.' });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while updating your api.' });
      }
  };

  export const deleteApi: RequestHandler = async (req, res) => {
      const apiId: string = req.params.id!;

      try {
          const deletedApi: Type.ApiI = await Api.findOneAndDelete({
              _id: apiId,
              userId: req.user!._id,
          });
          if (deletedApi) return res.json({ message: 'API has been deleted successfully.' });

          res.status(404).json({ message: 'API Id not found. Please make sure you have entered the correct id.' });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while deleting your api.' });
      }
  };
```

#### Device

[Go Back to Contents](#table-of-contents)

In `src/controllers/api/v1/device.ts`

```TypeScript
  import * as auth from '@auth';
  import * as CF from '@cFunctions';
  import * as Type from '@cTypes';
  import Device from '@models/device';
  import * as validate from '@validators';
  import { RequestHandler } from 'express';

  const JWT_DEVICE_SECRET_KEY: string = process.env.JWT_DEVICE_SECRET_KEY!;
  const permittedFields: string[] = ['name', 'expiresIn', 'description', 'active'];

  export const newDevice: RequestHandler = async (req, res) => {
      const form: Type.DeviceForm = req.body;
      const { valid, errors } = validate.deviceForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const device: Type.DeviceI = await Device.findOne({
              name: form.name,
              userId: req.user!._id,
          });
          if (device) return res.status(400).json({ message: 'Device already exists.' });

          delete form._id;
          const newDevice = new Device(form);
          const days: number = +form.expiresIn! || 0;
          newDevice.token = auth.createCustomToken(
              'device',
              { _id: newDevice._id, userId: req.user!._id },
              JWT_DEVICE_SECRET_KEY,
              days
          );
          newDevice.userId = req.user!._id;

          res.status(201).json(await newDevice.save());
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while creating a new device.' });
      }
  };

  export const getDevices: RequestHandler = async (req, res) => {
      const page: number = +req.body.page! || 1;
      const docs: number = +req.body.docs! || 30;

      try {
          const devices: Type.DeviceI[] = await Device.find({ userId: req.user!._id })
              .skip((page - 1) * docs)
              .limit(docs);

          res.json(devices);
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while getting your devices.' });
      }
  };

  export const getDevice: RequestHandler = async (req, res) => {
      const deviceId: string = req.params.id!;

      try {
          const device: Type.DeviceI = await Device.findOne({ _id: deviceId, userId: req.user!._id });
          if (!device) return res.status(404).json({ message: 'Device not found.' });

          res.json(device);
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while getting your device.' });
      }
  };

  export const updateDevice: RequestHandler = async (req, res) => {
      const iotId: string = req.params.id!;
      const form: Type.DeviceForm = req.body;
      const { valid, errors } = validate.deviceForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const deviceExists: Type.DeviceI = await Device.findOne({
              name: req.body.name!.trim(),
              userId: req.user!._id,
          });
          if (deviceExists && deviceExists._id.toString() !== iotId)
              return res.status(400).json({ message: 'Device name already in use, please use a different name.' });

          const device = await Device.findById(iotId);
          if (!device) return res.status(404).json({ message: 'Device not found.' });
          if (form.hasOwnProperty('expiresIn') && +form.expiresIn! !== +device.expiresIn)
              device.token = auth.createCustomToken(
                  'device',
                  { _id: device._id, userId: req.user!._id },
                  JWT_DEVICE_SECRET_KEY,
                  +form.expiresIn!
              );
          CF.updateDocument(device, req.body, permittedFields);
          await device.save();

          res.json({ message: 'Device has been updated successfully.', data: device });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while updating your device.' });
      }
  };

  export const deleteDevice: RequestHandler = async (req, res) => {
      const iotId: string = req.params.id!;

      try {
          const deletedIoT: Type.DeviceI = await Device.findOneAndDelete({
              _id: iotId,
              userId: req.user!._id,
          });
          if (deletedIoT) return res.json({ message: 'Device has been deleted successfully.' });

          res.status(404).json({ message: 'Device Id not found. Please make sure you have entered the correct id.' });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while deleting your device.' });
      }
  };
```

#### IoT

[Go Back to Contents](#table-of-contents)

In `src/controllers/api/v1/iot-device.ts`

```TypeScript
  import { bot } from '@config/telegram';
  import * as Type from '@cTypes';
  import Device from '@models/device';
  import User from '@models/user';
  import { RequestHandler } from 'express';

  export const notify: RequestHandler = async (req, res) => {
      try {
          const { data, notify }: Type.IoTDeviceData = req.body;

          if (notify) {
              const device: Type.DeviceI = await Device.findOne({
                  _id: req.device!._id,
                  userId: req.device!.userId,
              });
              if (!device) return res.status(404).json({ message: 'Device not found.' });

              const user: Type.UserI = await User.findById(req.device!.userId);
              if (!user) return res.status(404).json({ message: 'User not found.' });

              if (user!.telegramId.length === 0)
                  return res.status(400).json({ message: 'No telegram Id associated to your account.' });
              if (!user!.isTelegramVerified) return res.status(400).json({ message: 'Telegram not verified.' });

              const msg: string = `<b>Device:</b> ${device.name.toUpperCase()}\
                                   \n\
                                   \n   <u>Msg:</u> ${data.message}`;
              const { message_id: msgId }: any = await bot.telegram.sendMessage(user!.telegramId, msg, {
                  parse_mode: 'HTML',
              });
              await bot.telegram.deleteMessage(user!.telegramId, msgId);
          }

          res.json('Server received your message!');
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while executing your request.' });
      }
  };
```

#### User

[Go Back to Contents](#table-of-contents)

In `src/controllers/api/v1/user.ts`

```TypeScript
  import * as auth from '@auth';
  import * as CF from '@cFunctions';
  import { bot } from '@config/telegram';
  import * as Type from '@cTypes';
  import Api from '@models/api';
  import User from '@models/user';
  import sgMail from '@sendgrid/mail';
  import * as validate from '@validators';
  import { RequestHandler } from 'express';
  import jwt from 'jsonwebtoken';

  sgMail.setApiKey(process.env.SENDGRID_KEY!);

  const JWT_VERIFICATION_SECRET_KEY: string = process.env.JWT_VERIFICATION_SECRET_KEY!;
  const JWT_VERIFICATION_EXPIRES_IN: number = +process.env.JWT_VERIFICATION_EXPIRES_IN!;
  const LOGIN_WAIT_TIME: number = +process.env.LOGIN_WAIT_TIME!;
  const LOGIN_MAX_TRY: number = +process.env.LOGIN_MAX_TRY!;
  const ENV: string = process.env.ENV!;
  const TELEGRAM_CLEAR_CHAT_MSG: number = +process.env.TELEGRAM_CLEAR_CHAT_MSG!;

  export const addTry: Type.AddTryFn = async (user, res) => {
      try {
          const loginCount: number = +user!.loginCount! + 1;
          const waitTime: number = LOGIN_WAIT_TIME * +user!.waitCount! * +user!.waitCount!;

          user!.loginCount = loginCount;
          if (loginCount > LOGIN_MAX_TRY) user!.waitCount = +user!.waitCount! + 1;
          await user!.save();

          if (LOGIN_MAX_TRY - user!.loginCount! >= 0) {
              return res
                  .status(400)
                  .json({ message: `Wrong credentials, you have ${LOGIN_MAX_TRY - loginCount + 1} more tries.` });
          }

          if (LOGIN_MAX_TRY - user!.loginCount! === -1)
              return res.status(400).json({
                  message: `Too many unsuccessful tries. Next try you will be blocked for ${LOGIN_WAIT_TIME} mins.`,
              });

          res.status(400).json({ message: `You have been blocked for ${waitTime} mins.` });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while trying to login.' });
      }
  };

  export const checkTimeElapsed: Type.CheckTimeElapsedFn = async (user, res) => {
      let loginCount: number = +user!.loginCount!;

      switch (true) {
          case loginCount <= LOGIN_MAX_TRY:
              return true;
          case loginCount > LOGIN_MAX_TRY:
              const date: number = new Date().getTime();
              const updateDate: number = new Date(user!.updatedAt!).getTime();

              if ((date - updateDate) / 1000 / 60 >= LOGIN_WAIT_TIME * +user!.waitCount! * +user!.waitCount!) {
                  user!.loginCount = 0;
                  user!.waitCount = 0;
                  await user!.save();
                  return true;
              }

              addTry(user, res);

              return false;
          default:
              return false;
      }
  };

  export const signUpUser: RequestHandler = async (req, res) => {
      const form: Type.UserSignUpForm = req.body;
      const { valid, errors } = validate.userSignUpForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const user: Type.UserI = await User.findOne({ email: form.email });
          if (user) return res.status(400).json({ message: 'Email already in use.' });

          const response: Type.SignUpUserRes = {
              message: 'Your account has been created. Please check your email to verify your account.',
          };

          delete form.confirmPassword;
          form.verifyToken = auth.createCustomToken(
              'email',
              {},
              JWT_VERIFICATION_SECRET_KEY,
              JWT_VERIFICATION_EXPIRES_IN
          );
          const newUser: Type.UserI = new User(form);
          await newUser.save();

          if (ENV === 'production') {
              try {
                  const email = CF.userSignUp(user, req.headers.host!);
                  await sgMail.send(email);
              } catch (error: any) {
                  return res.status(500).json({ message: `${error.message} - ${error.response.body.errors[0].message}` });
              }
          } else {
              response.verifyToken = form.verifyToken;
          }

          res.status(201).json(response);
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while trying to sign up.' });
      }
  };

  export const loginUser: RequestHandler = async (req, res) => {
      const form: Type.UserLoginForm = req.body;
      const { valid, errors } = validate.userLoginForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const user: Type.UserI = await User.findOne({ email: form.email });
          if (!user) return res.status(404).json({ message: 'Wrong credentials.' });
          if (user.status === 'suspended') return res.status(400).json({ message: 'Your account is suspended.' });

          if (await checkTimeElapsed(user, res)) {
              user.comparePassword(form.password, async (_: any, matchPassword: boolean) => {
                  const response: Type.LoginUserRes = {
                      token: '',
                      message: 'Please verify your email first.',
                  };
                  if (matchPassword) {
                      if (user.status === 'activated') {
                          if (user.loginCount !== 0 || user.waitCount !== 0) {
                              user.loginCount = 0;
                              user.waitCount = 0;
                              await user.save();
                          }
                          const token = auth.createAccessToken(user);
                          return res.json({ token });
                      }

                      if (ENV !== 'production') response.verifyToken = user.verifyToken;

                      return res.status(403).json(response);
                  } else {
                      addTry(user, res);
                  }
              });
          }
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while trying to login.' });
      }
  };

  export const getUser: RequestHandler = async (req, res) => {
      try {
          const user: Type.UserI = await User.findById(req.user!._id).select('-tempEmail');
          if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

          res.json(user);
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while trying to get profile.' });
      }
  };

  export const updateUser: RequestHandler = async (req, res) => {
      const form: Type.UserProfileForm = req.body;
      const { valid, errors } = validate.userProfileForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const user: Type.UserI = await User.findById(req.user!._id);
          if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

          if (user.email !== form.email) {
              const email: Type.UserI = await User.findOne({ email: form.email });
              if (email) return res.status(400).json({ message: `Email (${form.email}) is already in use.` });
          }

          user.comparePassword(form.password, async (_: any, matchPassword: boolean) => {
              if (matchPassword) {
                  const response: Type.SignUpUserRes = {
                      message: 'Your profile has been updated.',
                  };

                  if (form.firstName) user.firstName = form.firstName;
                  if (form.lastName) user.lastName = form.lastName;
                  if (form.newPassword) user.password = form.newPassword;
                  if (
                      (!validate.isEmpty(form.telegramId) && user.telegramId === '') ||
                      (!validate.isEmpty(form.telegramId) && form.telegramId.trim() !== user.telegramId)
                  ) {
                      if (form.telegramId.trim() !== user.telegramId) {
                          const userExists: Type.UserI = await User.findOne({ telegramId: form.telegramId });
                          if (userExists && userExists.isTelegramVerified)
                              return res.status(400).json({ message: `Telegram ${form.telegramId} is already in use.` });
                      }

                      user.telegramId = form.telegramId;
                      user.isTelegramVerified = false;

                      if (ENV !== 'test') {
                          const chatId: string = form.telegramId;
                          const msg: string = `Hey <b>${user.firstName} ${user.lastName}</b>!\
                                               \n\
                                               \nPlease send /verify to activate your telegram.`;
                          const { message_id: msgId }: Type.MessageId = await bot.telegram.sendMessage(chatId, msg, {
                              parse_mode: 'HTML',
                          });

                          setTimeout(
                              async () => {
                                  try {
                                      await bot.telegram.deleteMessage(chatId, +msgId);
                                  } catch (error: any) {
                                      console.error(error);
                                  }
                              },
                              TELEGRAM_CLEAR_CHAT_MSG * 1000,
                              bot,
                              chatId,
                              msgId
                          );
                      }
                  }
                  if (user.email !== form.email) {
                      response.message += ` An email has been sent to ${form.email}. Please verify your new email to update your email address.`;
                      user.tempEmail = form.email;
                      user.verifyToken = auth.createCustomToken(
                          'email',
                          {},
                          JWT_VERIFICATION_SECRET_KEY,
                          JWT_VERIFICATION_EXPIRES_IN
                      );
                      await user.save();

                      try {
                          if (ENV === 'production') {
                              try {
                                  const email = CF.updateUserEmail(user, req.headers.host!);
                                  await sgMail.send(email);
                              } catch (error: any) {
                                  return res
                                      .status(500)
                                      .json({ message: `${error.message} - ${error.response.body.errors[0].message}` });
                              }
                          } else {
                              response.verifyToken = user.verifyToken;
                          }
                      } catch (error: any) {
                          res.status(500).json({
                              message: 'Something went wrong while sending you the email verification.',
                          });
                      }
                  } else {
                      await user.save();
                  }

                  return res.json(response);
              }

              res.status(403).json({ message: 'Wrong credentials.' });
          });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while updating.' });
      }
  };

  export const deleteUser: RequestHandler = async (req, res) => {
      const form: Type.UserDeleteForm = req.body;
      const { valid, errors } = validate.userPasswordForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const user: Type.UserI = await User.findById(req.user!._id);
          if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

          user.comparePassword(form.password, async (_: any, matchPassword: boolean) => {
              if (matchPassword) {
                  await user.remove();
                  await Api.deleteMany({ userId: req.user!._id });
                  return res.json({ message: 'Your account has been deleted.' });
              }

              res.status(403).json({ message: 'Wrong password.' });
          });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong while deleting your user.' });
      }
  };

  export const verifyEmail: RequestHandler = async (req, res) => {
      const token: string = req.params.verifyToken!;

      try {
          jwt.verify(token, JWT_VERIFICATION_SECRET_KEY);
      } catch (error: any) {
          return res.status(401).json({ message: 'Expired email token.' });
      }

      try {
          const user: Type.UserI = await User.findOne({ verifyToken: token });
          if (!user)
              return res.status(404).json({ message: 'Invalid email token, please reset your email and try again.' });

          user.verifyToken = '';
          user.status = 'activated';

          if (user.tempEmail) {
              user.email = user.tempEmail;
              user.tempEmail = '';
          }
          await user.save();

          res.json({ message: 'Thank you! Your email has been verified.' });
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong verifying your account.' });
      }
  };

  export const resendEmailVerification: RequestHandler = async (req, res) => {
      const form: Type.UserEmailForm = req.body;
      const { valid, errors } = validate.userEmailForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const user: Type.UserI = await User.findOne({ email: form.email });
          if (!user) return res.status(404).json({ message: 'Email not found.' });
          if (user.status === 'activated') return res.json({ message: 'Your account is already verified.' });
          const response: Type.SignUpUserRes = {
              message: 'A verification code was sent to your email.',
          };

          user.verifyToken = auth.createCustomToken(
              'email',
              {},
              JWT_VERIFICATION_SECRET_KEY,
              JWT_VERIFICATION_EXPIRES_IN
          );

          await user.save();

          if (ENV === 'production') {
              try {
                  const email = CF.userSignUp(user, req.headers.host!);
                  await sgMail.send(email);
              } catch (error: any) {
                  return res.status(500).json({ message: `${error.message} - ${error.response.body.errors[0].message}` });
              }
          } else {
              response.verifyToken = user.verifyToken;
          }

          res.json(response);
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong with the email verification.' });
      }
  };

  export const resetPassword: RequestHandler = async (req, res) => {
      const form: Type.UserEmailForm = req.body;
      const { valid, errors } = validate.userEmailForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const user: Type.UserI = await User.findOne({ email: form.email });
          if (!user) return res.status(404).json({ message: 'Email not found.' });
          const response: Type.SignUpUserRes = {
              message: 'Please check your email to reset your password.',
          };

          user.verifyToken = auth.createCustomToken(
              'password',
              {},
              JWT_VERIFICATION_SECRET_KEY,
              JWT_VERIFICATION_EXPIRES_IN
          );
          await user.save();

          if (ENV === 'production') {
              try {
                  const email = CF.resetUserPassword(user);
                  await sgMail.send(email);
              } catch (error: any) {
                  return res.status(500).json({ message: `${error.message} - ${error.response.body.errors[0].message}` });
              }
          } else {
              response.verifyToken = user.verifyToken;
          }

          res.json(response);
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong with the email verification.' });
      }
  };

  export const updatePassword: RequestHandler = async (req, res) => {
      const token: string = req.params.verifyToken!;

      try {
          jwt.verify(token, JWT_VERIFICATION_SECRET_KEY);
      } catch (error: any) {
          return res.status(401).json({ message: 'Expired password token.' });
      }

      const form: Type.UserPasswordForm = req.body;
      const { valid, errors } = validate.userPasswordForm(form);
      if (!valid) return res.status(400).json(errors);

      try {
          const user: Type.UserI = await User.findOne({ verifyToken: token });
          if (!user)
              return res
                  .status(404)
                  .json({ message: 'Your token has expired, please reset your password and try again.' });
          const response: Type.SignUpUserRes = {
              message: 'Password updated successfully.',
          };

          user.verifyToken = '';
          user.password = form.password;
          await user.save();

          if (ENV === 'production') {
              try {
                  const email = CF.updateUserPassword(user);
                  await sgMail.send(email);
              } catch (error: any) {
                  return res.status(500).json({ message: `${error.message} - ${error.response.body.errors[0].message}` });
              }
          }

          res.json(response);
      } catch (error: any) {
          res.status(500).json({ message: 'Something went wrong with the email verification.' });
      }
  };
```

### Telegram

In `src/controllers/telegram/telegram.ts`

```TypeScript
  import { bot } from '@config/telegram';
  import * as TH from '@tHelpers';
  import { Context } from 'telegraf';
  import './actions/base';
  import './commands/base';

  bot.hears(/\/(.+)/i, async (ctx) => {
      const msg: string = `Sorry, command /${ctx.match[1]!} doesn't exist or it's incorrect.\
                           \nSend /help to view the available commands.`;

      try {
          await TH.deleteMsgGetUser(ctx);
          await TH.sendMsgDeleteMsg(ctx, msg);
      } catch (error: any) {
          if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
          throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while executing your command.' };
      }
  });

  bot.action(/(.+)/i, async (ctx) => {
      console.log(ctx);

      try {
          const msg: string = 'Sorry something went wrong while executing your request.\nPlease try again.';
          TH.editMsgDeleteMsg(ctx, msg);
      } catch (error: any) {
          throw error;
      }
  });

  bot.catch(async (error: any, ctx: Context) => {
      if (error.type !== 'USER_NOT_REGISTERED') await TH.sendMsgDeleteMsg(ctx, error.message);
  });
```

#### Actions

[Go Back to Contents](#table-of-contents)

- In `src/controllers/telegram/actions/base.ts`

  ```TypeScript
    import { bot } from '@config/telegram';
    import * as TH from '@tHelpers';

    bot.action('cancel', async (ctx) => {
        const msg: string = '<b>Request aborted!</b>';

        try {
            TH.editMsgDeleteMsg(ctx, msg, 2);
        } catch (error: any) {
            throw error;
        }
    });

    bot.action('dismiss', async (ctx) => {
        const msgId: number = ctx.update.callback_query.message!.message_id;

        try {
            TH.deleteMsg(ctx, msgId, 0);
        } catch (error: any) {
            throw error;
        }
    });
  ```

#### Commands

[Go Back to Contents](#table-of-contents)

- In `src/controllers/telegram/commands/base.ts`

  ```TypeScript
    import { bot } from '@config/telegram';
    import * as Type from '@cTypes';
    import User from '@models/user';
    import * as TH from '@tHelpers';
    import { Markup } from 'telegraf';

    bot.command('start', async (ctx) => {
        try {
            await TH.deleteMsgGetUser(ctx);
            const msg: string = `Bot is already running...\
                                 \nSend /help to view the available commands.`;
            await TH.sendMsg(ctx, msg);
        } catch (error: any) {
            throw error;
        }
    });

    bot.command('verify', async (ctx) => {
        const telegramId: string = ctx.from.id.toString();
        let msg: string = '';

        try {
            await TH.deleteMsg(ctx, 0, 0);
            const user: Type.UserI = await User.findOne({ telegramId });

            if (!user) {
                throw { type: 'USER_NOT_REGISTERED', message: 'User not found.' };
            } else if (user && !user.isTelegramVerified) {
                user.isTelegramVerified = true;
                await user.save();
                msg = `Your telegram has been confirmed successfully.\
                       \n\
                       \n   Type /help to view all available commands.`;
            } else {
                msg = 'Your telegram is already verified!';
            }

            await TH.sendMsgDeleteMsg(ctx, msg);
        } catch (error: any) {
            throw error;
        }
    });

    bot.command('help', async (ctx) => {
        const chatType: string = ctx.chat.type;
        const keyboardConfig: Type.InLineKeyboardConfig = { columns: 0, rows: 0 };
        let keyboardButtons: string[] = [];
        let msg: string = '';

        if (chatType === 'private') {
            msg = `CHAT COMMANDS\
                   \n\
                   \n<b><u>Private:</u></b>\
                   \n\
                   \n/command1 »\
                   \n/command2 »\
                   \n\
                   \n<b><u>Other:</u></b>\
                   \n\
                   \n/me (your profile info)\
                   \n/help (list of commands)`;
            keyboardButtons = new Array('/command1', '/command2', '/me', '/help');
            keyboardConfig.columns = 2;
            keyboardConfig.rows = 2;
        } else {
            msg = `GROUP COMMANDS\
                   \n\
                   \n<b><u>Group:</u></b>\
                   \n\
                   \n/command1 »\
                   \n/command2 »\
                   \n\
                   \n<b><u>Other:</u></b>\
                   \n\
                   \n/me (your profile info)\
                   \n/help (list of commands)`;
            keyboardButtons = new Array('/command1', '/command2', '/me', '/help');
            keyboardConfig.columns = 2;
            keyboardConfig.rows = 2;
        }

        const keyboard: Type.ReplyKeyboard = Markup.keyboard(keyboardButtons, keyboardConfig).oneTime().resize();

        try {
            await TH.deleteMsgGetUser(ctx);
            await TH.sendKeyboard(ctx, msg, keyboard, true, false);
        } catch (error: any) {
            throw error;
        }
    });

    bot.command('me', async (ctx) => {
        const telegramId: number = ctx.from.id;
        const menu: Type.InLineMenu[] = [];

        try {
            await TH.deleteMsg(ctx, 0, 0);
            menu.push([Markup.button.callback('Dismiss', 'dismiss')]);
            const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

            const msg: string = `———————————————————————\
                                 \n                              YOUR PROFILE\
                                 \n\
                                 \n   <u>First Name:</u>    <b>${ctx.from.first_name}</b>\
                                 \n   <u>Last Name:</u>    <b>${ctx.from.last_name}</b>\
                                 \n   <u>Username:</u>    <a href="tg://username?id=${ctx.from.username}">${ctx.from.username}</a>\
                                 \n   <u>Direct Msg:</u>   <a href="t.me/${ctx.from.username}">t.me/${ctx.from.username}</a>\
                                 \n   <u>Telegram Id:</u>  <a href="tg://user?id=${telegramId}">${telegramId}</a>
                                 \n———————————————————————`;
            await TH.sendInLineKeyboard(ctx, msg, keyboard);
        } catch (error: any) {
            throw error;
        }
    });

    bot.command('info', async (ctx) => {
        // @ts-ignore
        const title: string = ctx.message.chat.title || 'N/A';
        const chatId: number = ctx.chat.id;
        const chatType: string = ctx.chat.type;
        const menu: Type.InLineMenu[] = [];

        try {
            const user = await TH.deleteMsgGetUser(ctx);

            if (user!.admin) {
                menu.push([Markup.button.callback('Dismiss', 'dismiss')]);
                const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

                const msg: string = `———————————————————————\
                                     \n                                CHAT INFO\
                                     \n\
                                     \n   <u>Chat Title:</u>    <b>${title.toUpperCase()}</b>\
                                     \n   <u>Chat Id:</u>        <b>${chatId}</b>\
                                     \n   <u>Chat Type:</u>   <b>${chatType.toUpperCase()}</b>
                                     \n———————————————————————`;
                await TH.sendInLineKeyboard(ctx, msg, keyboard);
            }
        } catch (error: any) {
            throw error;
        }
    });
  ```

#### Helpers

- In `src/controllers/telegram/helpers/functions/msg.ts`

  ```TypeScript
    import { bot } from '@config/telegram';
    import * as Type from '@cTypes';
    import * as TH from '@tHelpers';

    const TELEGRAM_CLEAR_CHAT_MSG: number = +process.env.TELEGRAM_CLEAR_CHAT_MSG!;

    export const deleteMsgGetUser: Type.DeleteMsgGetUserFn = async (ctx) => {
        try {
            await deleteMsg(ctx, 0, 0);
            return await TH.getUser(ctx);
        } catch (error: any) {
            throw error;
        }
    };

    export const sendMsg: Type.SendMsgFn = async (ctx, msg, disablePreview = true, personal = true) => {
        const chatId: number = personal ? ctx.from!.id : ctx.chat!.id;
        const options: Type.ExtraReplyMessage = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        };

        if (!disablePreview) delete options.disable_web_page_preview;

        try {
            const { message_id: msgId }: Type.MessageId = await bot.telegram.sendMessage(chatId, msg, options);
            return msgId;
        } catch (error: any) {
            throw {
                type: 'TELEGRAM_ERROR',
                message: `Something went wrong while sending a new message.\
                          \n\
                          \n   <b>ERROR:</b> ${error.message}`,
            };
        }
    };

    export const sendMsgDeleteMsg: Type.SendMsgDeleteMsgFn = async (ctx, msg, time) => {
        try {
            const newMsgId = await sendMsg(ctx, msg);
            await deleteMsg(ctx, newMsgId, time);
        } catch (error: any) {
            throw error;
        }
    };

    export const sendInLineKeyboard: Type.SendInLineKeyboardFn = async (
        ctx,
        msg,
        keyboard,
        telegramId = 0,
        disablePreview = true,
        personal = true
    ) => {
        const chatId: number = telegramId ? telegramId : personal ? ctx.from!.id : ctx.chat!.id;
        const options: Type.ExtraReplyMessage = {
            parse_mode: 'HTML',
            ...keyboard,
            disable_web_page_preview: true,
        };

        if (!disablePreview) delete options.disable_web_page_preview;

        try {
            const { message_id: msgId }: Type.MessageId = await bot.telegram.sendMessage(chatId, msg, options);
            return msgId;
        } catch (error: any) {
            throw {
                type: 'TELEGRAM_ERROR',
                message: `Something went wrong while sending a new message.\
                          \n\
                          \n   <b>ERROR:</b> ${error.message}`,
            };
        }
    };

    export const sendKeyboard: Type.SendKeyboardFn = async (ctx, msg, keyboard, disablePreview = true, personal = true) => {
        const chatId: number = personal ? ctx.from!.id : ctx.chat!.id;
        const options: Type.ExtraReplyMessage = { parse_mode: 'HTML', ...keyboard, disable_web_page_preview: true };

        if (!disablePreview) delete options.disable_web_page_preview;

        try {
            const { message_id: msgId }: Type.MessageId = await bot.telegram.sendMessage(chatId, msg, options);
            return msgId;
        } catch (error: any) {
            throw {
                type: 'TELEGRAM_ERROR',
                message: `Something went wrong while sending a new message.\
                          \n\
                          \n   <b>ERROR:</b> ${error.message}`,
            };
        }
    };

    export const editMsg: Type.EditMsgFn = async (ctx, msg, disablePreview = true) => {
        const options: Type.ExtraEditMessageText = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        };

        if (!disablePreview) delete options.disable_web_page_preview;

        try {
            await ctx.editMessageText(msg, options);
        } catch (error: any) {
            throw {
                type: 'TELEGRAM_ERROR',
                message: `Something went wrong while editing your message.\
                          \n\
                          \n   <b>ERROR:</b> ${error.message}`,
            };
        }
    };

    export const editMsgDeleteMsg: Type.EditMsgDeleteMsgFn = async (ctx, msg, time) => {
        try {
            await editMsg(ctx, msg);
            await deleteMsg(ctx, 0, time);
        } catch (error: any) {
            throw error;
        }
    };

    export const editInLineKeyboard: Type.EditInLineKeyboardFn = async (ctx, msg, keyboard, disablePreview = true) => {
        const options: Type.ExtraEditMessageText = {
            parse_mode: 'HTML',
            ...keyboard,
            disable_web_page_preview: true,
        };

        if (!disablePreview) delete options.disable_web_page_preview;

        try {
            await ctx.editMessageText(msg, options);
        } catch (error: any) {
            throw {
                type: 'TELEGRAM_ERROR',
                message: `Something went wrong while editing your message.\
                          \n\
                          \n   <b>ERROR:</b> ${error.message}`,
            };
        }
    };

    export const deleteMsg: Type.DeleteMsgFn = async (ctx, msgId, time = TELEGRAM_CLEAR_CHAT_MSG) => {
        // @ts-ignore
        if (!msgId) msgId = ctx.message ? ctx.message.message_id : ctx.update.callback_query.message.message_id;

        if (+time === 0) {
            await ctx.deleteMessage(+msgId!);
        } else {
            setTimeout(
                async () => {
                    try {
                        await ctx.deleteMessage(+msgId!);
                    } catch (error: any) {
                        const msg: string = `Something went wrong while deleting your message.\
                                             \n\
                                             \n   <b>ERROR:</b> ${error.message}`;
                        await sendMsgDeleteMsg(ctx, msg);
                    }
                },
                time * 1000,
                bot,
                msgId
            );
        }
    };
  ```

- In `src/controllers/telegram/helpers/functions/user.ts`

  ```TypeScript
    import * as Type from '@cTypes';
    import User from '@models/user';
    import temp from '@temp';
    import * as TH from '@tHelpers';

    export const getUser: Type.GetUserFn = async (ctx) => {
        const telegramId: string = ctx!.from!.id.toString();
        let message: string = '';

        try {
            const user: Type.UserI = await User.findOne({ telegramId });

            if (user) {
                if (!user.isTelegramVerified) {
                    message = `Hello <b>${ctx!.from!.first_name} ${ctx!.from!.last_name}</b>!\
                               \n\
                               \n   Your account hasn't been verified yet.\
                               \n   Please send /verify to activate your telegram.`;
                    throw { type: 'USER_NOT_VERIFIED', message };
                }
                return user;
            } else {
                message = 'User not found.';
                throw { type: 'USER_NOT_REGISTERED', message };
            }
        } catch (error: any) {
            if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
            throw {
                type: 'TELEGRAM_ERROR',
                message: `Something went wrong while finding your telegram id.\
                          \n\
                          \n   <b>ERROR:</b> ${error.message}`,
            };
        }
    };

    export const getTemp: Type.GetTempFn = async (ctx, tempKey) => {
        if (!temp[tempKey]) {
            await TH.deleteMsg(ctx, 0, 0);
            throw {
                type: 'SERVER_REBOOTED',
                message: 'Sorry! Server has been rebooted.\nPlease try again.',
            };
        } else {
            return await new Promise((resolve, _) => {
                resolve(temp[tempKey]);
            });
        }
    };
  ```

- In `src/controllers/telegram/helpers/helpers.ts`

  ```TypeScript
    export * from './functions/msg';
    export * from './functions/user';
  ```

## Middlewares

### Authorization

[Go Back to Contents](#contents)

In `src/middlewares/auth.ts`

- `auth`, responsible for authorizing incoming requests

  - Checks if token exists
  - `jwt.verify()` checks if token is still valid. `jwt.verify()` will deco/validate the token using the secret key.

    ```JavaScript
      {
        _id: '5f83d0c881912ae1ac70e2dd',
        firstName: 'Roger',
        lastName: 'Takeshita',
        admin: false,
        iat: 1602475638,
        exp: 1603080438
      }
    ```

  - After that we add an user to the **request** and assign the decoded token
  - then we call the **next function**

- `createAccessToken`
  - `jwt.sign()`, creates and encode a new jwt token with `_id`, `firstName`, and `lastName` valid for **7 days** (in this case)
- `createVerificationToken`

  - Responsible for creating custom tokens used to generate email token.
    - We could use **crypto** (builtin JS library), but with that we couldn't check if the toke is expired.
      - `crypto.randomBytes(64).toString('hex');`

```TypeScript
  import * as Type from '@cTypes';
  import { RequestHandler } from 'express';
  import jwt from 'jsonwebtoken';

  const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY!;
  const JWT_SECRET_EXPIRES_IN: number = +process.env.JWT_SECRET_EXPIRES_IN!;
  const JWT_DEVICE_SECRET_KEY: string = process.env.JWT_DEVICE_SECRET_KEY!;

  const auth: RequestHandler = (req, res, next) => {
      let token: string = req.get('Authorization') || req.query.token || req.body.token;

      try {
          if (token) {
              token = token.replace('Bearer ', '');
              req.user = <Type.UserJwtI>jwt.verify(token, JWT_SECRET_KEY);
              next();
          } else {
              res.status(401).json({ message: 'Token not found.' });
          }
      } catch (error: any) {
          return res.status(401).json({ message: 'Not authorized, invalid token.' });
      }
  };

  const authDevice: RequestHandler = (req, res, next) => {
      let token: string = req.get('Authorization') || req.query.token || req.body.token;

      try {
          if (token) {
              token = token.replace('Bearer ', '');
              req.device = <Type.DeviceJwtI>jwt.verify(token, JWT_DEVICE_SECRET_KEY);
              next();
          } else {
              res.status(401).json({ message: 'Token not found.' });
          }
      } catch (error: any) {
          return res.status(401).json({ message: 'Not authorized, invalid token.' });
      }
  };

  const createAccessToken: Type.JwtAccessFn = (user) => {
      return jwt.sign(
          { _id: user!._id, firstName: user!.firstName, lastName: user!.lastName, admin: user!.admin },
          JWT_SECRET_KEY,
          { expiresIn: `${JWT_SECRET_EXPIRES_IN}d` }
      );
  };

  const createCustomToken: Type.JwtVerifyFn = (mode, attrs = {}, secretKey, expiresIn) => {
      attrs['mode'] = mode;
      if (expiresIn > 0) return jwt.sign(attrs, secretKey, { expiresIn: `${expiresIn}d` });
      return jwt.sign(attrs, secretKey);
  };

  export { auth, authDevice, createAccessToken, createCustomToken };
```

## Models

### Api

[Go Back to Contents](#table-of-contents)

In `src/models/api.ts`

```TypeScript
  import * as Type from '@cTypes';
  import CryptoJS from 'crypto-js';
  import mongoose from 'mongoose';

  const Schema = mongoose.Schema;
  const SECRET_KEY_BASE: string = process.env.SECRET_KEY_BASE!;

  const apiSchema = new Schema<Type.ApiI>(
      {
          name: {
              type: String,
              required: true,
              lowercase: true,
              trim: true,
          },
          url: {
              type: String,
              required: true,
              trim: true,
          },
          key: {
              type: String,
              required: true,
              trim: true,
          },
          value: {
              type: String,
              required: true,
              trim: true,
          },
          description: {
              type: String,
              trim: true,
          },
          active: {
              type: Boolean,
              default: false,
          },
          userId: {
              type: Schema.Types.ObjectId,
              ref: 'User',
              required: true,
          },
      },
      {
          timestamps: true,
      }
  );

  apiSchema.pre<Type.ApiI>('save', function (next) {
      const api = this;

      if (api!.isModified('key')) api!.key = CryptoJS.AES.encrypt(this!.get('key'), SECRET_KEY_BASE).toString();
      if (api!.isModified('value')) api!.value = CryptoJS.AES.encrypt(this!.get('value'), SECRET_KEY_BASE).toString();
      next();
  });

  apiSchema.methods.getKey = function (callback) {
      const key = CryptoJS.AES.decrypt(this.get('key'), SECRET_KEY_BASE).toString(CryptoJS.enc.Utf8);
      const value = CryptoJS.AES.decrypt(this.get('value'), SECRET_KEY_BASE).toString(CryptoJS.enc.Utf8);

      callback(key, value);
  };

  apiSchema.set('toJSON', {
      transform: function (_: any, ret: Type.ApiI) {
          delete ret!.userId;
          delete ret!.createdAt;
          delete ret!.updatedAt;
          delete ret!.__v;
          return ret;
      },
  });

  export default mongoose.model<Type.ApiI>('Api', apiSchema);
```

### Device

[Go Back to Contents](#table-of-contents)

In `src/models/device.ts`

```TypeScript
  import * as Type from '@cTypes';
  import mongoose from 'mongoose';

  const Schema = mongoose.Schema;

  const deviceSchema = new Schema<Type.DeviceI>(
      {
          name: {
              type: String,
              required: true,
              lowercase: true,
              trim: true,
          },
          token: {
              type: String,
              default: '',
              trim: true,
          },
          expiresIn: {
              type: Number,
              min: 0,
              default: 0,
          },
          description: {
              type: String,
              trim: true,
          },
          active: {
              type: Boolean,
              default: false,
          },
          notify: {
              type: Boolean,
              default: false,
          },
          userId: {
              type: Schema.Types.ObjectId,
              ref: 'User',
              required: true,
          },
      },
      {
          timestamps: true,
      }
  );

  deviceSchema.set('toJSON', {
      transform: function (_: any, ret: Type.DeviceI) {
          delete ret!.userId;
          delete ret!.createdAt;
          delete ret!.updatedAt;
          delete ret!.__v;
          return ret;
      },
  });

  export default mongoose.model<Type.DeviceI>('Device', deviceSchema);
```

### User

[Go Back to Contents](#contents)

In `src/models/user.ts`

```TypeScript
  import * as Type from '@cTypes';
  import bcrypt from 'bcrypt';
  import mongoose from 'mongoose';

  const Schema = mongoose.Schema;
  const SALT_ROUNDS: number = 6;

  const userSchema = new Schema<Type.UserI>(
      {
          firstName: {
              type: String,
              required: true,
              trim: true,
          },
          lastName: {
              type: String,
              required: true,
              trim: true,
          },
          email: {
              type: String,
              lowercase: true,
              required: true,
              unique: true,
              trim: true,
          },
          tempEmail: {
              type: String,
              lowercase: true,
              trim: true,
          },
          verifyToken: String,
          password: {
              type: String,
              minlength: process.env.PASSWORD_LEN,
              require: true,
              trim: true,
          },
          status: {
              type: String,
              enum: ['incomplete', 'suspended', 'activated'],
              default: 'incomplete',
              required: true,
          },
          admin: {
              type: Boolean,
              default: false,
          },
          telegramId: {
              type: String,
              trim: true,
              default: '',
          },
          isTelegramVerified: {
              type: Boolean,
              default: false,
          },
          loginCount: {
              type: Number,
              default: 0,
          },
          waitCount: {
              type: Number,
              default: 0,
          },
      },
      {
          timestamps: true,
      }
  );

  userSchema.pre<Type.UserI>('save', async function (next) {
      const user = this;

      if (user!.isModified('password')) user!.password = await bcrypt.hash(this!.get('password'), SALT_ROUNDS);
      next();
  });

  userSchema.methods.comparePassword = function (tryPassword, callback) {
      bcrypt.compare(tryPassword, this.get('password'), callback);
  };

  userSchema.set('toJSON', {
      transform: function (_: any, ret: Type.UserI) {
          delete ret!.password;
          delete ret!.verifyToken;
          delete ret!.status;
          delete ret!.loginCount;
          delete ret!.waitCount;
          delete ret!.createdAt;
          delete ret!.updatedAt;
          delete ret!.__v;
          return ret;
      },
  });

  export default mongoose.model<Type.UserI>('User', userSchema);
```

#### Pre Save

[Go Back to Contents](#contents)

- Called every time we save a document

  - Checks if the password changed
    - If changed, then it will use `bcrypt.hash()` to hash the password
    - `SALT_ROUNDS`, is used to **encrypt** the password.

  ```TypeScript
    userSchema.pre<Type.UserI>('save', async function (next) {
        const user = this;

        if (user!.isModified('password')) user!.password = await bcrypt.hash(this!.get('password'), SALT_ROUNDS);
        next();
    });
  ```

#### Compare Password

[Go Back to Contents](#contents)

- Added a custom **method** to `comparePassword` (`comparePassword` could be any name)

  - Using the `compare()` method from **bcrypt** to compare passwords
    - The first argument is the password that we want to check
    - The second argument is the hashed password from the database
    - The third argument is the callback function, called after comparing th password
      - The callback function has an **error** and **isMatch** arguments
      - We use them to check the password is valid

  ```TypeScript
    userSchema.methods.comparePassword = function (tryPassword, callback) {
        bcrypt.compare(tryPassword, this.get('password'), callback);
    };
  ```

#### Remove Fields

[Go Back to Contents](#contents)

- We use the following structure to remove fields from mongoose queries.

  ```TypeScript
    userSchema.set('toJSON', {
        transform: function(doc, ret) {
            delete ret.field1;
            delete ret.field2;
            return ret;
        }
    })
  ```

  ```TypeScript
    userSchema.set('toJSON', {
        transform: function (_: any, ret: Type.UserI) {
            delete ret!.password;
            delete ret!.verifyToken;
            delete ret!.status;
            delete ret!.loginCount;
            delete ret!.waitCount;
            delete ret!.createdAt;
            delete ret!.updatedAt;
            delete ret!.__v;
            return ret;
        },
    });
  ```

## Routes

In `src/routes/routes.ts`

```TypeScript
  import { Router } from 'express';
  import apiRoutes from './api/api';
  import deviceRoutes from './api/device';
  import iotDeviceRoutes from './api/iot-device';
  import userRoutes from './api/user';

  const router: Router = Router();

  router.use('/api', apiRoutes);
  router.use('/device', deviceRoutes);
  router.use('/iot-device', iotDeviceRoutes);
  router.use('/user', userRoutes);

  export default router;
```

### Api

[Go Back to Contents](#table-of-contents)

In `src/routes/api/api.ts`

```TypeScript
  import * as apiCtrl from '@api';
  import { auth } from '@auth';
  import { Router } from 'express';

  const router: Router = Router();

  router.post('/new', auth, apiCtrl.newApi);
  router.put('/:id', auth, apiCtrl.updateApi);
  router.get('/:id', auth, apiCtrl.getApi);
  router.delete('/:id', auth, apiCtrl.deleteApi);
  router.post('/', auth, apiCtrl.getApis);

  export default router;
```

### Device

[Go Back to Contents](#table-of-contents)

In `src/routes/api/device.ts`

```TypeScript
  import { auth } from '@auth';
  import * as deviceCtrl from '@device';
  import { Router } from 'express';

  const router: Router = Router();

  router.post('/new', auth, deviceCtrl.newDevice);
  router.put('/:id', auth, deviceCtrl.updateDevice);
  router.get('/:id', auth, deviceCtrl.getDevice);
  router.delete('/:id', auth, deviceCtrl.deleteDevice);
  router.post('/', auth, deviceCtrl.getDevices);

  export default router;
```

### IoT

[Go Back to Contents](#table-of-contents)

In `src/routes/api/iot-device.ts`

```TypeScript
  import { authDevice } from '@auth';
  import * as iotDeviceCtrl from '@iot-device';
  import { Router } from 'express';

  const router: Router = Router();

  router.post('/arduino', authDevice, iotDeviceCtrl.notify);

  export default router;
```

### User

[Go Back to Contents](#contents)

In `src/routes/users.ts`

- Using `Router` from **express** to create different routes `GET`, `POST`, `PUT`, and `DELETE`
- We have two types of routes: **publics** and **privates**

  - **Private** routes use the `auth` middleware to check if user is authenticated

```TypeScript
  import { auth } from '@auth';
  import * as userCtrl from '@user';
  import { Router } from 'express';

  const router: Router = Router();

  router.post('/signup', userCtrl.signUpUser);
  router.post('/login', userCtrl.loginUser);
  router.post('/email', userCtrl.resendEmailVerification);
  router.get('/email/:verifyToken', userCtrl.verifyEmail);
  router.post('/password', userCtrl.resetPassword);
  router.put('/password/:verifyToken', userCtrl.updatePassword);

  router.get('/profile', auth, userCtrl.getUser);
  router.put('/profile', auth, userCtrl.updateUser);
  router.delete('/profile', auth, userCtrl.deleteUser);

  export default router;
```

## Utilities

### Types

In `src/utils/@types/types.ts`

```TypeScript
  export * from './functions/email';
  export * from './functions/mongo';
  export * from './functions/request';
  export * from './functions/shared';
  export * from './functions/telegram';
  export * from './functions/user';
  export * from './functions/validator';
  export * from './types/api';
  export * from './types/device';
  export * from './types/email';
  export * from './types/iot-device';
  export * from './types/request';
  export * from './types/shared';
  export * from './types/telegram';
  export * from './types/user';
```

#### Functions

[Go Back to Contents](#table-of-contents)

- In `src/utils/@types/functions/email.ts`

  ```TypeScript
    import { EmailMsg } from '@cTypes';

    export type EmailFn<U, H> = {
        (user: U, host?: H): EmailMsg;
    };
  ```

- In `src/utils/@types/functions/mongo.ts`

  ```TypeScript
    import { Obj } from '@cTypes';
    import mongoose from 'mongoose';

    export type UpdateDocumentFn = {
        (document: Obj, body: Obj, permit: string[]): void;
    };

    export type ObjectIdFn = {
        (id: string): mongoose.Types.ObjectId;
    };
  ```

- In `src/utils/@types/functions/request.ts`

  ```TypeScript
    import { Obj, UserI } from '@cTypes';

    export type JwtAccessFn = {
        (user: UserI): string;
    };

    export type JwtVerifyFn = {
        (mode: string, attrs: Obj, secretKey: string, expiresIn: number): string;
    };
  ```

- In `src/utils/@types/functions/shared.ts`

  ```TypeScript
    export type TitleCaseFn = {
        (txt: string): string;
    };
  ```

- In `src/utils/@types/functions/telegram.ts`

  ```TypeScript
    import { Obj, UserI } from '@cTypes';
    import { Context } from 'telegraf';
    import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
    import { Markup } from 'telegraf/typings/markup';

    export type GetUserFn = {
        (ctx: Context): Promise<UserI>;
    };

    export type DeleteMsgGetUserFn = {
        (ctx: Context): Promise<UserI>;
    };

    export type SendMsgFn = {
        (ctx: Context, msg: string, disablePreview?: boolean, personal?: boolean): Promise<number>;
    };

    export type SendMsgDeleteMsgFn = {
        (ctx: Context, msg: string, time?: number): Promise<void>;
    };

    export type SendInLineKeyboardFn = {
        (
            ctx: Context,
            msg: string,
            keyboard: Markup<InlineKeyboardMarkup>,
            telegramId?: number,
            disablePreview?: boolean,
            personal?: boolean
        ): Promise<number>;
    };

    export type SendKeyboardFn = {
        (
            ctx: Context,
            msg: string,
            keyboard: Markup<ReplyKeyboardMarkup>,
            disablePreview?: boolean,
            personal?: boolean
        ): Promise<number>;
    };

    export type EditMsgFn = {
        (ctx: Context, msg: string, disablePreview?: boolean): Promise<void>;
    };

    export type EditMsgDeleteMsgFn = {
        (ctx: Context, msg: string, time?: number): void;
    };

    export type EditInLineKeyboardFn = {
        (ctx: Context, msg: string, keyboard: Markup<InlineKeyboardMarkup>, disablePreview?: boolean): Promise<void>;
    };

    export type DeleteMsgFn = {
        (ctx: Context, msgId?: number, time?: number): Promise<void>;
    };

    export type GetTempFn = {
        (ctx: Context, tempKey: string): Promise<Obj>;
    };
  ```

- In `src/utils/@types/functions/user.ts`

  ```TypeScript
    import { UserI } from '@cTypes';
    import { Response } from 'express';

    export type AddTryFn = {
        (user: UserI, res: Response): void;
    };

    export type CheckTimeElapsedFn = {
        (user: UserI, res: Response): Promise<boolean>;
    };
  ```

- In `src/utils/@types/functions/validator.ts`

  ```TypeScript
    import { Obj } from '@cTypes';

    export type CheckFn<T> = {
        (value: T): boolean;
    };

    export type CheckPropertyFn = {
        (propertyName: string, data: Obj, length?: number | undefined): boolean;
    };

    export type ValidatorFn<T> = {
        (data: T): {
            errors: Obj;
            valid: boolean;
        };
    };
  ```

#### Types

[Go Back to Contents](#table-of-contents)

- In `src/utils/@types/types/api.ts`

  ```TypeScript
    import { Callback } from '@cTypes';
    import { Document } from 'mongoose';

    interface ApiD extends Document {
        _id: string;
        name: string;
        url: string;
        key: string;
        value: string;
        userId?: string;
        active: boolean;
        description: string;
        getKey?(callback: Callback): void;
        createdAt?: string;
        updatedAt?: string;
        __v?: number;
    }

    export type ApiI = ApiD | null;

    export type ApiForm = {
        _id?: string;
        name?: string;
        url?: string;
        key?: string;
        value?: string;
        description?: string;
        active?: boolean;
    };
  ```

- In `src/utils/@types/types/device.ts`

  ```TypeScript
    import { Document } from 'mongoose';

    interface DeviceD extends Document {
        _id: string;
        name: string;
        token: string;
        expiresIn: number;
        description: string;
        active: boolean;
        notify: boolean;
        userId?: string;
        createdAt?: string;
        updatedAt?: string;
        __v?: number;
    }

    export type DeviceI = DeviceD | null;

    export type DeviceForm = {
        _id?: string;
        name?: string;
        token?: string;
        expiresIn?: number;
        description?: string;
        active?: boolean;
        notify?: boolean;
        userId?: string;
    };
  ```

- In `src/utils/@types/types/email.ts`

  ```TypeScript
    export type EmailMsg = {
        from: string;
        to: string;
        subject: string;
        html: string;
    };
  ```

- In `src/utils/@types/types/iot-device.ts`

  ```TypeScript
    import { Obj } from '@cTypes';

    export type IoTDeviceData = {
        data: Obj;
        notify?: boolean;
    };
  ```

- In `src/utils/@types/types/request.ts`

  ```TypeScript
    declare module 'express-serve-static-core' {
        export interface Request {
            user?: UserJwtI;
            device?: DeviceJwtI;
        }
    }

    export type Request = (type: string, url: string, data?: any, reqToken?: string, throwError?: boolean) => Promise<any>;

    export type RequestOptions = {
        method: string;
        mode?: RequestMode;
        headers: {
            'Content-Type': string;
            'Access-Control-Allow-Origin'?: string;
            Authorization?: string;
        };
        body?: string;
    };

    export interface UserJwtI {
        _id: string;
        firstName: string;
        lastName: string;
        admin: boolean;
        iat: number;
        exp: number;
    }

    export interface DeviceJwtI {
        _id: string;
        userId: string;
        iat: number;
        exp?: number;
    }
  ```

- In `src/utils/@types/types/shared.ts`

  ```TypeScript
    export type Callback = (error: string, isMatch: boolean) => void;

    export type Obj = {
        [key: string]: any;
    };
  ```

- In `src/utils/@types/types/telegram.ts`

  ```TypeScript
    import { Types as TelegramType } from 'telegraf';
    import * as TelegramCoreType from 'telegraf/typings/core/types/typegram';
    import { Markup } from 'telegraf/typings/markup';

    export type InLineKeyboard = Markup<TelegramCoreType.InlineKeyboardMarkup>;

    export type InLineKeyboardConfig = {
        columns: number;
        rows: number;
    };

    export type ReplyKeyboard = Markup<TelegramCoreType.ReplyKeyboardMarkup>;

    export type ExtraReplyMessage = TelegramType.ExtraReplyMessage;

    export type ExtraEditMessageText = TelegramType.ExtraEditMessageText;

    export type MessageId = TelegramCoreType.MessageId;

    export type Hideable<B> = B & { hide?: boolean };

    export type InLineMenu = Hideable<TelegramCoreType.InlineKeyboardButton>[];
  ```

- In `src/utils/@types/types/user.ts`

  ```TypeScript
    import { Callback } from '@cTypes';
    import { Document } from 'mongoose';

    interface UserD extends Document {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        tempEmail: string;
        verifyToken?: string;
        password?: string;
        status?: string;
        admin?: boolean;
        telegramId: string;
        isTelegramVerified: boolean;
        comparePassword(password: string, callback: Callback): void;
        loginCount?: number;
        waitCount?: Number;
        createdAt?: string;
        updatedAt?: string;
        __v?: number;
    }

    export type UserI = UserD | null;

    export type UserLoginForm = {
        _id?: string;
        email: string;
        password: string;
    };

    export type UserDeleteForm = {
        password: string;
    };

    export type UserEmailForm = {
        email: string;
    };

    export type UserPasswordForm = {
        password: string;
        confirmPassword?: string;
    };

    export type UserSignUpForm = {
        _id?: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword?: string;
        verifyToken?: string;
    };

    export type UserProfileForm = {
        _id?: string;
        firstName: string;
        lastName: string;
        password: string;
        email: string;
        newPassword: string;
        confirmNewPassword: string;
        telegramId: string;
    };

    export type SignUpUserRes = {
        message: string;
        verifyToken?: string;
    };

    export type LoginUserRes = {
        token: string;
        message: string;
        verifyToken?: string;
    };

  ```

### Helpers

#### Functions

[Go Back to Contents](#table-of-contents)

- In `src/utils/helpers/functions/generate-email.ts`

  - Helper function to create custom messages to send emails using [SendGrid API](https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/#complete-code-block)
  - the **SendGrid** API specifies a template that we need to follow in order to use send an email

    ```JavaScript
      const msg = {
        to: 'test@example.com', // Change to your recipient
        from: 'test@example.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
    ```

  ```TypeScript
    import * as Type from '@cTypes';

    const URL_FRONTEND: string = process.env.URL_FRONTEND!;

    export const userSignUp: Type.EmailFn<Type.UserI, string> = (user, host) => {
        return {
            from: process.env.SENDGRID_EMAIL!,
            to: user!.email,
            subject: 'Verify your email',
            html: `
                    <h1>Hello ${user!.firstName}</h1>
                    <p>Thanks for registering on our website.</p>
                    <a href="http://${host}/api/user/email/${user!.verifyToken}">Click here to verify your account</a>
                `,
        };
    };

    export const updateUserEmail: Type.EmailFn<Type.UserI, string> = (user, host) => {
        return {
            from: process.env.SENDGRID_EMAIL!,
            to: user!.tempEmail,
            subject: 'Verify your email',
            html: `
                    <h1>Hello ${user!.firstName}</h1>
                    <a href="http://${host}/api/user/email/${user!.verifyToken}">Click here to confirm your new email</a>
                `,
        };
    };

    export const resetUserPassword: Type.EmailFn<Type.UserI, null> = (user) => {
        return {
            from: process.env.SENDGRID_EMAIL!,
            to: user!.email,
            subject: 'Reset password',
            html: `
                    <h1>Hello ${user!.firstName}</h1>
                    We're sending you this email because you requested a password reset. Click on this link to create a new password:
                    <a href="${URL_FRONTEND}/reset-password/${user!.verifyToken}">Set a new password</a>
                    If you didn't request a password reset, you can ignore this email. Your password will not be changed.
                `,
        };
    };

    export const updateUserPassword: Type.EmailFn<Type.UserI, null> = (user) => {
        return {
            from: process.env.SENDGRID_EMAIL!,
            to: user!.email,
            subject: 'Update password',
            html: `
                    <h1>Hello ${user!.firstName}</h1>
                    Your password has been updated. Please login using your new credentials.
                `,
        };
    };
  ```

- In `src/utils/helpers/functions/mongo.ts`

  ```TypeScript
    import * as Type from '@cTypes';
    import mongoose from 'mongoose';

    export const updateDocument: Type.UpdateDocumentFn = (document, body, permittedFields) => {
        permittedFields.forEach((key) => {
            if (body.hasOwnProperty(key)) document[key] = body[key];
        });
    };

    export const objectId: Type.ObjectIdFn = (id) => {
        return mongoose.Types.ObjectId(id);
    };
  ```

- In `src/utils/helpers/functions/request.ts`

  ```TypeScript
    import * as Type from '@cTypes';
    import fetch from 'node-fetch';

    export const request: Type.Request = async (type, url, attrs, reqToken, throwError) => {
        const option: Type.RequestOptions = {
            method: type,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (reqToken) option.headers.Authorization = `Bearer ${reqToken}`;
        if (attrs && type !== 'GET') option.body = JSON.stringify(attrs);

        return fetch(url, option).then(async (res: any) => {
            const data = await res.json();

            if (throwError) {
                if (res.ok) return data;
                throw new Error(data.error);
            }

            if (res.ok) return { data, error: null };
            return { data: null, error: data.error };
        });
    };
  ```

- In `src/utils/helpers/functions/shared.ts`

  ```TypeScript
    import * as Type from '@cTypes';

    export const titleCase: Type.TitleCaseFn = (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    };
  ```

- In `src/utils/helpers/functions.ts`

  ```TypeScript
    export * from './functions/generate-email';
    export * from './functions/mongo';
    export * from './functions/request';
    export * from './functions/shared';
  ```

#### Validator

[Go Back to Contents](#contents)

- In `src/utils/helpers/validators/api.ts`

  ```TypeScript
    import * as Type from '@cTypes';
    import { checkProperty } from './shared';

    export const apiForm: Type.ValidatorFn<Type.ApiForm> = (data) => {
        const errors: Type.Obj = {};

        if (!checkProperty('name', data)) errors.name = 'API name must not be empty.';
        if (!checkProperty('url', data)) errors.url = 'API URL must not be empty.';
        if (!checkProperty('key', data)) errors.key = 'API key must not be empty.';
        if (!checkProperty('value', data)) errors.value = 'API value must not be empty.';
        if (!checkProperty('active', data)) errors.active = 'API status must not be empty.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };
  ```

- In `src/utils/helpers/validators/device.ts`

  ```TypeScript
    import * as Type from '@cTypes';
    import { checkProperty } from './shared';

    export const deviceForm: Type.ValidatorFn<Type.DeviceForm> = (data) => {
        const { expiresIn } = data;
        const errors: Type.Obj = {};

        if (!checkProperty('name', data)) errors.name = 'Device name must not be empty.';
        if (!checkProperty('active', data)) errors.active = 'Device status must not be empty.';
        if (data.hasOwnProperty('expiresIn') && isNaN(+expiresIn!))
            errors.expiresIn = 'Device expiration must be an integer.';
        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };
  ```

- In `src/utils/helpers/validators/shared.ts`

  ```TypeScript
    import * as Type from '@cTypes';

    export const isEmpty: Type.CheckFn<string | undefined> = (value) => {
        if (value === undefined || (value.length === 0 && value.trim() === '')) return true;
        return false;
    };

    export const isEmail: Type.CheckFn<string> = (value) => {
        const emailRegEx =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value && value.match(emailRegEx)) return true;
        return false;
    };

    export const checkProperty: Type.CheckPropertyFn = (propertyName, data, length) => {
        if (!data.hasOwnProperty(propertyName)) return false;
        if (isEmpty(data[propertyName])) return false;
        if (length && data[propertyName].length < length) return false;
        return true;
    };
  ```

- In `src/utils/helpers/validators/user.ts`

  ```TypeScript
    import * as Type from '@cTypes';
    import { checkProperty, isEmail } from './shared';

    const PASSWORD_LENGTH: number = +process.env.PASSWORD_LEN!;

    export const userSignUpForm: Type.ValidatorFn<Type.UserSignUpForm> = (data) => {
        const { email, password, confirmPassword } = data;
        const errors: Type.Obj = {};

        if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
        else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';
        if (!checkProperty('firstName', data)) errors.firstName = 'First name must not be empty.';
        if (!checkProperty('lastName', data)) errors.lastName = 'Last name must not be empty.';
        if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';
        if (!checkProperty('confirmPassword', data)) errors.confirmPassword = 'Confirm password must not be empty.';
        if (!checkProperty('password', data, PASSWORD_LENGTH))
            errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
        if (!checkProperty('confirmPassword', data, PASSWORD_LENGTH))
            errors.confirmPasswordLength = `Confirm password must be greater than ${PASSWORD_LENGTH} characters.`;
        if (
            checkProperty('password', data, PASSWORD_LENGTH) &&
            checkProperty('confirmPassword', data, PASSWORD_LENGTH) &&
            password !== confirmPassword
        )
            errors.passwords = 'Passwords must be equal.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    export const userLoginForm: Type.ValidatorFn<Type.UserLoginForm> = (data) => {
        const { email } = data;
        const errors: Type.Obj = {};

        if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
        else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';
        if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    export const userProfileForm: Type.ValidatorFn<Type.UserProfileForm> = (data) => {
        const { email, newPassword, confirmNewPassword } = data;
        const errors: Type.Obj = {};
        let count = 0;

        if (!checkProperty('email', data)) errors.email = 'New email must not be empty.';
        else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'New email must be a valid email address.';
        if (data.hasOwnProperty('firstName') && !checkProperty('firstName', data))
            errors.firstName = 'First name must not be empty.';
        if (data.hasOwnProperty('lastName') && !checkProperty('lastName', data))
            errors.lastName = 'Last name must not be empty.';
        if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';
        if (!checkProperty('password', data, PASSWORD_LENGTH))
            errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
        if (confirmNewPassword && !checkProperty('newPassword', data))
            errors.newPassword = 'New password must not be empty.';
        if (confirmNewPassword && !checkProperty('newPassword', data, PASSWORD_LENGTH))
            errors.newPasswordLength = `New password must be greater than ${PASSWORD_LENGTH} characters.`;
        if (newPassword && !checkProperty('confirmNewPassword', data))
            errors.confirmNewPassword = 'Confirm new password must not be empty.';
        if (newPassword && !checkProperty('confirmNewPassword', data, PASSWORD_LENGTH))
            errors.confirmNewPasswordLength = `Confirm new password must be greater than ${PASSWORD_LENGTH} characters.`;
        if (
            data.hasOwnProperty('newPassword') &&
            checkProperty('newPassword', data, PASSWORD_LENGTH) &&
            data.hasOwnProperty('confirmNewPassword') &&
            checkProperty('confirmNewPassword', data, PASSWORD_LENGTH) &&
            newPassword !== confirmNewPassword
        )
            errors.passwords = 'New passwords must be equal.';

        Object.keys(data).forEach(() => count++);

        if (count === 1) errors.unchanged = 'Must modify something.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    export const userPasswordForm: Type.ValidatorFn<Type.UserPasswordForm> = (data) => {
        const { password, confirmPassword } = data;
        const errors: Type.Obj = {};

        if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';
        if (!checkProperty('password', data, PASSWORD_LENGTH))
            errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
        if (data.hasOwnProperty('confirmPassword') && !checkProperty('confirmPassword', data))
            errors.confirmPassword = 'Confirm password must not be empty.';
        if (data.hasOwnProperty('confirmPassword') && !checkProperty('confirmPassword', data, PASSWORD_LENGTH))
            errors.confirmPasswordLength = `Confirm password must be greater than ${PASSWORD_LENGTH} characters.`;
        if (checkProperty('password', data) && checkProperty('confirmPassword', data) && password !== confirmPassword)
            errors.passwords = 'Passwords must be equal.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    export const userEmailForm: Type.ValidatorFn<Type.UserEmailForm> = (data) => {
        const { email } = data;
        const errors: Type.Obj = {};

        if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
        else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };
  ```

- In `src/utils/helpers/validators.ts`

  ```TypeScript
    export * from './validators/api';
    export * from './validators/device';
    export * from './validators/shared';
    export * from './validators/user';
  ```

## Server

We split the server into 2 files (`app.ts` and `index.ts`) so we can in the future use **Jest** to automate our API test

### App.ts

[Go Back to Contents](#contents)

In `src/app.ts`

```TypeScript
  import '@config/database';
  import { bot, secretPath } from '@config/telegram';
  import apiRoutes from '@routes';
  import '@telegram';
  import cors from 'cors';
  import express, { Application, Request, Response } from 'express';
  import helmet from 'helmet';
  import logger from 'morgan';

  const app: Application = express();
  app.use(logger('dev'));
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.use('/api', apiRoutes);
  app.use(bot.webhookCallback(secretPath));

  app.get('/*', (_: Request, res: Response) => {
      res.status(404).json({ message: "Path doesn't exist." });
  });

  export default app;
```

### Index.ts

[Go Back to Contents](#contents)

In `src/index.ts`

```TypeScript
  import app from '@app';
  const port: number = +process.env.PORT! || 3001;
  const ENV: string = process.env.ENV!;

  app.listen(port, () => {
      const serverType: string = ENV.charAt(0).toUpperCase() + ENV.substr(1).toLowerCase();
      console.log(`${serverType} server is running on port ${port}`);
  });
```

## Jest - Test

### Init

[Go Back to Contents](#contents)

Initializing Jest

```Bash
  ./node_modules/.bin/jest --init
```

Setting Jest

```Bash
  It seems that you already have a jest configuration, do you want to override it?
  # Y

  Would you like to use Jest when running "test" script in "package.json"?
  # Y

  Choose the test environment that will be used for testing
  # node

  Do you want Jest to add coverage reports?
  # N (we are going to change later to Yes)

  Which provider should be used to instrument code for coverage?
  # babel

  Automatically clear mock calls and instances between every test?
  # Y
```

### Config

[Go Back to Contents](#contents)

By default jest doesn't work with TypeScript, that's why need to install `ts-jest`

the `ts-jest` helps us to test the file without the need to compile the file (transform from `.ts` to `.js`)

In `./jest.config.js`

- We define the **root path** using the `path` module, and set the `rootDir` to `root`
- we need to define `moduleNameMapper` so jest can map the right path since we are using TypeScript alias

  ```JavaScript
    const { resolve } = require('path');
    const root = resolve(__dirname);

    /*
     * For a detailed explanation regarding each configuration property, visit:
     * https://jestjs.io/docs/configuration
     */

    module.exports = {
        displayName: 'TEST',
        clearMocks: true,
        coveragePathIgnorePatterns: ['/node_modules/'],
        moduleNameMapper: {
            '~/(.*)': '<rootDir>/src/$1',
            '@app': '<rootDir>/src/app.ts',
            '@config/(.*)': '<rootDir>/src/config/$1',
            '@controllers/(.*)': '<rootDir>/src/controllers/$1',
            '@telegram': '<rootDir>/src/controllers/telegram/telegram.ts',
            '@tHelpers': '<rootDir>/src/controllers/telegram/helpers/helpers.ts',
            '@api': '<rootDir>/src/controllers/api/v1/api.ts',
            '@device': '<rootDir>/src/controllers/api/v1/device.ts',
            '@iot-device': '<rootDir>/src/controllers/api/v1/iot-device.ts',
            '@user': '<rootDir>/src/controllers/api/v1/user.ts',
            '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
            '@auth': '<rootDir>/src/middlewares/auth.ts',
            '@models/(.*)': '<rootDir>/src/models/$1',
            '@routes': '<rootDir>/src/routes/routes.ts',
            '@temp': '<rootDir>/src/tmp/temp.ts',
            '@utils/(.*)': '<rootDir>/src/utils/$1',
            '@cTypes': '<rootDir>/src/utils/@types/types.ts',
            '@helpers/(.*)': '<rootDir>/src/utils/helpers/$1',
            '@cFunctions': '<rootDir>/src/utils/helpers/functions.ts',
            '@validators': '<rootDir>/src/utils/helpers/validators.ts',
        },
        preset: 'ts-jest',
        rootDir: root,
        testMatch: ['<rootDir>/src/**/*.test.ts'],
    };
  ```

### Database Connects

[Go Back to Contents](#contents)

In `src/tests/database/database.ts`

```TypeScript
  import * as auth from '@auth';
  import Api from '@models/api';
  import Device from '@models/device';
  import User from '@models/user';
  import mongoose from 'mongoose';
  import * as TestType from '../__mocks__/@types/types';

  const JWT_DEVICE_SECRET_KEY: string = process.env.JWT_DEVICE_SECRET_KEY!;

  export const user1: TestType.UserObj = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'User name 1',
      lastName: 'User last name 1',
      email: 'your_email_1@test.com',
      password: 'test123',
      status: 'activated',
      telegramId: '12345a',
      isTelegramVerified: true,
  };

  export const user2: TestType.UserObj = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'User name 2',
      lastName: 'User last name 2',
      email: 'your_email_2@test.com',
      password: 'test123',
      status: 'incomplete',
      telegramId: '12345b',
      isTelegramVerified: false,
  };

  export const user3: TestType.UserObj = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'User name 3',
      lastName: 'User last name 3',
      email: 'your_email_3@test.com',
      password: 'test123',
      status: 'activated',
      telegramId: '12345c',
      isTelegramVerified: true,
  };

  export const user4: TestType.UserObj = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'User name 4',
      lastName: 'User last name 4',
      email: 'your_email_4@test.com',
      password: 'test123',
      status: 'activated',
      telegramId: '12345d',
      isTelegramVerified: true,
  };

  export const user5: TestType.UserObj = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'User name 5',
      lastName: 'User last name 5',
      email: 'your_email_5@test.com',
      password: 'test123',
      status: 'suspended',
      telegramId: '12345e',
      isTelegramVerified: true,
  };

  export const user1api1: TestType.ApiObj = {
      _id: mongoose.Types.ObjectId(),
      name: 'Api 1, User 1',
      key: 'Api key 1, User 1',
      value: 'Api secret value 1, User 1',
      url: 'www.rogertakeshita.com',
      active: true,
      userId: user1._id,
  };

  export const user1api2: TestType.ApiObj = {
      _id: mongoose.Types.ObjectId(),
      name: 'Api 2, User 1',
      key: 'Api key 2, User 1',
      value: 'Api secret value 2, User 1',
      url: 'www.rogertakeshita.com',
      active: false,
      userId: user1._id,
  };

  export const user3api1: TestType.ApiObj = {
      _id: mongoose.Types.ObjectId(),
      name: 'Api 1, User 3',
      key: 'Api key 1, User 3',
      value: 'Api secret value 1, User 3',
      url: 'www.rogertakeshita.com',
      active: true,
      userId: user3._id,
  };

  export const user1device1: TestType.DeviceObj = {
      _id: mongoose.Types.ObjectId(),
      name: 'Device 1, User 1',
      token: auth.createCustomToken('device', {}, JWT_DEVICE_SECRET_KEY, 7),
      expiresIn: 7,
      description: 'Device description 1, User 1',
      active: true,
      userId: user1._id,
  };

  export const user1device2: TestType.DeviceObj = {
      _id: mongoose.Types.ObjectId(),
      name: 'Device 2, User 1',
      token: auth.createCustomToken('device', {}, JWT_DEVICE_SECRET_KEY, 7),
      expiresIn: 7,
      description: 'Device description 2, User 1',
      active: false,
      userId: user1._id,
  };

  export const user3device1: TestType.DeviceObj = {
      _id: mongoose.Types.ObjectId(),
      name: 'Device 1, User 3',
      token: auth.createCustomToken('device', {}, JWT_DEVICE_SECRET_KEY, 7),
      expiresIn: 7,
      description: 'Device description 1, User 3',
      active: true,
      userId: user3._id,
  };

  export const setupDatabase = async () => {
      await User.deleteMany({});
      await new User(user1).save();
      await new User(user2).save();
      await new User(user3).save();
      await new User(user4).save();
      await new User(user5).save();
      await Api.deleteMany({});
      await new Api(user1api1).save();
      await new Api(user1api2).save();
      await new Api(user3api1).save();
      await Device.deleteMany({});
      await new Device(user1device1).save();
      await new Device(user1device2).save();
      await new Device(user3device1).save();
  };

  export const closeDatabase = async () => {
      mongoose.connection.close();
  };
```

### Test Cases

[Go Back to Contents](#contents)

- In `src/tests/user.test.ts`

  ```TypeScript
    import app from '@app';
    import * as Type from '@cTypes';
    import User from '@models/user';
    import jwt from 'jsonwebtoken';
    import request from 'supertest';
    import { closeDatabase, setupDatabase, user1, user2, user3, user5 } from './database/database';
    import { getLoginToken } from './helpers/helpers';
    import * as TestType from './__mocks__/@types/types';

    const USER_URL: string = '/api/user';
    const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY!;
    const JWT_VERIFICATION_SECRET_KEY: string = process.env.JWT_VERIFICATION_SECRET_KEY!;
    const PASSWORD_LEN: number = +process.env.PASSWORD_LEN!;
    const LOGIN_WAIT_TIME: number = +process.env.LOGIN_WAIT_TIME!;
    const LOGIN_MAX_TRY: number = +process.env.LOGIN_MAX_TRY!;

    describe("User's API", () => {
        beforeEach(setupDatabase);
        afterAll(closeDatabase);

        it('Should sign up new user', async () => {
            const form: Type.UserSignUpForm = {
                email: 'your_email_10@test.com',
                firstName: 'Roger 10',
                lastName: 'That 10',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: TestType.ResponseMsg = await request(app).post(`${USER_URL}/signup`).send(form).expect(201);
            const user: Type.UserI = await User.findOne({ email: form.email });
            expect(user).not.toBeNull();
            expect(response.body).toMatchObject({
                message: 'Your account has been created. Please check your email to verify your account.',
            });
        });

        it('Should NOT sign up new user - existing user/email', async () => {
            const form: Type.UserSignUpForm = {
                email: user1.email,
                firstName: 'Roger 10',
                lastName: 'That 10',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: TestType.ResponseMsg = await request(app).post(`${USER_URL}/signup`).send(form).expect(400);
            expect(response.body).toMatchObject({
                message: 'Email already in use.',
            });
        });

        it('Should NOT sign up new user - empty first name', async () => {
            const form: Type.UserSignUpForm = {
                email: 'your_email_10@test.com',
                firstName: '',
                lastName: 'That 10',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: TestType.ResponseMsg = await request(app).post(`${USER_URL}/signup`).send(form).expect(400);
            expect(response.body).toMatchObject({
                firstName: 'First name must not be empty.',
            });
        });

        it('Should NOT sign up new user - empty last name', async () => {
            const form: Type.UserSignUpForm = {
                email: 'your_email_10@test.com',
                firstName: 'Roger 10',
                lastName: '',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: TestType.ResponseMsg = await request(app).post(`${USER_URL}/signup`).send(form).expect(400);
            expect(response.body).toMatchObject({
                lastName: 'Last name must not be empty.',
            });
        });

        ...

    });
  ```

#### \_\_mocks\_\_

[Go Back to Contents](#contents)

##### @SENDGRID

[Go Back to Contents](#contents)

We use `__mocks__` to override the `node_modules/@sendgrind/mail`

To override something, we just need to follow the same structure of the package

In `src/tests/__mocks__/@sendgrid/mails.ts`

- We are going to override the **setApiKey** and **send** methods

  ```TypeScript
    module.exports = {
        setApiKey() {},
        send() {},
    };
  ```

##### @TYPES

[Go Back to Contents](#contents)

We use `__mocks__` to override the `node_modules/@types` and create our custom types specific for testing.

In `src/tests/__mocks__/@types/types.ts`

```TypeScript
  import * as Type from '@cTypes';
  import mongoose from 'mongoose';

  export type UserObj = {
      _id: mongoose.Types.ObjectId;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      status: string;
      telegramId: string;
      isTelegramVerified: boolean;
  };

  export type ApiObj = {
      _id: mongoose.Types.ObjectId;
      name: string;
      key: string;
      value: string;
      url: string;
      active: boolean;
      userId: mongoose.Types.ObjectId;
  };

  export type DeviceObj = {
      _id: mongoose.Types.ObjectId;
      name: string;
      token: string;
      expiresIn: number;
      description: string;
      active: boolean;
      userId: mongoose.Types.ObjectId;
  };

  export type LoginResponse = {
      body: Type.LoginUserRes;
  };

  export type ResponseMsg = {
      body: {
          message: string;
      };
  };

  export type UserProfile = {
      body: {
          firstName: string;
          lastName: string;
          email: string;
      };
  };

  export type GetLoginTokenFn = {
      (user: UserObj): Promise<string>;
  };
```

#### Coverage Test

[Go Back to Contents](#contents)

- To display the coverage test

  - Add `-- --coverage` in the end of the command
  - Run the command `npm run test -- --coverage`

  ![](https://i.imgur.com/lMvph2d.png)

  - **NOTE** still needs more tests to handle the `return res.status(500)` in `src/controllers/users.ts` to reach 100% of coverage.

## Babel

[Go Back to Contents](#contents)

- Using babel to transpile our code into JavaScript

  - Babel is necessary because only TSC can't convert 100% correct. Since we are using alias, tsc can't convert the alias to correct path.
  - To do so, we need babel and its dependencies

### Config

[Go Back to Contents](#contents)

In `babel.config.js`

```JavaScript
  module.exports = {
      presets: [
          [
              '@babel/preset-env',
              {
                  targets: {
                      node: 'current',
                  },
              },
          ],
          '@babel/preset-typescript',
      ],
      plugins: [
          [
              'module-resolver',
              {
                  alias: {
                      '~': './src',
                      '@app': './src',
                      '@config': './src/config',
                      '@controllers': './src/controllers',
                      '@telegram': './src/controllers/telegram',
                      '@tHelpers': './src/controllers/telegram/helpers',
                      '@api': './src/controllers/api/v1',
                      '@device': './src/controllers/api/v1',
                      '@iot-device': './src/controllers/api/v1',
                      '@user': './src/controllers/api/v1',
                      '@middlewares': './src/middlewares',
                      '@auth': './src/middlewares',
                      '@models': './src/models',
                      '@routes': './src/routes',
                      '@temp': './src/tmp',
                      '@utils': './src/utils',
                      '@cTypes': './src/utils/@types',
                      '@helpers': './src/utils/helpers',
                      '@cFunctions': './src/utils/helpers',
                      '@validators': './src/utils/helpers',
                  },
              },
          ],
      ],
      ignore: ['**/*.test.ts', '**/*.spec.ts'],
  };
```

- **presets**
  - `@babel/preset-env` and tells to convert our code to the **current node version**
  - `@babel/preset-typescript` so babel can understand TypeScript
- **plugins**

  - We have our `module-resolver` responsible for change/understand our alias (@controllers, @modules, ...) path. we add them manually again

- in our scripts in `package.json`:
  - we have `"build": "babel src --extensions \".js,.ts\" --out-dir dist --copy-files --no-copy-ignored",`
    - we are using **babel** to transpile, then we tell what folder (`src`)
    - `--extensions \".js,.ts\"`, what files babel should use/convert
    - `--out-dir dist`, output dir -> dist folder
    - `--copy-files`, copy other files like `html`, `css`, `images`...
    - `--no-copy-ignored`, don't copy ignored files
