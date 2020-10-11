<h1 id='contents'>Table of Contents</h1>

- [NODE.JS BOILERPLATE](#nodejs-boilerplate)
  - [Init Node](#init-node)
  - [Create Folder and Files](#create-folder-and-files)
  - [Install Packages](#install-packages)
    - [Init Typescript](#init-typescript)
    - [package.json](#packagejson)

# NODE.JS BOILERPLATE

## Init Node

[Go Back to Contents](#contents)

- Create a new node project

  ```Bash
    npm init

    # name: node.js_boilerplate
    # version: (1.0.0)
    # description: Node.js Boilerplate
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
      touch -n env/dev.env + prod.env + test.env src/config/database.ts src/controllers/users.ts src/middlewares/auth.ts src/models/user.ts src/redux/users.ts src/routes/users.ts src/tests/user.test.js + fixures/database.js src/utils/message.ts + types.ts + validator.ts src/app.ts src/index.ts src/store.ts
    ```

- Final Structure

  ```Bash
    .
    ├── env
    │   ├── dev.env
    │   ├── prod.env
    │   └── test.env
    ├── src
    │   ├── config
    │   │   └── database.ts
    │   ├── controllers
    │   │   └── users.ts
    │   ├── middlewares
    │   │   └── auth.ts
    │   ├── models
    │   │   └── user.ts
    │   ├── redux
    │   │   └── users.ts
    │   ├── routes
    │   │   └── users.ts
    │   ├── tests
    │   │   ├── fixtures
    │   │   │   └── database.js
    │   │   └── user.test.js
    │   ├── utils
    │   │   ├── message.ts
    │   │   ├── types.ts
    │   │   └── validator.ts
    │   ├── app.ts
    │   ├── index.ts
    │   └── store.ts
    ├── .gitignore
    ├── LICENSE
    ├── package-lock.json
    └── package.json
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
    # npm i -D @types/bcrypt @types/cors @types/express @types/jsonwebtoken @types/mongoose @types/morgan @types/node @types/validator jest supertest ts-node typescript
    npm i -D @types/bcrypt
    npm i -D @types/cors
    npm i -D @types/express
    npm i -D @types/jsonwebtoken
    npm i -D @types/mongoose
    npm i -D @types/morgan
    npm i -D @types/node
    npm i -D jest
    npm i -D supertest
    npm i -D ts-node
    npm i -D typescript
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
              "sourceMap": true /* Generates corresponding '.map' file. */,
              "outDir": "./dist" /* Redirect output structure to the directory. */,
              // "rootDir": "./" /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */,
              "moduleResolution": "node",
              "noEmitOnError": true,
              "noFallthroughCasesInSwitch": true /* Report errors for fallthrough cases in switch statement. */,
              "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
              "skipLibCheck": true /* Skip type checking of declaration files. */,
              "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */
          },
          "exclude": ["**/node_modules"]
      }
    ```

### package.json

[Go Back to Contents](#contents)

- After we install everything, we just need to config the **scripts** and **jest**

  ```JSON
    "scripts": {
        "start": "env-cmd -f ./env/prod.env node dist/index.js",
        "dev": "env-cmd -f ./env/dev.env nodemon src/index.ts",
        "build": "tsc -p .",
        "test": "env-cmd -f ./env/test.env jest --watch --runInBand --detectOpenHandles"
    },
    "jest": {
        "bail": 1,
        "verbose": true,
        "testEnvironment": "node"
    },
  ```

- Complete json file

  ```JSON
    {
        "name": "node.js_boilerplate",
        "version": "1.0.0",
        "description": "Node.js Boilerplate",
        "main": "index.js",
        "scripts": {
            "start": "env-cmd -f ./env/prod.env node dist/index.js",
            "dev": "env-cmd -f ./env/dev.env nodemon src/index.ts",
            "build": "tsc -p .",
            "test": "env-cmd -f ./env/test.env jest --watch --runInBand --detectOpenHandles"
        },
        "jest": {
            "bail": 1,
            "verbose": true,
            "testEnvironment": "node"
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
            "morgan": "^1.10.0",
            "validator": "^13.1.17"
        },
        "devDependencies": {
            "@types/bcrypt": "^3.0.0",
            "@types/cors": "^2.8.8",
            "@types/express": "^4.17.8",
            "@types/jsonwebtoken": "^8.5.0",
            "@types/mongoose": "^5.7.36",
            "@types/morgan": "^1.9.1",
            "@types/node": "^14.11.8",
            "@types/validator": "^13.1.0",
            "jest": "^26.5.2",
            "supertest": "^5.0.0",
            "ts-node": "^9.0.0",
            "typescript": "^4.0.3"
        }
    }

  ```
