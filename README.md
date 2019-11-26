# Serverless-VerifyToken-Authorizer
This serverless authorizer is a code snippet that verifies JW token from the request.

**Included Resources:**

- Lambda function

**NOTE:** These are code snippets to verifies JW token. This project alone does not run.

## Quick Start

### Prerequisites 

Install Serverless Framework

```bash
`npm install -g serverless`
```

Create Serverless project

```bash
$ sls create --template-url https://github.com/mosufy/serverless-templates/tree/master/api-sqs --path my-service
$ cd my-service
```

Install dependencies

```bash
$ yarn install
```

Start local

```bash
$ yarn start
```

Access local url via browser or Postman (recommended): http://localhost:8181/ping.

## Directory Structure

```
├── config
|   └── functions
|       └── QueueExperiment.yml
├── src
|   ├── handlers
|   |   └── queue.js
|   └── middlewares
|       └── verifyToken.js
└── README.md
```

**functions/**  
Serverless function configuration includes calling the authorizer handler.

**src/**  
Main source code for your application.

**src/handlers/**  
Entry point for all events.

**src/middlewares/**  
Request middlewares. See [Middlewares](#middlewares) for more information.