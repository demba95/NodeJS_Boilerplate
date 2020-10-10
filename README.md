<h1 id='contents'>Table of Contents</h1>

- [NODE.JS BOILERPLATE](#nodejs-boilerplate)
  - [Init Node](#init-node)
  - [Create Folder and Files](#create-folder-and-files)
  - [Install Packages](#install-packages)
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
      touch -n env/dev.env + prod.env src/config/database.ts src/controllers/users.ts src/middlewares/auth.ts src/models/user.ts src/routes/users.ts src/utils/validator.ts + types.ts src/redux/users.ts src/store.ts src/app.ts src/index.ts src/tests/fixtures/database.js src/user.test.js
    ```

- Final Structure

  ```Bash
    .
    ├── env
    │   ├── dev.env
    │   └── prod.env
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
    │   │   └── fixtures
    │   │   |   └── database.js
    │   │   └── user.test.js
    │   ├── utils
    │   │   ├── types.ts
    │   │   └── validator.ts
    │   ├── app.ts
    │   ├── index.ts
    │   └── store.ts
    ├── .gitignore
    ├── LICENSE
    ├── package.json
    └── README.md
  ```

## Install Packages

[Go Back to Contents](#contents)

- Install the following dependencies:

  ```Bash
    npm i express cors env-cmd morgan mongoose helmet bcrypt jsonwebtoken @sendgrid/mail validator
    npm i --save-dev jest supertest typescript @types/node @types/express @types/morgan
  ```

### package.json

[Go Back to Contents](#contents)

- After we install everything, we just need to config the **scripts** and **jest**

  ```JSON
    "scripts": {
        "start": "env-cmd -f ./env/prod.env nodemon dist/index.js && tsc --w",
        "dev": "env-cmd -f ./env/dev.env nodemon dist/index.js && tsc --w",
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
            "start": "env-cmd -f ./env/prod.env nodemon dist/index.js && tsc --w",
            "dev": "env-cmd -f ./env/dev.env nodemon dist/index.js && tsc --w",
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
            "@types/express": "^4.17.8",
            "@types/morgan": "^1.9.1",
            "@types/node": "^14.11.8",
            "jest": "^26.5.2",
            "supertest": "^5.0.0",
            "typescript": "^4.0.3"
        }
    }
  ```
