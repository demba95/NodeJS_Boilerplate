<h1 id='contents'>Table of Contents</h1>

- [NODE.JS BOILERPLATE](#nodejs-boilerplate)
  - [Init Node](#init-node)
  - [Create Folder and Files](#create-folder-and-files)
  - [Install Packages](#install-packages)
    - [Init Typescript](#init-typescript)
    - [package.json](#packagejson)
  - [Environment Variables](#environment-variables)
  - [Types](#types)
  - [Database Connection](#database-connection)
    - [MongoDB](#mongodb)
      - [Warnings](#warnings)
  - [Controllers](#controllers)
    - [Users Controllers](#users-controllers)
  - [Middlewares](#middlewares)
    - [Authentication](#authentication)
  - [Models](#models)
    - [User's Schema](#users-schema)
      - [Pre Save](#pre-save)
      - [Compare Password](#compare-password)
      - [Remove Fields](#remove-fields)
  - [Routes](#routes)
    - [User's Routes](#users-routes)
  - [Utilities](#utilities)
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
  - [Babel](#babel)
    - [Config](#config-1)

# NODE.JS BOILERPLATE

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

  - Using my custom touch command to create files and folders

    ```Bash
      touch -n @types/types.ts env/dev.env + prod.env + test.env src/config/database.ts src/controllers/users.ts src/middlewares/auth.ts src/models/user.ts src/routes/users.ts src/tests/user.test.js + database/database.js src/utils/message.ts + validator.ts src/app.ts src/index.ts babel.config.js
    ```

- Final Structure

  ```Bash
    .
    ├── env
    │   ├── dev.env
    │   ├── prod.env
    │   └── test.env
    ├── src
    │   ├── @types
    │   │   └── types.ts
    │   ├── config
    │   │   └── database.ts
    │   ├── controllers
    │   │   └── users.ts
    │   ├── middlewares
    │   │   └── auth.ts
    │   ├── models
    │   │   └── user.ts
    │   ├── routes
    │   │   └── users.ts
    │   ├── tests
    │   │   ├── database
    │   │   │   └── database.js
    │   │   └── user.test.js
    │   ├── utils
    │   │   ├── message.ts
    │   │   └── validator.ts
    │   ├── app.ts
    │   └── index.ts
    ├── .gitignore
    ├── babel.config.js
    ├── jest.config.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md
  ```

## Install Packages

[Go Back to Contents](#contents)

- Install the following dependencies:

  ```Bash
    # npm i @sendgrid/mail bcrypt cors env-cmd express helmet jsonwebtoken mongoose morgan validator

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
    # npm i -D @types/bcrypt @types/cors @types/express @types/jsonwebtoken @types/mongoose @types/morgan @types/node @types/validator @types/jest jest ts-jest supertest ts-node-dev tsconfig-paths typescript @babel/cli @babel/core @babel/node @babel/preset-env @babel/preset-typescript babel-plugin-module-resolver

    npm i -D @types/bcrypt
    npm i -D @types/cors
    npm i -D @types/express
    npm i -D @types/jsonwebtoken
    npm i -D @types/mongoose
    npm i -D @types/morgan
    npm i -D @types/node
    npm i -D @types/jest
    npm i -D jest
    npm i -D ts-jest
    npm i -D supertest
    npm i -D ts-node-dev
    npm i -D tsconfig-paths
    npm i -D typescript
    npm i -D @babel/cli
    npm i -D @babel/core
    npm i -D @babel/node
    npm i -D @babel/preset-env
    npm i -D @babel/preset-typescript
    npm i -D babel-plugin-module-resolver
  ```

### Init Typescript

[Go Back to Contents](#contents)

- Initialize TypesScript, on your root folder

  ```Bash
    tsc --init
  ```

- This command will generate the `tsconfig.json`

  - Add the following options

    ```JSON
      {
          "compilerOptions": {
              "target": "ES6" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
              "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
              "allowJs": true /* Allow javascript files to be compiled. */,
              "outDir": "./dist" /* Redirect output structure to the directory. */,
              "rootDir": "./src" /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */,
              "removeComments": true /* Do not emit comments to output. */,
              "moduleResolution": "node",
              "noEmitOnError": true,
              "resolveJsonModule": true /* Enable import JSON files in the code */,
              "noFallthroughCasesInSwitch": true /* Report errors for fallthrough cases in switch statement. */,
              "typeRoots": [
                  "./node_modules/@types",
                  "src/@types"
              ] /* List of folders to include type definitions from. */,
              "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
              "skipLibCheck": true /* Skip type checking of declaration files. */,
              "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */,
              "baseUrl": "./src",
              "paths": {
                  "~/*": ["./*"],
                  "@custom_types/*": ["./@types/*"],
                  "@config/*": ["./config/*"],
                  "@controllers/*": ["./controllers/*"],
                  "@middlewares/*": ["./middlewares/*"],
                  "@models/*": ["./models/*"],
                  "@routes/*": ["./routes/*"],
                  "@utils/*": ["./utils/*"]
              }
          },
          "include": ["src/**/*"],
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

  - Development variables

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

  - Test variables

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

## Types

[Go Back to Contents](#contents)

- In `src/@types/types.ts`

  - We store our TypeScript types

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
        verifyToken: string;
        isEmailVerified: boolean;
        password: string;
        admin: boolean;
        comparePassword(password: string, callback: Callback): void;
    }

    export interface User {
        _id?: string;
        firstName: string;
        lastName: string;
    }

    export interface UserJWT extends User {
        iat: number;
        exp: number;
    }

    export interface LoginForm {
        _id?: string;
        email: string;
        password: string;
    }

    type ConcatForm = User & LoginForm;

    export interface SignUpForm extends ConcatForm {
        confirmPassword: string;
        verifyToken?: string;
    }

    export interface UpdateUserForm extends User {
        newEmail: string;
        newPassword: string;
        confirmNewPassword: string;
    }

    export interface MSGFn {
        (user: UserI, host: string): {
            from: string;
            to: string;
            subject: string;
            html: string;
        };
    }

    export interface JWTAccessFn {
        (user: User): string;
    }

    export interface JWTVerifyFn {
        (mode: string): string;
    }

    export interface CheckFn {
        (string: string): boolean;
    }

    export type FormData = LoginForm & SignUpForm & UpdateUserForm;

    export interface ValidatorFn {
        (data: FormData): {
            errors: ErrorContainer;
            valid: boolean;
        };
    }

    export interface ErrorContainer {
        [key: string]: string;
    }
  ```

## Database Connection

### MongoDB

[Go Back to Contents](#contents)

- In `src/config/database.ts`

  ```TypeScript
    import mongoose from 'mongoose';
    const db = mongoose.connection;

    mongoose.connect(process.env.DATABASE_URL, {
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
    > DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
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
    import * as validator from '@utils/validator';
    import * as MSG from '@utils/message';
    import * as type from '@custom_types/types';

    const JWT_VERIFICATION_EXPIRES_IN = process.env.JWT_VERIFICATION_EXPIRES_IN;

    sgMail.setApiKey(process.env.SENDGRID_KEY);

    const signUpUser: RequestHandler = async (req, res) => {
        const form: type.FormData = req.body;

        const { valid, errors } = validator.validateSignUpData(form);
        if (!valid) {
            return res.status(400).json(errors);
        }

        try {
            const user: type.UserI = await User.findOne({ email: form.email });

            if (user) {
                return res
                    .status(400)
                    .json({ message: 'ERROR: Email already in use.' });
            }

            delete form.confirmPassword;
            form.verifyToken = auth.createVerificationToken('email');
            const newUser: any = new User(form);
            await newUser.save();

            try {
                const msg = MSG.signUp(newUser, req.headers.host);
                await sgMail.send(msg);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message:
                        'ERROR: Something went wrong sending you the email verification. Please try again later.',
                });
            }

            res.status(201).json({
                message:
                    'Your account has been created. Please check your email to verify your account.',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong while trying to sign up. Please try again later or contact our support.',
            });
        }
    };

    const loginUser: RequestHandler = async (req, res) => {
        const form: type.FormData = req.body;

        const { valid, errors } = validator.validateLoginData(form);
        if (!valid) {
            return res.status(400).json(errors);
        }

        try {
            const user: type.UserI = await User.findOne({ email: form.email });
            if (!user) {
                return res.status(404).json({ message: 'ERROR: User not found.' });
            }

            user.comparePassword(form.password, async (_, isMatch) => {
                if (isMatch) {
                    if (user.isEmailVerified) {
                        const token = await auth.createAccessToken(user);
                        return res.json({ token });
                    }

                    return res.status(403).json({
                        message: 'ERROR: Please verify your email first.',
                    });
                }

                res.status(403).json({ message: 'ERROR: Wrong credentials.' });
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong while trying to login. Please try again later or contact our support.',
            });
        }
    };

    const getUser: RequestHandler = async (req, res) => {
        try {
            const user: type.UserI = await User.findOne({ _id: req.user._id });
            if (!user) {
                return res.status(404).json({ message: 'ERROR: User not found.' });
            }

            res.json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong while trying to get profile. Please try again later or contact our support.',
            });
        }
    };

    const updateUser: RequestHandler = async (req, res) => {
        const form: type.FormData = req.body;

        const { valid, errors } = validator.validateUpdateData(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: type.UserI = await User.findOne({
                _id: req.user._id,
            }).select('-tempEmail');
            if (!user) {
                return res.status(404).json({ message: 'ERROR: User not found.' });
            }

            if (form.newEmail) {
                const email: type.UserI = await User.findOne({
                    email: form.newEmail,
                });
                if (email) {
                    return res.status(400).json({
                        message: `ERROR: Email (${form.newEmail}) is already in use.`,
                    });
                }
            }

            user.comparePassword(form.password, async (_, isMatch) => {
                if (isMatch) {
                    if (form.firstName) user.firstName = form.firstName;
                    if (form.lastName) user.lastName = form.lastName;
                    if (form.newPassword) user.password = form.newPassword;
                    if (form.newEmail) {
                        user.tempEmail = form.newEmail;

                        user.verifyToken = auth.createVerificationToken('email');

                        try {
                            const msg = MSG.updateEmail(user, req.headers.host);
                            await sgMail.send(msg);
                        } catch (error) {
                            console.log(error);
                            res.status(500).json({
                                message:
                                    'ERROR: Something went wrong sending you the email verification. Please try again later.',
                            });
                        }
                    }

                    await user.save();
                    return res.json(user);
                }

                res.status(403).json({ message: 'ERROR: Wrong credentials.' });
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong while updating. Please try again later or contact our support.',
            });
        }
    };

    const deleteUser: RequestHandler = async (req, res) => {
        const form: type.FormData = req.body;

        const { valid, errors } = validator.validatePassword(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: type.UserI = await User.findOne({ _id: req.user._id });
            if (!user) {
                return res.status(404).json({ message: 'ERROR: User not found.' });
            }

            user.comparePassword(form.password, async (_, isMatch) => {
                if (isMatch) {
                    await user.remove();
                    return res.json({ message: 'Your account has been deleted.' });
                }

                res.status(403).json({ message: 'ERROR: Wrong password.' });
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong while deleting. Please try again later or contact our support.',
            });
        }
    };

    const verifyEmail: RequestHandler = async (req, res) => {
        try {
            const token = req.params.verifyToken;
            try {
                jwt.verify(token, process.env.JWT_VERIFICATION_SECRET_KEY);
            } catch (error) {
                return res
                    .status(401)
                    .json({ message: 'ERROR: Expired email token.' });
            }

            const user: type.UserI = await User.findOne({
                verifyToken: token,
            });

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'ERROR: Invalid/Expired email token.' });
            }

            user.verifyToken = null;
            user.isEmailVerified = true;

            if (user.tempEmail) {
                user.email = user.tempEmail;
                user.tempEmail = null;
            }

            await user.save();

            res.json({ message: 'Thank you! Your email has been verified.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong verifying your account. Please try again later.',
            });
        }
    };

    const resendVerifyEmail: RequestHandler = async (req, res) => {
        const form: type.FormData = req.body;

        const { valid, errors } = validator.validateEmail(form);
        if (!valid) return res.status(400).json(errors);

        try {
            const user: type.UserI = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({ message: 'ERROR: User not found.' });
            }

            if (user.isEmailVerified) {
                return res.json({ message: 'Your account is already verified.' });
            }
            try {
                user.verifyToken = auth.createVerificationToken('email');
                await user.save();
                const msg = MSG.signUp(user, req.headers.host);
                await sgMail.send(msg);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message:
                        'ERROR: Something went wrong sending you the email verification. Please try again later.',
                });
            }

            res.json({
                message: 'Please check your email to verify your account.',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong with the email verification. Please try again later.',
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
    };
  ```

## Middlewares

### Authentication

[Go Back to Contents](#contents)

- In `src/middlewares/auth.ts`

  - We have 3 functions

    - `auth`

      - responsible for authorizing incoming requests

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
      import * as type from '@custom_types/types';

      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
      const JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN;
      const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY;
      const JWT_VERIFICATION_EXPIRES_IN = process.env.JWT_VERIFICATION_EXPIRES_IN;

      const auth: RequestHandler = (req, res, next) => {
          try {
              let token: string =
                  req.get('Authorization') || req.query.token || req.body.token;

              try {
                  if (token) {
                      token = token.replace('Bearer ', '');
                      const user = <type.UserJWT>jwt.verify(token, JWT_SECRET_KEY);
                      if (!user) {
                          return res.status(401).json({ message: 'Not authorized.' });
                      }

                      req.user = user;
                      next();
                  } else {
                      throw new Error();
                  }
              } catch (error) {
                  return res.status(401).json({ message: 'Invalid token.' });
              }
          } catch (error) {
              console.log(error);
              res.status(500).json({
                  message:
                      'ERROR: Something went wrong while authorizing request. Please try again later.',
              });
          }
      };

      const createAccessToken: type.JWTAccessFn = (user: type.User) => {
          return jwt.sign(
              { _id: user._id, firstName: user.firstName, lastName: user.lastName },
              JWT_SECRET_KEY,
              { expiresIn: JWT_SECRET_EXPIRES_IN }
          );
      };

      const createVerificationToken: type.JWTVerifyFn = (mode) => {
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
    import * as type from '@custom_types/types';
    import * as validator from '@utils/validator';

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
                validate(value: string): any {
                    if (!validator.isEmail(value)) {
                        throw new Error('Email is invalid');
                    }
                },
            },
            tempEmail: {
                type: String,
                trim: true,
                lowercase: true,
                validate(value: string): any {
                    if (value && !validator.isEmail(value)) {
                        throw new Error('Email is invalid');
                    }
                },
            },
            verifyToken: String,
            isEmailVerified: {
                type: Boolean,
                default: false,
            },
            password: {
                type: String,
                require: true,
                minlength: 3,
                trim: true,
                validate(value: string): any {
                    if (value.toLowerCase().includes('password')) {
                        throw new Error('Password cannot contain "password"');
                    }
                },
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

    userSchema.pre<type.UserI>('save', async function (next) {
        const user = this;

        if (user.isModified('password')) {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
            }
        }

        next();
    });

    userSchema.methods.comparePassword = async function (
        tryPassword: string,
        callback: NextFunction
    ) {
        await bcrypt.compare(tryPassword, this.password, callback);
    };

    userSchema.set('toJSON', {
        transform: function (_, ret) {
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

    export default mongoose.model<type.UserI>('User', userSchema);
  ```

#### Pre Save

[Go Back to Contents](#contents)

- Called every time we save a document

  - Checks if the password changed
    - If changed, then it will use `bcrypt.hash()` to hash the password
    - `SALT_ROUNDS`, is used to **encrypt** the password.

  ```TypeScript
    userSchema.pre<type.UserI>('save', async function (next) {
        const user = this;

        if (user.isModified('password')) {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
            }
        }

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
    userSchema.methods.comparePassword = async function (
        tryPassword: string,
        callback: NextFunction
    ) {
        await bcrypt.compare(tryPassword, this.password, callback);
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
        transform: function (_, ret) {
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
    router.get('/verify-email/:verifyToken', userCtrl.verifyEmail);
    router.post('/verify-email', userCtrl.resendVerifyEmail);

    router.get('/profile', auth, userCtrl.getUser);
    router.put('/profile', auth, userCtrl.updateUser);
    router.delete('/profile', auth, userCtrl.deleteUser);

    export default router;
  ```

## Utilities

[Go Back to Contents](#contents)

- In the `utils` folder we are going to save all our utilities files

### Message

[Go Back to Contents](#contents)

- In `src/utils/message.ts`

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
    import * as type from '@custom_types/types';

    export const signUp: type.MSGFn = (user, host) => {
        return {
            from: process.env.SENDGRID_EMAIL,
            to: user.email,
            subject: 'Verify your email',
            html: `
                    <h1>Hello ${user.firstName}</h1>
                    <p>Thanks for registering on our website.</p>
                    <a href="http://${host}/users/verify-email/${user.verifyToken}">Click here to verify your account</a>
                `,
        };
    };

    export const updateEmail: type.MSGFn = (user, host) => {
        return {
            from: process.env.SENDGRID_EMAIL,
            to: user.tempEmail,
            subject: 'Verify your email',
            html: `
                    <h1>Hello ${user.firstName}</h1>
                    <a href="http://${host}/users/verify-email/${user.verifyToken}">Click here to confirm your new email</a>
                `,
        };
    };
  ```

### Validator

[Go Back to Contents](#contents)

- In `src/utils/validator.ts`

  - Helper file to validate incoming data

  ```TypeScript
    import * as type from '@custom_types/types';

    const isEmpty: type.CheckFn = (string) => {
        if (!string || string.trim() === '') return true;
        return false;
    };

    export const isEmail: type.CheckFn = (email) => {
        const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email && email.match(emailRegEx)) return true;
        return false;
    };

    const validateSignUpData: type.ValidatorFn = (data) => {
        const errors: type.ErrorContainer = {};

        if (isEmpty(data.email)) {
            errors.email = 'Must not be empty.';
        } else if (!isEmail(data.email)) {
            errors.email = 'Must be a valid email address.';
        }
        if (isEmpty(data.firstName)) errors.firstName = 'Must not be empty.';
        if (isEmpty(data.lastName)) errors.lastName = 'Must not be empty.';
        if (isEmpty(data.password)) errors.password = 'Must not be empty.';
        if (isEmpty(data.confirmPassword))
            errors.confirmPassword = 'Must not be empty.';
        if (
            (data.password && data.password.length < +process.env.PASSWORD_LEN) ||
            (data.confirmPassword &&
                data.confirmPassword.length < +process.env.PASSWORD_LEN)
        ) {
            errors.passwordLength = `Must not be greater than ${process.env.PASSWORD_LEN} characters.`;
        }
        if (data.password !== data.confirmPassword)
            errors.passwords = 'Must be equal.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    const validateLoginData: type.ValidatorFn = (data) => {
        const errors: type.ErrorContainer = {};

        if (isEmpty(data.email)) errors.email = 'Must not be empty.';
        else if (!isEmail(data.email))
            errors.email = 'Must be a valid email address.';
        if (isEmpty(data.password)) errors.password = 'Must not be empty.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    const validateUpdateData: type.ValidatorFn = (data) => {
        const errors: type.ErrorContainer = {};
        let count = 0;

        if (data.newEmail && isEmpty(data.newEmail)) {
            errors.lastName = 'Must not be empty.';
        } else if (data.newEmail && !isEmail(data.newEmail)) {
            errors.newEmail = 'Must be a valid email address.';
        }
        if (data.firstName && isEmpty(data.firstName))
            errors.firstName = 'Must not be empty.';
        if (data.lastName && isEmpty(data.lastName))
            errors.lastName = 'Must not be empty.';
        if (isEmpty(data.password)) errors.password = 'Must not be empty.';
        if (data.newPassword && isEmpty(data.newPassword))
            errors.newPassword = 'Must not be empty.';
        if (data.confirmNewPassword && isEmpty(data.confirmNewPassword))
            errors.confNewPassword = 'Must not be empty.';
        if (
            (data.newPassword &&
                data.newPassword.length < +process.env.PASSWORD_LEN) ||
            (data.confirmNewPassword &&
                data.confirmNewPassword.length < +process.env.PASSWORD_LEN)
        ) {
            errors.passwordLength = `Must not be greater than ${process.env.PASSWORD_LEN} characters.`;
        }
        if (data.newPassword !== data.confirmNewPassword)
            errors.passwords = 'Must be equal.';

        Object.keys(data).forEach((key) => {
            if (data[key]) count++;
        });

        if (count === 0) errors.unchanged = 'Must modify something.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    const validatePassword: type.ValidatorFn = (data) => {
        const errors: type.ErrorContainer = {};

        if (isEmpty(data.password)) errors.password = 'Must not be empty.';
        if (data.password && data.password.length < +process.env.PASSWORD_LEN)
            errors.passwordLength = `Must not be greater than ${process.env.PASSWORD_LEN} characters.`;

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    const validateEmail: type.ValidatorFn = (data) => {
        const errors: type.ErrorContainer = {};

        if (isEmpty(data.email)) errors.email = 'Must not be empty.';
        else if (!isEmail(data.email))
            errors.email = 'Must be a valid email address.';

        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false,
        };
    };

    export {
        validateSignUpData,
        validateLoginData,
        validateUpdateData,
        validatePassword,
        validateEmail,
    };
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

    app.use('/users', userRoutes);

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

      module.exports = {
          rootDir: root,
          displayName: 'TEST',
          testMatch: ['<rootDir>/src/**/*.test.ts'],
          testEnvironment: 'node',
          clearMocks: true,
          preset: 'ts-jest',
          moduleNameMapper: {
              '~/(.*)': '<rootDir>/src/$1',
              '@custom_types/(.*)': '<rootDir>/src/@types/$1',
              '@config/(.*)': '<rootDir>/src/config/$1',
              '@controllers/(.*)': '<rootDir>/src/controllers/$1',
              '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
              '@models/(.*)': '<rootDir>/src/models/$1',
              '@routes/(.*)': '<rootDir>/src/routes/$1',
              '@utils/(.*)': '<rootDir>/src/utils/$1',
          },
      };
    ```

### Database Connects

[Go Back to Contents](#contents)

- In `src/tests/database/database.ts`

  - We create our base environment

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

    const user1 = new UserClass(
        'Roger',
        'That',
        'your_email_1@test.com',
        'test123',
        true
    );

    const user2 = new UserClass(
        'Roger 1',
        'That 1',
        'your_email_2@test.com',
        'test123',
        false
    );

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

  - We have all tests related to the user's endpoints

  ```TypeScript
    import app from '~/app';
    import User from '@models/user';
    import request from 'supertest';
    import jwt from 'jsonwebtoken';
    import * as type from '@custom_types/types';
    import { user1, user2, setupDatabase } from './database/database';
    const URL = '/users';
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    interface LoginResponse {
        body: {
            token: string;
        };
    }

    interface ResponseMSG {
        body: {
            message: string;
        };
    }

    interface UserProfile {
        body: {
            firstName: string;
            lastName: string;
            email: string;
        };
    }

    beforeEach(setupDatabase);

    describe("User's API", () => {
        it('Should sign up - new user', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(201);
            const user: type.UserI = await User.findOne({ email: form.email });
            expect(user).not.toBeNull();
            expect(response.body).toMatchObject({
                message:
                    'Your account has been created. Please check your email to verify your account.',
            });
        });

        it('Should not sign up - existing user/email', async () => {
            const form: type.SignUpForm = {
                email: user1.email,
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                message: 'ERROR: Email already in use.',
            });
        });

        it('Should not sign up - empty first name', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: '',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                firstName: 'Must not be empty.',
            });
        });

        it('Should not sign up - empty last name', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: '',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                lastName: 'Must not be empty.',
            });
        });

        it('Should not sign up - empty email', async () => {
            const form: type.SignUpForm = {
                email: '',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                email: 'Must not be empty.',
            });
        });

        it('Should not sign up - invalid email', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                email: 'Must be a valid email address.',
            });
        });

        it('Should not sign up - empty password', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: '',
                confirmPassword: 'test123',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                password: 'Must not be empty.',
                passwords: 'Must be equal.',
            });
        });

        it('Should not sign up - password length', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: '12',
                confirmPassword: '12',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                passwordLength: `Must not be greater than ${process.env.PASSWORD_LEN} characters.`,
            });
        });

        it('Should not sign up - empty confirm password', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: '',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                confirmPassword: 'Must not be empty.',
                passwords: 'Must be equal.',
            });
        });

        it('Should not sign up - wrong confirm password', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123wrong',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                passwords: 'Must be equal.',
            });
        });

        it('Should not sign up - empty form', async () => {
            const form: type.SignUpForm = {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: '',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/signup`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                firstName: 'Must not be empty.',
                lastName: 'Must not be empty.',
                email: 'Must not be empty.',
                password: 'Must not be empty.',
                confirmPassword: 'Must not be empty.',
            });
        });

        it('Should verify account', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            await request(app).post(`${URL}/signup`).send(form).expect(201);
            const user: type.UserI = await User.findOne({ email: form.email });
            expect(user).not.toBeNull();

            const response = await request(app)
                .get(`${URL}/verify-email/${user.verifyToken}`)
                .expect(200);
            expect(response.body).toMatchObject({
                message: 'Thank you! Your email has been verified.',
            });
        });

        it('Should not verify account - empty email token', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            await request(app).post(`${URL}/signup`).send(form).expect(201);
            const user: type.UserI = await User.findOne({ email: form.email });
            expect(user).not.toBeNull();

            await request(app).get(`${URL}/verify-email/`).expect(404);
        });

        it('Should not verify account - invalid email token', async () => {
            const form: type.SignUpForm = {
                email: 'your_email_3@test.com',
                firstName: 'Roger 3',
                lastName: 'That 3',
                password: 'test123',
                confirmPassword: 'test123',
            };

            await request(app).post(`${URL}/signup`).send(form).expect(201);
            const user: type.UserI = await User.findOne({ email: form.email });
            expect(user).not.toBeNull();

            const response = await request(app)
                .get(
                    `${URL}/verify-email/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2RlIjoiZW1haWwiLCJpYXQiOjE2MDI2ODg3MjEsImV4cCI6MTYwMzI5MzUyMX0.CWhtDg0BYoaL9sld0hwOd7U12agsXSB-7SZ6XYF9hko`
                )
                .expect(404);
            expect(response.body).toMatchObject({
                message: 'ERROR: Invalid/Expired email token.',
            });
        });

        it('Should login - verified email', async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const userData = <type.UserJWT>(
                jwt.verify(response.body.token, JWT_SECRET_KEY)
            );
            const user: type.UserI = await User.findOne({ email: form.email });
            expect(user).not.toBeNull();
            expect(userData).toMatchObject({
                firstName: user1.firstName,
                lastName: user1.lastName,
            });
        });

        it('Should not login - unverified user', async () => {
            const form: type.LoginForm = {
                email: user2.email,
                password: user2.password,
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(403);
            expect(response.body).toMatchObject({
                message: 'ERROR: Please verify your email first.',
            });
        });

        it('Should not login - wrong password', async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password + 'wrong_password',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(403);
            expect(response.body).toMatchObject({
                message: 'ERROR: Wrong credentials.',
            });
        });

        it('Should not login - empty password', async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: '',
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                password: 'Must not be empty.',
            });
        });

        it('Should not login - invalid email', async () => {
            const form: type.LoginForm = {
                email: 'your_email_3@test',
                password: user1.password,
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                email: 'Must be a valid email address.',
            });
        });

        it('Should not login - empty email', async () => {
            const form: type.LoginForm = {
                email: '',
                password: user1.password,
            };

            const response: ResponseMSG = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(400);
            expect(response.body).toMatchObject({
                email: 'Must not be empty.',
            });
        });

        it("Should fetch user's profile", async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const token: string = response.body.token;
            const profile: UserProfile = await request(app)
                .get(`${URL}/profile`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(profile.body).toMatchObject({
                firstName: user1.firstName,
                lastName: user1.lastName,
                email: user1.email,
            });
        });

        it("Should not fetch user's profile - invalid token", async () => {
            const invalidToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            const profile: UserProfile = await request(app)
                .get(`${URL}/profile`)
                .set('Authorization', `Bearer ${invalidToken}`)
                .expect(401);
            expect(profile.body).toMatchObject({
                message: 'Invalid token.',
            });
        });

        it("Should not fetch user's profile - empty token", async () => {
            const profile: UserProfile = await request(app)
                .get(`${URL}/profile`)
                .send()
                .expect(401);
            expect(profile.body).toMatchObject({
                message: 'Invalid token.',
            });
        });

        it("Should update user's profile - fistName", async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const token: string = response.body.token;
            const updateUser = <type.FormData>{
                firstName: 'Roger Update',
                password: user1.password,
            };
            await request(app)
                .put(`${URL}/profile`)
                .send(updateUser)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const user: type.UserI = await User.findById({ _id: user1._id });
            expect(user).toMatchObject({
                firstName: updateUser.firstName,
            });
        });

        it("Should update user's profile - lastName", async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const token: string = response.body.token;
            const updateUser = <type.FormData>{
                lastName: 'That Update',
                password: user1.password,
            };
            await request(app)
                .put(`${URL}/profile`)
                .send(updateUser)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const user: type.UserI = await User.findById({ _id: user1._id });
            expect(user).toMatchObject({
                lastName: updateUser.lastName,
            });
        });

        it("Should update user's profile - password", async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const token: string = response.body.token;
            const updateUser = <type.FormData>{
                password: user1.password,
                newPassword: '12345',
                confirmNewPassword: '12345',
            };
            await request(app)
                .put(`${URL}/profile`)
                .send(updateUser)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const form2: type.LoginForm = {
                email: user1.email,
                password: updateUser.newPassword,
            };
            const response2: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form2)
                .expect(200);
            expect(typeof response2.body.token).toBe('string');
        });

        it("Should not update user's profile - password length", async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const token: string = response.body.token;
            const updateUser = <type.FormData>{
                password: user1.password,
                newPassword: '12',
                confirmNewPassword: '12',
            };
            const response2 = await request(app)
                .put(`${URL}/profile`)
                .send(updateUser)
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            expect(response2.body).toMatchObject({
                passwordLength: `Must not be greater than ${process.env.PASSWORD_LEN} characters.`,
            });
        });

        it("Should update user's profile - email", async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const token: string = response.body.token;
            const updateUser = <type.FormData>{
                password: user1.password,
                newEmail: 'your_email_3_update@test.com',
            };
            await request(app)
                .put(`${URL}/profile`)
                .send(updateUser)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const user: type.UserI = await User.findById({ _id: user1._id });
            expect(user).toMatchObject({
                tempEmail: updateUser.newEmail,
            });
        });

        it('Should delete user/profile', async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const token: string = response.body.token;
            const response2: UserProfile = await request(app)
                .delete(`${URL}/profile`)
                .set('Authorization', `Bearer ${token}`)
                .send({ password: form.password })
                .expect(200);
            expect(response2.body).toMatchObject({
                message: 'Your account has been deleted.',
            });
        });

        it('Should not delete user/profile - invalid token', async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: UserProfile = await request(app)
                .delete(`${URL}/profile`)
                .send({ password: form.password })
                .expect(401);
            expect(response.body).toMatchObject({
                message: 'Invalid token.',
            });
        });

        it('Should not delete user/profile - invalid password', async () => {
            const form: type.LoginForm = {
                email: user1.email,
                password: user1.password,
            };

            const response: LoginResponse = await request(app)
                .post(`${URL}/login`)
                .send(form)
                .expect(200);
            const token: string = response.body.token;
            const response2: UserProfile = await request(app)
                .delete(`${URL}/profile`)
                .set('Authorization', `Bearer ${token}`)
                .send({ password: form.password + 'wrong_password' })
                .expect(403);
            expect(response2.body).toMatchObject({
                message: 'ERROR: Wrong password.',
            });
        });
    });
  ```

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
                        '@custom_types': './src/@types',
                        '@config': './src/config',
                        '@controllers': './src/controllers',
                        '@middlewares': './src/middlewares',
                        '@models': './src/models',
                        '@routes': './src/routes',
                        '@utils': './src/utils',
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
