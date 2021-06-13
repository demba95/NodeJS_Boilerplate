<h1>Last Update - 06/13/2021</h1>

---

<h1 id='contents'>Table of Contents</h1>

- [NODE.JS BOILERPLATE](#nodejs-boilerplate)
  - [Postman](#postman)
  - [Init Node](#init-node)
  - [Create Folder and Files](#create-folder-and-files)
  - [Install Packages](#install-packages)
    - [Init Typescript](#init-typescript)
    - [package.json](#packagejson)
  - [Environment Variables](#environment-variables)
  - [Database Connection](#database-connection)
    - [MongoDB](#mongodb)
      - [Warnings](#warnings)
  - [Controllers](#controllers)
    - [Users Controllers](#users-controllers)
  - [Middlewares](#middlewares)
    - [Authorization](#authorization)
  - [Models](#models)
    - [User's Schema](#users-schema)
      - [Pre Save](#pre-save)
      - [Compare Password](#compare-password)
      - [Remove Fields](#remove-fields)
  - [Routes](#routes)
    - [User's Routes](#users-routes)
  - [Utilities](#utilities)
    - [Types](#types)
    - [Helpers](#helpers)
      - [Message](#message)
      - [Validator](#validator)
  - [Server](#server)
    - [App.ts](#appts)
    - [Index.ts](#indexts)
  - [Jest - Test](#jest---test)
    - [Init](#init)
    - [Config](#config)
    - [Database Connects](#database-connects)
    - [Test Cases](#test-cases)
      - [\_\_mocks\_\_](#__mocks__)
        - [@SENDGRID](#sendgrid)
        - [@TYPES](#types-1)
      - [Coverage Test](#coverage-test)
  - [Babel](#babel)
    - [Config](#config-1)

# NODE.JS BOILERPLATE

## Postman

[Go Back to Contents](#contents)

- [Postman - API Calls](https://github.com/Roger-Takeshita/Node.js_Boilerplate/blob/main/Boilerplate%20-%20Backend.postman_collection.json)

## Init Node

[Go Back to Contents](#contents)

- Create a new node project

  ```Bash
    npm init

    # name: node.js_boilerplate
    # version: (1.0.0)
    # description: Node.js Boilerplate
    # entry point: (index.js)
    # test command:
    # git repository: (your_repos_url)
    # keywords:
    # author: your_name
    # license: (ISC)
  ```

## Create Folder and Files

[Go Back to Contents](#contents)

- Mkdir/Touch Files

  ```Bash
    touch -n env/dev.env
    touch -n env/prod.env
    touch -n env/test.env
    touch -n src/config/database.ts
    touch -n src/controllers/users.ts
    touch -n src/middlewares/auth.ts
    touch -n src/models/user.ts
    touch -n src/routes/users.ts
    touch -n src/tests/**mocks**/@sendgrid/mail.ts
    touch -n src/tests/**mocks**/@types/types.ts
    touch -n src/tests/database/database.ts
    touch -n src/tests/user.test.ts
    touch -n src/utils/@types/types.ts
    touch -n src/utils/helpers/message.ts
    touch -n src/utils/helpers/validator.ts
    touch -n src/app.ts
    touch -n src/index.ts
    touch -n babel.config.js
  ```

- Final Structure

  ```Bash
    .
    ├── env
    │   ├── dev.env
    │   ├── prod.env
    │   └── test.env
    ├── src
    │   ├── config
    │   │   └── database.ts
    │   ├── controllers
    │   │   └── users.ts
    │   ├── middlewares
    │   │   └── auth.ts
    │   ├── models
    │   │   └── user.ts
    │   ├── routes
    │   │   └── users.ts
    │   ├── tests
    │   │   ├── __mocks__
    │   │   │   ├── @sendgrid
    │   │   │   │   └── mail.ts
    │   │   │   └── @types
    │   │   │       └── types.ts
    │   │   ├── database
    │   │   │   └── database.ts
    │   │   └── user.test.ts
    │   ├── utils
    │   │   ├── @types
    │   │   │   └── types.ts
    │   │   └── helpers
    │   │       ├── message.ts
    │   │       └── validator.ts
    │   ├── app.ts
    │   └── index.ts
    ├── babel.config.js
    ├── jest.config.js
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
  ```

## Install Packages

[Go Back to Contents](#contents)

- Install the following dependencies:

  ```Bash
    # npm i @sendgrid/mail bcrypt cors env-cmd express helmet jsonwebtoken mongoose morgan

    npm i @sendgrid/mail
    npm i bcrypt
    npm i cors
    npm i env-cmd
    npm i express
    npm i helmet
    npm i jsonwebtoken
    npm i mongoose
    npm i morgan

    # Dev Dependencies
    # npm i -D @types/bcrypt @types/cors @types/express @types/jsonwebtoken @types/mongoose @types/morgan @types/node @types/validator @types/jest @types/supertest jest ts-jest supertest ts-node-dev tsconfig-paths typescript @babel/cli @babel/core @babel/node @babel/preset-env @babel/preset-typescript babel-plugin-module-resolver

    npm i -D @babel/cli
    npm i -D @babel/core
    npm i -D @babel/node
    npm i -D @babel/preset-env
    npm i -D @babel/preset-typescript
    npm i -D @types/bcrypt
    npm i -D @types/cors
    npm i -D @types/express
    npm i -D @types/jest
    npm i -D @types/jsonwebtoken
    npm i -D @types/mongoose
    npm i -D @types/morgan
    npm i -D @types/node
    npm i -D @types/supertest
    npm i -D babel-plugin-module-resolver
    npm i -D jest
    npm i -D supertest
    npm i -D ts-jest
    npm i -D ts-node-dev
    npm i -D tsconfig-paths
    npm i -D typescript
  ```

### Init Typescript

[Go Back to Contents](#contents)

- Initialize TypesScript, on your root folder

  ```Bash
    tsc --init
  ```

- This command will generate the `tsconfig.json`

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
            "baseUrl": "./src",
            "paths": {
                "~/*": ["./*"],
                "@config/*": ["./config/*"],
                "@controllers/*": ["./controllers/*"],
                "@middlewares/*": ["./middlewares/*"],
                "@models/*": ["./models/*"],
                "@routes/*": ["./routes/*"],
                "@utils/*": ["./utils/*"],
                "@cTypes/*": ["./utils/@types/*"],
                "@helpers/*": ["./utils/helpers/*"]
            },
            "typeRoots": ["./node_modules/@types", "./src/utils/@types"],
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

- After we install everything, we just need to config the **scripts** and **jest**

  ```JSON
    "scripts": {
        "start": "node dist/index.js",
        "dev": "env-cmd -f ./env/dev.env ts-node-dev -r tsconfig-paths/register --respawn --transpile-only --ignore-watch node_modules --no-notify src/index.ts",
        "build": "babel src --extensions \".js,.ts\" --out-dir dist --copy-files --no-copy-ignored",
        "test": "env-cmd -f ./env/test.env jest --watch --runInBand --detectOpenHandles"
    },
    "jest": {
        "bail": 1,
        "verbose": true,
        "testEnvironment": "node",
        "moduleFileExtensions": [
            "ts",
            "tsx",
            "js",
            "jsx"
        ]
    },
  ```

  - `ts-node-dev --respawn --transpile-only --ignore-watch node_modules --no-notify src/index.ts` responsible for fast reloading the server using TypeScript, `--no-notify` (for linux users)
  - `-r tsconfig-paths/register` register (`-r`) custom typescript before executing the rest.

- Complete json file

  ```JSON
    {
        "name": "node.js_boilerplate",
        "version": "1.0.0",
        "description": "Node.js Boilerplate",
        "main": "index.js",
        "scripts": {
            "start": "node dist/index.js",
            "dev": "env-cmd -f ./env/dev.env ts-node-dev -r tsconfig-paths/register --respawn --transpile-only --ignore-watch node_modules --no-notify src/index.ts",
            "build": "babel src --extensions \".js,.ts\" --out-dir dist --copy-files --no-copy-ignored",
            "test": "env-cmd -f ./env/test.env jest --watch --runInBand --detectOpenHandles"
        },
        "jest": {
            "bail": 1,
            "verbose": true,
            "testEnvironment": "node",
            "moduleFileExtensions": [
                "ts",
                "tsx",
                "js",
                "jsx"
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
            "@sendgrid/mail": "^7.2.6",
            "bcrypt": "^5.0.0",
            "cors": "^2.8.5",
            "env-cmd": "^10.1.0",
            "express": "^4.17.1",
            "helmet": "^4.1.1",
            "jsonwebtoken": "^8.5.1",
            "mongoose": "^5.10.9",
            "morgan": "^1.10.0"
        },
        "devDependencies": {
            "@babel/cli": "^7.11.6",
            "@babel/core": "^7.11.6",
            "@babel/node": "^7.10.5",
            "@babel/preset-env": "^7.11.5",
            "@babel/preset-typescript": "^7.10.4",
            "@types/bcrypt": "^3.0.0",
            "@types/cors": "^2.8.8",
            "@types/express": "^4.17.8",
            "@types/jsonwebtoken": "^8.5.0",
            "@types/mongoose": "^5.7.36",
            "@types/morgan": "^1.9.1",
            "@types/node": "^14.11.8",
            "babel-plugin-module-resolver": "^4.0.0",
            "jest": "^26.5.3",
            "supertest": "^5.0.0",
            "ts-jest": "^26.4.1",
            "ts-node-dev": "^1.0.0-pre.63",
            "tsconfig-paths": "^3.9.0",
            "typescript": "^4.0.3"
        }
    }
  ```

## Environment Variables

[Go Back to Contents](#contents)

- In `env/dev.env`

  ```Bash
    DATABASE_URL=mongodb://127.0.0.1:27017/BackendDB
    JWT_SECRET_KEY=super_secrete_key_1
    JWT_SECRET_EXPIRES_IN=7d
    JWT_VERIFICATION_SECRET_KEY=super_secret_key_2
    JWT_VERIFICATION_EXPIRES_IN=7d
    SENDGRID_KEY=send_grid_key
    SENDGRID_EMAIL=your_email_address
    PASSWORD_LEN=4
    PORT=3001
  ```

- In `env/test.env`

  ```Bash
    DATABASE_URL=mongodb://127.0.0.1:27017/BackendDB-Test
    JWT_SECRET_KEY=super_secrete_key_1_test
    JWT_SECRET_EXPIRES_IN=7d
    JWT_VERIFICATION_SECRET_KEY=super_secret_key_2_test
    JWT_VERIFICATION_EXPIRES_IN=7d
    SENDGRID_KEY=send_grid_key
    SENDGRID_EMAIL=your_email_address
    PASSWORD_LEN=4
    PORT=3001
  ```

## Database Connection

### MongoDB

[Go Back to Contents](#contents)

- In `src/config/database.ts`

  ```TypeScript
    import mongoose from 'mongoose';
    const db = mongoose.connection;

    mongoose.connect(process.env.DATABASE_URL!, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    db.once('connected', () => {
        console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
    });
  ```

#### Warnings

[Go Back to Contents](#contents)

- To fix all deprecation warnings, follow the below steps:

  - `mongoose.set('useNewUrlParser', true);`
  - `mongoose.set('useFindAndModify', false);`
  - `mongoose.set('useCreateIndex', true);`
  - `mongoose.set('useUnifiedTopology', true);`
  - Replace `update()` with `updateOne()`, `updateMany()`, or `replaceOne()`
  - Replace `remove()` with `deleteOne()` or `deleteMany()`.
  - Replace `count()` with `countDocuments()`, unless you want to count how many documents are in the whole collection (no filter). In the latter case, use `estimatedDocumentCount()`.

- Mongoose connection options:
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

## Controllers

### Users Controllers

[Go Back to Contents](#contents)

- In `src/controllers/users.ts`

  ```TypeScript
    import { RequestHandler } from 'express';
    import User from '@models/user';
    import sgMail from '@sendgrid/mail';
    import jwt from 'jsonwebtoken';
    import * as auth from '@middlewares/auth';
    import * as validator from '@helpers/validator';
    import * as Msg from '@helpers/message';
    import * as Type from '@cTypes/types';

    sgMail.setApiKey(process.env.SENDGRID_KEY!);

    const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY!;

    const signUpUser: RequestHandler = async (req, res) => {
        const form: Type.SignUpForm = req.body;
        const { valid, errors } = validator.validateSignUpData(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: Type.UserI | null = await User.findOne({ email: form.email });
            if (user) return res.status(400).json({ message: 'ERROR: Email already in use.' });

            delete form.confirmPassword;
            form.verifyToken = auth.createVerificationToken('email');
            const newUser: Type.UserI = new User(form);
            await newUser.save();

            const msg = Msg.signUp(newUser, req.headers.host!);
            await sgMail.send(msg);

            res.status(201).json({
                message: 'Your account has been created. Please check your email to verify your account.',
            });
        } catch (error) {
            res.status(500).json({
                message:
                    'ERROR: Something went wrong while trying to sign up. Please try again later or contact our support.',
            });
        }
    };

    const loginUser: RequestHandler = async (req, res) => {
        const form: Type.LoginForm = req.body;

        const { valid, errors } = validator.validateLoginData(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: Type.UserI | null = await User.findOne({ email: form.email });
            if (!user) return res.status(404).json({ message: 'ERROR: Wrong credentials.' });

            user.comparePassword(form.password, (_: any, matchPassword: boolean) => {
                if (matchPassword) {
                    if (user.isEmailVerified) {
                        const token = auth.createAccessToken(user);
                        return res.json(token);
                    }

                    return res.status(403).json({
                        message: 'ERROR: Please verify your email first.',
                    });
                }

                res.status(403).json({ message: 'ERROR: Wrong credentials.' });
            });
        } catch (error) {
            res.status(500).json({
                message:
                    'ERROR: Something went wrong while trying to login. Please try again later or contact our support.',
            });
        }
    };

    const getUser: RequestHandler = async (req, res) => {
        try {
            const user: Type.UserI | null = await User.findOne({
                _id: req.user!._id,
            }).select('-tempEmail');
            if (!user) return res.status(404).json({ message: 'ERROR: Wrong credentials.' });

            res.json(user);
        } catch (error) {
            res.status(500).json({
                message:
                    'ERROR: Something went wrong while trying to get profile. Please try again later or contact our support.',
            });
        }
    };

    const updateUser: RequestHandler = async (req, res) => {
        const form: Type.UpdateUserForm = req.body;
        const { valid, errors } = validator.validateUpdateData(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: Type.UserI | null = await User.findOne({
                _id: req.user!._id,
            });
            if (!user) return res.status(404).json({ message: 'ERROR: Wrong credentials.' });

            if (form.newEmail) {
                const email: Type.UserI | null = await User.findOne({
                    email: form.newEmail,
                });
                if (email)
                    return res.status(400).json({
                        message: `ERROR: Email (${form.newEmail}) is already in use.`,
                    });
            }

            user.comparePassword(form.password, async (_: any, matchPassword: boolean) => {
                if (matchPassword) {
                    if (form.firstName) user.firstName = form.firstName;
                    if (form.lastName) user.lastName = form.lastName;
                    if (form.newPassword) user.password = form.newPassword;
                    if (form.newEmail) {
                        user.tempEmail = form.newEmail;

                        user.verifyToken = auth.createVerificationToken('email');
                        await user.save();

                        try {
                            const msg = Msg.updateEmail(user, req.headers.host!);
                            await sgMail.send(msg);
                        } catch (error) {
                            res.status(500).json({
                                message:
                                    'ERROR: Something went wrong sending you the email verification. Please try again later.',
                            });
                        }
                    } else {
                        await user.save();
                    }

                    return res.json(user);
                }

                res.status(403).json({ message: 'ERROR: Wrong credentials.' });
            });
        } catch (error) {
            res.status(500).json({
                message: 'ERROR: Something went wrong while updating. Please try again later or contact our support.',
            });
        }
    };

    const deleteUser: RequestHandler = async (req, res) => {
        const form: Type.DeleteForm = req.body;
        const { valid, errors } = validator.validatePassword(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: Type.UserI | null = await User.findOne({ _id: req.user!._id });
            if (!user) return res.status(404).json({ message: 'ERROR: Wrong credentials.' });

            user.comparePassword(form.password, async (_: any, matchPassword: boolean) => {
                if (matchPassword) {
                    await user.remove();
                    return res.json({ message: 'Your account has been deleted.' });
                }

                res.status(403).json({ message: 'ERROR: Wrong password.' });
            });
        } catch (error) {
            res.status(500).json({
                message: 'ERROR: Something went wrong while deleting. Please try again later or contact our support.',
            });
        }
    };

    const verifyEmail: RequestHandler = async (req, res) => {
        const token: string = req.params.verifyToken!;

        try {
            jwt.verify(token, JWT_VERIFICATION_SECRET_KEY);
        } catch (error) {
            return res.status(401).json({ message: 'ERROR: Expired email token.' });
        }

        try {
            const user: Type.UserI | null = await User.findOne({
                verifyToken: token,
            });
            if (!user) return res.status(404).json({ message: 'ERROR: Wrong credentials.' });

            user.verifyToken = '';
            user.isEmailVerified = true;

            if (user.tempEmail) {
                user.email = user.tempEmail;
                user.tempEmail = '';
            }

            await user.save();

            res.json({ message: 'Thank you! Your email has been verified.' });
        } catch (error) {
            res.status(500).json({
                message: 'ERROR: Something went wrong verifying your account. Please try again later.',
            });
        }
    };

    const resendVerifyEmail: RequestHandler = async (req, res) => {
        const form: Type.EmailForm = req.body;
        const { valid, errors } = validator.validateEmail(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: Type.UserI | null = await User.findOne({ email: form.email });
            if (!user) return res.status(404).json({ message: 'ERROR: Email not found.' });
            if (user.isEmailVerified) return res.json({ message: 'Your account is already verified.' });

            user.verifyToken = auth.createVerificationToken('email');
        } catch (error) {
            res.status(500).json({
                message: 'ERROR: Something went wrong with the email verification. Please try again later.',
            });
        }
    };

    const resetPassword: RequestHandler = async (req, res) => {
        const form: Type.EmailForm = req.body;
        const { valid, errors } = validator.validateEmail(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: Type.UserI | null = await User.findOne({ email: form.email });
            if (!user) return res.status(404).json({ message: 'ERROR: Email not found.' });

            user.verifyToken = auth.createVerificationToken('password');
            await user.save();

            const msg = Msg.resetPassword(user);
            await sgMail.send(msg);

            res.json({
                message: 'Please check your email to reset your password.',
            });
        } catch (error) {
            res.status(500).json({
                message: 'ERROR: Something went wrong with the email verification. Please try again later.',
            });
        }
    };

    const updatePassword: RequestHandler = async (req, res) => {
        const token: string = req.params.verifyToken!;

        try {
            jwt.verify(token, JWT_VERIFICATION_SECRET_KEY);
        } catch (error) {
            return res.status(401).json({ message: 'ERROR: Expired password token.' });
        }

        const form: Type.PasswordForm = req.body;
        const { valid, errors } = validator.validatePassword(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: Type.UserI | null = await User.findOne({
                verifyToken: token,
            });
            if (!user) return res.status(404).json({ message: 'ERROR: Wrong credentials.' });

            user.verifyToken = '';
            user.password = form.password;
            await user.save();

            const msg = Msg.updatePassword(user);
            await sgMail.send(msg);

            res.json({
                message: 'Password updated successfully.',
            });
        } catch (error) {
            res.status(500).json({
                message: 'ERROR: Something went wrong with the email verification. Please try again later.',
            });
        }
    };

    export default {
        signUpUser,
        loginUser,
        getUser,
        updateUser,
        deleteUser,
        verifyEmail,
        resendVerifyEmail,
        resetPassword,
        updatePassword,
    };
  ```

## Middlewares

### Authorization

[Go Back to Contents](#contents)

- In `src/middlewares/auth.ts`

  - `auth`, responsible for authorizing incoming requests

    - Checks if token exists
    - `jwt.verify()` checks if token is still valid. `jwt.verify()` will deco/validate the token using the secret key.

      ```JavaScript
        {
          _id: '5f83d0c881912ae1ac70e2dd',
          firstName: 'Roger',
          lastName: 'Takeshita',
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
    import { RequestHandler } from 'express';
    import jwt from 'jsonwebtoken';
    import * as Type from '@cTypes/types';

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
    const JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN!;
    const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY!;
    const JWT_VERIFICATION_EXPIRES_IN = process.env.JWT_VERIFICATION_EXPIRES_IN!;

    const auth: RequestHandler = (req, res, next) => {
        let token: string = req.get('Authorization') || req.query.token || req.body.token;

        try {
            if (token) {
                token = token.replace('Bearer ', '');
                const user = <Type.UserJWT>jwt.verify(token, JWT_SECRET_KEY);
                req.user = user;
                next();
            } else {
                res.status(401).json({ message: 'Token not found.' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, invalid token.' });
        }
    };

    const createAccessToken: Type.JWTAccessFn = (user: Type.User) => {
        return jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName }, JWT_SECRET_KEY, {
            expiresIn: JWT_SECRET_EXPIRES_IN,
        });
    };

    const createVerificationToken: Type.JWTVerifyFn = (mode: string) => {
        return jwt.sign({ mode }, JWT_VERIFICATION_SECRET_KEY, {
            expiresIn: JWT_VERIFICATION_EXPIRES_IN,
        });
    };

    export { auth, createAccessToken, createVerificationToken };
  ```

## Models

### User's Schema

[Go Back to Contents](#contents)

- In `src/models/user.ts`

  ```TypeScript
    import { NextFunction } from 'express';
    import mongoose from 'mongoose';
    import bcrypt from 'bcrypt';
    import * as Type from '@cTypes/types';

    const Schema = mongoose.Schema;
    const SALT_ROUNDS: number = 6;

    const userSchema = new Schema(
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
                required: true,
                trim: true,
                unique: true,
                lowercase: true,
            },
            tempEmail: {
                type: String,
                trim: true,
                lowercase: true,
            },
            verifyToken: String,
            isEmailVerified: {
                type: Boolean,
                default: false,
            },
            password: {
                type: String,
                require: true,
                minlength: process.env.PASSWORD_LEN,
                trim: true,
            },
            admin: {
                type: Boolean,
                default: false,
            },
        },
        {
            timestamps: true,
        }
    );

    userSchema.pre<Type.UserI>('save', async function (next) {
        const user = this;

        if (user.isModified('password')) user.password = await bcrypt.hash(this.get('password'), SALT_ROUNDS);
        next();
    });

    userSchema.methods.comparePassword = function (tryPassword: string, callback: NextFunction) {
        bcrypt.compare(tryPassword, this.get('password'), callback);
    };

    userSchema.set('toJSON', {
        transform: function (_: any, ret: Type.UserI) {
            delete ret.password;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.isEmailVerified;
            delete ret.admin;
            delete ret.verifyToken;
            delete ret.__v;
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

        if (user.isModified('password')) user.password = await bcrypt.hash(this.get('password'), SALT_ROUNDS);
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
    userSchema.methods.comparePassword = function (tryPassword: string, callback: NextFunction) {
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
            delete ret.password;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.isEmailVerified;
            delete ret.admin;
            delete ret.verifyToken;
            delete ret.__v;
            return ret;
        },
    });
  ```

## Routes

### User's Routes

[Go Back to Contents](#contents)

- In `src/routes/users.ts`

  - Using `Router` from **express** to create different routes `GET`, `POST`, `PUT`, and `DELETE`
  - We have two types of routes: **publics** and **privates**
    - **Private** routes use the `auth` middleware to check if user is authenticated

  ```TypeScript
    import express from 'express';
    import userCtrl from '@controllers/users';
    import { auth } from '@middlewares/auth';

    const router = express.Router();

    router.post('/signup', userCtrl.signUpUser);
    router.post('/login', userCtrl.loginUser);
    router.post('/email', userCtrl.resendVerifyEmail);
    router.get('/email/:verifyToken', userCtrl.verifyEmail);
    router.post('/password', userCtrl.resetPassword);
    router.post('/password/:verifyToken', userCtrl.updatePassword);

    router.get('/profile', auth, userCtrl.getUser);
    router.put('/profile', auth, userCtrl.updateUser);
    router.delete('/profile', auth, userCtrl.deleteUser);

    export default router;
  ```

## Utilities

### Types

[Go Back to Contents](#contents)

- In `src/utils/@types/types.ts`

  ```TypeScript
    import { Document } from 'mongoose';

    declare module 'express-serve-static-core' {
        export interface Request {
            user?: UserJWT | LoginForm | SignUpForm;
        }
    }

    type Callback = (error: string, isMatch: boolean) => void;

    export interface UserI extends Document {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        tempEmail: string;
        verifyToken?: string;
        isEmailVerified?: boolean;
        password?: string;
        admin?: boolean;
        comparePassword(password: string, callback: Callback): void;
        createdAt?: string;
        updatedAt?: string;
    }

    export type User = {
        _id?: string;
        firstName: string;
        lastName: string;
    };

    export interface UserJWT extends User {
        iat: number;
        exp: number;
    }

    export type LoginForm = {
        _id?: string;
        email: string;
        password: string;
    };

    type ConcatForm = User & LoginForm;

    export interface SignUpForm extends ConcatForm {
        confirmPassword?: string;
        verifyToken?: string;
    }

    export type DeleteForm = {
        password: string;
    };

    export type EmailForm = {
        email: string;
    };

    export type PasswordForm = {
        password: string;
        confirmPassword?: string;
    };

    export interface UpdateUserForm extends User {
        password: string;
        newEmail: string;
        newPassword: string;
        confirmNewPassword: string;
    }

    export type Msg = {
        from: string;
        to: string;
        subject: string;
        html: string;
    };

    export type JWTAccessFn = {
        (user: User): string;
    };

    export type JWTVerifyFn = {
        (mode: string): string;
    };

    export type CheckFn = {
        (string: string): boolean;
    };

    export type ValidatorFn<T> = {
        (data: T): {
            errors: ErrorContainer;
            valid: boolean;
        };
    };

    export type ErrorContainer = {
        [key: string]: string;
    };

    export type Object = {
        [index: string]: any;
    };
  ```

### Helpers

#### Message

[Go Back to Contents](#contents)

- In `src/utils/helpers/message.ts`

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
    import * as Type from '@cTypes/types';

    const FRONTEND_URL = process.env.FRONTEND_URL!;

    export const signUp = (user: Type.UserI, host: string): Type.Msg => {
        return {
            from: process.env.SENDGRID_EMAIL!,
            to: user.email,
            subject: 'Verify your email',
            html: `
                    <h1>Hello ${user.firstName}</h1>
                    <p>Thanks for registering on our website.</p>
                    <a href="http://${host}/api/users/email/${user.verifyToken}">Click here to verify your account</a>
                `,
        };
    };

    export const updateEmail = (user: Type.UserI, host: string): Type.Msg => {
        return {
            from: process.env.SENDGRID_EMAIL!,
            to: user.tempEmail,
            subject: 'Verify your email',
            html: `
                    <h1>Hello ${user.firstName}</h1>
                    <a href="http://${host}/api/users/email/${user.verifyToken}">Click here to confirm your new email</a>
                `,
        };
    };

    export const resetPassword = (user: Type.UserI): Type.Msg => {
        return {
            from: process.env.SENDGRID_EMAIL!,
            to: user.email,
            subject: 'Reset password',
            html: `
                    <h1>Hello ${user.firstName}</h1>
                    We're sending you this email because you requested a password reset. Click on this link to create a new password:
                    <a href="${FRONTEND_URL}/reset-password/${user.verifyToken}">Set a new password</a>
                    If you didn't request a password reset, you can ignore this email. Your password will not be changed.
                `,
        };
    };

    export const updatePassword = (user: Type.UserI): Type.Msg => {
        return {
            from: process.env.SENDGRID_EMAIL!,
            to: user.email,
            subject: 'Update password',
            html: `
                    <h1>Hello ${user.firstName}</h1>
                    Your password has been updated. Please login using your new credentials.
                `,
        };
    };
  ```

#### Validator

[Go Back to Contents](#contents)

- In `src/utils/helpers/validator.ts`

  ```TypeScript
    import * as Type from '@cTypes/types';

    const PASSWORD_LENGTH = +process.env.PASSWORD_LEN!;

    const isEmpty: Type.CheckFn = (str: string) => {
        if (str !== undefined && str.trim() === '') return true;
        return false;
    };

    export const isEmail: Type.CheckFn = (email: string) => {
        const emailRegEx =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email && email.match(emailRegEx)) return true;
        return false;
    };

    const check = (propertyName: string, data: Type.Object, length: number | undefined = undefined) => {
        if (!data.hasOwnProperty(propertyName)) return false;
        if (isEmpty(data[propertyName])) return false;
        if (length && data[propertyName].length < length) return false;
        return true;
    };

    const validateSignUpData: Type.ValidatorFn<Type.SignUpForm> = (data: Type.Object) => {
        const { email, password, confirmPassword } = data;
        const errors: Type.ErrorContainer = {};

        if (!check('email', data)) errors.email = 'Must not be empty.';
        else if (check('email', data) && !isEmail(email)) errors.email = 'Must be a valid email address.';
        if (!check('firstName', data)) errors.firstName = 'Must not be empty.';
        if (!check('lastName', data)) errors.lastName = 'Must not be empty.';
        if (!check('password', data)) errors.password = 'Must not be empty.';
        if (!check('confirmPassword', data)) errors.confirmPassword = 'Must not be empty.';
        if (!check('password', data, PASSWORD_LENGTH))
            errors.passwordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
        if (!check('confirmPassword', data, PASSWORD_LENGTH))
            errors.confirmPasswordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
        if (
            data.hasOwnProperty('password') &&
            check('password', data, PASSWORD_LENGTH) &&
            data.hasOwnProperty('confirmPassword') &&
            check('confirmPassword', data, PASSWORD_LENGTH) &&
            password !== confirmPassword
        )
            errors.passwords = 'Must be equal.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    const validateLoginData: Type.ValidatorFn<Type.LoginForm> = (data: Type.Object) => {
        const { email } = data;
        const errors: Type.ErrorContainer = {};

        if (!check('email', data)) errors.email = 'Must not be empty.';
        else if (check('email', data) && !isEmail(email)) errors.email = 'Must be a valid email address.';
        if (!check('password', data)) errors.password = 'Must not be empty.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    const validateUpdateData: Type.ValidatorFn<Type.UpdateUserForm> = (data: Type.Object) => {
        const { newEmail, newPassword, confirmNewPassword } = data;
        const errors: Type.ErrorContainer = {};
        let count = 0;

        if (data.hasOwnProperty('newEmail') && !check('newEmail', data)) errors.newEmail = 'Must not be empty.';
        else if (data.hasOwnProperty('newEmail') && check('newEmail', data) && !isEmail(newEmail))
            errors.newEmail = 'Must be a valid email address.';
        if (data.hasOwnProperty('firstName') && !check('firstName', data)) errors.firstName = 'Must not be empty.';
        if (data.hasOwnProperty('lastName') && !check('lastName', data)) errors.lastName = 'Must not be empty.';
        if (data.hasOwnProperty('password') && !check('password', data)) errors.password = 'Must not be empty.';
        if (data.hasOwnProperty('password') && !check('password', data, PASSWORD_LENGTH))
            errors.passwordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
        if (data.hasOwnProperty('newPassword') && !check('newPassword', data)) errors.newPassword = 'Must not be empty.';
        if (data.hasOwnProperty('newPassword') && !check('newPassword', data, PASSWORD_LENGTH))
            errors.newPasswordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
        if (data.hasOwnProperty('confirmNewPassword') && !check('confirmNewPassword', data))
            errors.confirmNewPassword = 'Must not be empty.';
        if (data.hasOwnProperty('confirmNewPassword') && !check('confirmNewPassword', data, PASSWORD_LENGTH))
            errors.confirmNewPasswordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
        if (
            data.hasOwnProperty('newPassword') &&
            check('newPassword', data, PASSWORD_LENGTH) &&
            data.hasOwnProperty('confirmNewPassword') &&
            check('confirmNewPassword', data, PASSWORD_LENGTH) &&
            newPassword !== confirmNewPassword
        )
            errors.passwords = 'Must be equal.';

        Object.keys(data).forEach(() => count++);

        if (count === 1) errors.unchanged = 'Must modify something.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    const validatePassword: Type.ValidatorFn<Type.PasswordForm> = (data: Type.Object) => {
        const { password, confirmPassword } = data;
        const errors: Type.ErrorContainer = {};

        if (!check('password', data)) errors.password = 'Must not be empty.';
        if (!check('password', data, PASSWORD_LENGTH))
            errors.passwordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
        if (data.hasOwnProperty('confirmPassword') && !check('confirmPassword', data))
            errors.confirmPassword = 'Must not be empty.';
        if (data.hasOwnProperty('confirmPassword') && !check('confirmPassword', data, PASSWORD_LENGTH))
            errors.confirmPasswordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
        if (check('password', data) && check('confirmPassword', data) && password !== confirmPassword)
            errors.passwords = 'Must be equal.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    const validateEmail: Type.ValidatorFn<Type.EmailForm> = (data: Type.Object) => {
        const { email } = data;
        const errors: Type.ErrorContainer = {};

        if (!check('email', data)) errors.email = 'Must not be empty.';
        else if (check('email', data) && !isEmail(email)) errors.email = 'Must be a valid email address.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    export { validateSignUpData, validateLoginData, validateUpdateData, validatePassword, validateEmail };
  ```

## Server

[Go Back to Contents](#contents)

- We split the server into 2 files (`app.ts` and `index.ts`) so we can in the future use **Jest** to automate our API test

### App.ts

[Go Back to Contents](#contents)

- In `src/app.ts`

  ```TypeScript
    import express, { Application, Request, Response } from 'express';
    import logger from 'morgan';
    import cors from 'cors';
    import helmet from 'helmet';
    import '@config/database';

    import userRoutes from '@routes/users';

    const app: Application = express();
    app.use(logger('dev'));
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    app.use('/api/v1/users', userRoutes);

    app.get('/*', (_: Request, res: Response) => {
        res.status(404).json({ message: "Path doesn't exist." });
    });

    export default app;
  ```

### Index.ts

[Go Back to Contents](#contents)

- In `src/index.ts`

  ```TypeScript
    import app from '~/app';
    const port = process.env.PORT || 3001;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
  ```

## Jest - Test

### Init

[Go Back to Contents](#contents)

- Initializing Jest

  ```Bash
    ./node_modules/.bin/jest --init
  ```

- Setting Jest

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

- By default jest doesn't work with TypeScript, that's why need to install `ts-jest`
- the `ts-jest` helps us to test the file without the need to compile the file (transform from `.ts` to `.js`)
- In `./jest.config.js`

  - We define the **root path** using the `path` module, and set the `rootDir` to `root`
  - we need to define `moduleNameMapper` so jest can map the right path since we are using TypeScript alias
  - Short version

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
              '@config/(.*)': '<rootDir>/src/config/$1',
              '@controllers/(.*)': '<rootDir>/src/controllers/$1',
              '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
              '@models/(.*)': '<rootDir>/src/models/$1',
              '@routes/(.*)': '<rootDir>/src/routes/$1',
              '@utils/(.*)': '<rootDir>/src/utils/$1',
              '@cTypes/(.*)': '<rootDir>/src/utils/@types/$1',
              '@helpers/(.*)': '<rootDir>/src/utils/helpers/$1',
          },
          preset: 'ts-jest',
          rootDir: root,
          testMatch: ['<rootDir>/src/**/*.test.ts'],
      };
    ```

### Database Connects

[Go Back to Contents](#contents)

- In `src/tests/database/database.ts`

  ```TypeScript
    import User from '@models/user';
    const ObjectID = require('mongodb').ObjectID;

    type ObjectID = typeof import('mongodb').ObjectID;

    class UserClass {
        _id: ObjectID;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        isEmailVerified: boolean;

        constructor(
            protected readonly _firstName: string,
            _lastName: string,
            _email: string,
            _password: string,
            _isEmailVerified: boolean
        ) {
            this._id = new ObjectID();
            this.firstName = _firstName;
            this.lastName = _lastName;
            this.email = _email;
            this.password = _password;
            this.isEmailVerified = _isEmailVerified;
        }
    }

    const user1 = new UserClass('Roger', 'That', 'your_email_1@test.com', 'test123', true);

    const user2 = new UserClass('Roger 1', 'That 1', 'your_email_2@test.com', 'test123', false);

    const setupDatabase = async () => {
        await User.deleteMany({});
        await new User(user1).save();
        await new User(user2).save();
    };

    export { user1, user2, setupDatabase };
  ```

### Test Cases

[Go Back to Contents](#contents)

- In `src/tests/user.test.ts`

  ```TypeScript
    import app from '~/app';
    import User from '@models/user';
    import request from 'supertest';
    import jwt from 'jsonwebtoken';
    import * as Type from '@cTypes/types';
    import { user1, user2, setupDatabase } from './database/database';

    const URL = '/api/v1/users';
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
    const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY!;
    const PASSWORD_LEN = process.env.PASSWORD_LEN!;

    beforeEach(setupDatabase);

    describe("User's API", () => {
        it('Should sign up new user', async () => {
            const form: Type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(201);
            const user: Type.UserI | null = await User.findOne({ email: form.email });
            expect(user).not.toBeNull();
            expect(response.body).toMatchObject({
                message: 'Your account has been created. Please check your email to verify your account.',
            });
        });

        it('Should not sign up new user - existing user/email', async () => {
            const form: Type.SignUpForm = {
                email: user1.email,
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
            expect(response.body).toMatchObject({
                message: 'ERROR: Email already in use.',
            });
        });

        ...

    });
  ```

#### \_\_mocks\_\_

[Go Back to Contents](#contents)

##### @SENDGRID

[Go Back to Contents](#contents)

- We use `__mocks__` to override the `node_modules/@sendgrind/mail`

  - To override something, we just need to follow the same structure of the package
  - In `tests/__mocks__/@sendgrid/mails.ts`

    - We are going to override the **setApiKey** and **send** methods

  ```TypeScript
    module.exports = {
        setApiKey() {},
        send() {},
    };
  ```

##### @TYPES

[Go Back to Contents](#contents)

- We use `__mocks__` to override the `node_modules/@types` and create our custom types specific for testing.
- In `tests/__mocks__/@types/types.ts`

  ```TypeScript
    type LoginResponse = {
        body: string;
    };

    type ResponseMSG = {
        body: {
            message: string;
        };
    };

    type UserProfile = {
        body: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
  ```

#### Coverage Test

[Go Back to Contents](#contents)

- To display the coverage test

  - Add `-- --coverage` in the end of the command
  - Run the command `npm run test -- --coverage`

  ![](https://i.imgur.com/NGNWeHZ.png)

  - **NOTE** still needs more tests to handle the `return res.status(500)` in `src/controllers/users.ts` to reach 100% of coverage.

## Babel

[Go Back to Contents](#contents)

- Using babel to transpile our code into JavaScript

  - Babel is necessary because only TSC can't convert 100% correct. Since we are using alias, tsc can't convert the alias to correct path.
  - To do so, we need babel and its dependencies

### Config

[Go Back to Contents](#contents)

- In `babel.config.js`

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
                        '@config': './src/config',
                        '@controllers': './src/controllers',
                        '@middlewares': './src/middlewares',
                        '@models': './src/models',
                        '@routes': './src/routes',
                        '@utils': './src/utils',
                        '@cTypes': './src/utils/@types',
                        '@helpers': './src/utils/helpers',
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
