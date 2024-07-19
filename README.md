# Transaction Management System

![Version](https://img.shields.io/badge/version-v0.0.1-blue)
![Contributions Welcome](https://img.shields.io/badge/contributions-Welcome-orange.svg)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Basic Overview

A scalable system for managing transactions from multiple processors, designed using NestJS, Sequelize, PostgreSQL, and gRPC. The solution includes a Gateway Service for REST endpoints and a Transaction Service for gRPC endpoints, with a focus on handling various transaction structures and ensuring extensibility.

## Features

### Overall project features

- Well documented throught UML diagrams.
- Well formatted using `Prettier` and eslint.
- Follows code reusability and extendability.
- Added Postman collection and env file example for easier testing.
- Common library for global component sharing and reduced redundency.

### REST Service Features (`apigateway`)

- **`apigateway` service exposes** 3 endpoints:
  - **POST `/api/v1/transactions/{one/two}`** for receiving webhook transactions.
  - **GET `/api/v1/transactions`** for retrieving transactions with pagination.
- **API Versioning** (for later modification)
- **Secured** with `API-key` for both webhooks and listing transactions.
- **gRPC Exception Handling** in REST API.
- **Middleware Logger** for requests.
- **DTO Validation**.
- **Swagger API Documentation**.

### Common Library Features

- **Global Logger Config**.
- **Global Types**.
- **Global Mapper** (from native to processor enum and vice versa).

### gRPC Service Features (`transaction`)

- **Interceptor** for method calls logging.
- **Event Emitter and Listeners**.
- **Database Config**
- **N-Tier Architecture** for repository and models.
- **Global Logging**.

## System is extendable for following:

- Preventing `Race conditions` by applying:
  - **Atomic transactions**
  - **Distributed Locks**: connecting to `Redis` for example
  - **Event sourcing**: maintain a log of events.
- Ensuring `Durability`:
  - Reliable Database: `PostgreSQL` for example
  - Enable and configure `WAL` (Write Ahead Log)
- Guarantee `Data Integrity`:
  - Data validation: check for existing data first
  - Encapsulate insertions inside of db transaction

## Dependencies

All dependencies can be found in the `package.json` file. Ensure to install them using:

```bash
npm install
```

## How to Use

- Clone the repository:
  ```bash
  git clone https://github.com/MostafaAbdelkarim/transaction-management-system.git
  ```
- Configure the datasource properties in your .env file.
- Run the application:
  ```bash
  npm run start apigateway
  npm run start transaction
  ```
- For watch mode

  ```bash
  npm run start:dev apigateway
  npm run start:dev transaction
  ```

- For running all tests
  ```bash
  npm test
  ```

## Enhancement Features

- Add API-key in gRPC service calls from REST API.
- Improve naming conventions.
- Refactor transaction mapper for better performance.
- Encapsulate all actions inside DB transactions to handle race conditions.
- Dockerize the entire application.
- Add pre-commit hooks.
- Add database migration scripts.
- Integrate Kafka as a Pub/Sub messaging system.
