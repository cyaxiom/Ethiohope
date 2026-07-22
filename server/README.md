<div id="top"></div>

<!-- badges -->
<div align="center" >

[![Nodejs](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)
[![javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://www.javascript.com)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://GitHub.com/Naereen/badges/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.com/html5/)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://en.wikipedia.org/wiki/CSS)
[![Json](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)](https://www.json.org/json-en.html)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://github.com/omar-sherif9992)
[![Analytics](https://img.shields.io/badge/Google%20Analytics-E37400?style=for-the-badge&logo=google%20analytics&logoColor=white)](https://analytics.google.com/analytics/web/provision/#/provision)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)

</div>

<br>

<a href=""><h1 align="center">Welcome to EthioHope</h1></a>

<div align="center">
    <img src="" alt="Logo" width="200" height="120">

  <h3 align="center">EthioHope Academy</h3>

  <p align="center">
    An Educational Website !
  </p>
</div>

## Table of Contents

- [Installation](#installation)
- [Ideas for Scalability](#ideas-for-scalability)
  - [Scaling](#scaling)
  - [Scaling Scheme](#scaling-scheme)
  - [Balancing](#balancing)
  - [Caching](#caching)
  - [Data Partitioning](#data-partitioning)
  - [CAP](#cap)
- [Environment Variables](#environment-variables)
- [Screeshots](#screenshots)
- [Folder Structure](#folder-structure)

## installation

- clone the project `git clone https://github.com/cyaxiom/ethiohope_api`

- go to folder : `cd ethiohope_api`

- to install packages : `npm install`

- to run the backend : `npm run dev`

# Ideas for Scalability

## Scaling

In the future with increasing number of users to the system, the server will need to be upgraded and we can scale the system in one of two ways,
either vertival scaling with increasing the processing power of our server and the processing node or horizontal scaling and increasing the number of the processing nodes(servers that serve the functionality of our system).
Horizontal scaling is preferable because at the end we will hit a limit in which we will not go over a specific processing power and the vertical scaling is more expensive in upgrading one node power rather than having multiple nodes and have the total work divided over them.

## Scaling-Scheme

What is the schema to be chosen? will the servers will be divided according to functionality or according to state? and requests origin?
It depends on the number of users from each US state so if we followed the scheme of each server is handling each State then we will have some servers overloaded that others depending on the popularity of the platform in one place than the other, this scheme can be used in the future when the number of users increases in many US states and even from other countries then we can consider this scaling schema, but on low level scaling (more users in smaller number of states) it is better to follow the schema of having each server is responsible for a specific task or functionality, we can have many servers divided as follows :
--> server repsonsible for uploading videos of the lectures and lessons and requesting these videos
--> server responsible for the payment and banking actions
--> server responsible for the other informtaion and normal requests within the system
\*\* This schema can be mixed with the first proposed schema when having more and more users so for each region we can have this set responsible for serving this specific region.

## Balancing

Sometimes we can have some servers overwhelmed than the others depending on the amount of users accessing the platform and their place and region.
This can lead to losing availability because now one can try to access the platform and server is down hence the system is unavailable.
We can try to decrease this effect by having Load Balancers (type of a reverse proxy), these load balancers will receive the request on the behalf of the client and then these load balancers will send these requests to the servers, and these load balancer functionality is to choose what is the best server to choose that can receive this request and then it send this request to that server and there are many ways to choose what server to send to, one of these choosing policies is Round Robin in which we have our servers as a circle and we start sending reuqests in this way to server1 --> then server2 --> server3 --> back to start of the circle so we guarantee having equal amount of requests on each serve to have balanced work over the servers and another technique related to the network the least connection server (server having the least number of connections with other clients) or the server with the least bandwidth used, Load Balancers will be needed to try to decrease the unavailability of the server.

## Caching

One way of having faster and better performance on larger scale is to have cahces to cahce the data that is mostly requested by users so they can have the data faster in future requests. We can have a CDN(Content Distribution Network) which is type of cache that is used for large systems serving a lot amount of static data and this will be useful in our platform case because we will be having many static data and a lot of videos for lessons and courses that we will need to have an optimized way to serve these data to the client in efiicient and fast way.

## Data-Partitioning

On large Scale we can't still have only one database at the end we need to have multiple databases by replicas or partitioning.
We can partition the data vertivally or horziontally, in vertical partitioning we will have for each row entry the row itself will be divided into different databases, this is a better solution in our case because we will have static data and videos for the lessons and courses, so having these static data and videos in their databases would be preferable than putting these data with the other client's and course's information in one database.
We can have the database divided and partitioned into multiple partitions, one partition could be for the videos, and another partition could be for user and course's information and finally we can have replicas for these databases to avoid having a single point of failure in these databases partitions.

## CAP

Now with scaled system we have to choose one of two properties to the system, Availability and Consistency.
To our platform Availability would be more benefcial to have better UX because for e-learining platform that can not be accessible by the client at any time will be frustrating with bad UX.
We can tolerate some inconsistency in this platform and have eventually consistent system, as we really don't care if a client make a get request to see the reviews on a specific course and he doesn't get these reviews updated to the very last moment.
So having NoSQL database will be better on Scalability, as it is more flexible and with better performance and faster than SQL databases.
Now when choosing available system, the nodes will be available on any request but the node itself won't be up to date in any moment because it may need some data from other nodes and take time to get these data, and we chose availability so we can't ignore the user request waiting for data (here we lose avaialbility) but we respond with data available and then node will be updated. (this is what is called eventually consistent).

## Environment Variables

```
    # ===============================
    # Node environment
    # ===============================
    NODE_ENV=development


    # ===============================
    # Database
    # ===============================
    MONGO_DB_URI=


    # ===============================
    # Server configuration
    # ===============================
    PORT=2707
    LOG_DIR=../logs
    LOG_FORMAT=dev


    # ===============================
    # Redis configuration
    # ===============================
    REDIS_HOST=
    REDIS_PORT=
    REDIS_PASSWORD=


    # ===============================
    # CORS & Security
    # ===============================
    ORIGIN=http://localhost:3000
    CREDENTIALS=false


    # ===============================
    # Security Keys
    # ===============================
    SECRET_KEY=mysecret
    ACCESS_TOKEN_PRIVATE_KEY=hdsfuewufsdfhuwe
    REFRESH_TOKEN_PRIVATE_KEY=hdsfuewufsdfhuwe


    # ===============================
    # Email Configuration
    # ===============================
    EMAIL_SERVICE=gmail
    SENDER_MAIL=
    SENDER_PASSSWORD=


    # ===============================
    # Client / Frontend
    # ===============================
    CLIENT_URL=http://localhost:3000/


    # ===============================
    # Company Information
    # ===============================
    COMPANY_NAME=EthioHope
    COMPANY_ADDRESS=Dallas, TX
    COMPANY_PHONE=+251900000000
    COMPANY_EMAIL=contact@ethiohope.com
    COMPANY_WEBSITE=https://ethiohope.com
    COMPANY_FACEBOOK=https://www.facebook.com
    COMPANY_INSTAGRAM=https://www.instagram.com
    COMPANY_LINKEDIN=https://www.linkedin.com
    COMPANY_TWITTER=https://twitter.com
    COMPANY_YOUTUBE=https://www.youtube.com/@ethiohope
    COMPANY_GITHUB=https://github.com/ethiohope
    COMPANY_LOGO=https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png


    # ===============================
    # Payments
    # ===============================
    STRIPE_PRIVATE_KEY=
    STRIPE_WEBHOOK_SECRET=


    # ===============================
    # External Services
    # ===============================
    EXCHANGE_BASE_URL=https://api.exchangerate.host


    # ===============================
    # Mobile Apps
    # ===============================
    COMPANY_GOOGLE_PLAY=
    COMPANY_APP_STORE=
```

## screenshots

<img src="/system_design.png" alt="Sign up User Form" align="center" >

## Folder Structure

```
.
.
├── ecosystem.config.js        # PM2 process configuration (prod)
├── nginx.conf                 # Example NGINX reverse-proxy config
├── nodemon.json               # Nodemon dev config (file watching/restarts)
├── package.json
├── package-lock.json
├── README.md
├── swagger.json               # Generated OpenAPI spec (do not edit by hand)
├── swagger.mjs                # Script to build swagger.json from swagger.yaml
├── swagger.yaml               # Source OpenAPI spec
├── tsconfig.json
└── src
    ├── app.ts                 # Express app bootstrap (middlewares, routes, swagger)
    ├── server.ts              # Server entrypoint (creates HTTP server, connects services)
    ├── core                   # Cross-cutting core (framework + domain helpers)
    │   ├── base               # Base classes for services/DAOs/controllers
    │   │   ├── base.controller.ts
    │   │   ├── base.dao.ts
    │   │   └── base.service.ts
    │   ├── common             # Shared constants, errors, types, middlewares, utils
    │   │   ├── constants
    │   │   │   ├── http.ts
    │   │   │   ├── messages.ts
    │   │   │   └── roles.ts
    │   │   ├── errors
    │   │   │   ├── ApiError.ts
    │   │   │   ├── error-codes.ts
    │   │   │   └── HttpException.ts
    │   │   ├── interfaces
    │   │   │   ├── paginated.ts
    │   │   │   ├── response.interface.ts
    │   │   │   └── route.interface.ts
    │   │   ├── logs
    │   │   │   ├── debug
    │   │   │   └── error
    │   │   ├── middlewares
    │   │   │   ├── auth.middleware.ts
    │   │   │   ├── error.middleware.ts
    │   │   │   ├── modelsError.middleware.ts
    │   │   │   ├── rateLimiter.middleware.ts
    │   │   │   ├── user.middleware.ts
    │   │   │   └── validation.middleware.ts
    │   │   └── utils
    │   │       ├── HttpResponse.ts
    │   │       ├── HttpStatusCodes.ts
    │   │       ├── logger.ts
    │   │       ├── PaginationResponse.ts
    │   │       ├── util.ts
    │   │       └── validateEnv.ts
    │   └── config             # Runtime configuration and clients
    │       ├── cloud.ts       # Cloud providers bootstrap (S3/Cloudinary)
    │       ├── database.ts    # Database connection and lifecycle
    │       ├── env.ts         # Environment loading/validation
    │       └── redis.ts       # Redis client/bootstrap
    ├── infra                  # External adapters (gateways, mail, queues, storage)
    │   ├── gateway
    │   │   ├── oauth.gateway.ts      # OAuth/OpenID Connect adapter(s)
    │   │   ├── payment.gateway.ts    # Payment processor adapter(s)
    │   │   └── sms.gateway.ts        # SMS provider adapter(s)
    │   ├── mail
    │   │   ├── mail.service.ts       # Email sending abstraction
    │   │   └── templates             # Email HTML templates
    │   │       ├── Certificate.html
    │   │       ├── ForgetPassword.html
    │   │       ├── Registration.html
    │   │       └── VerifyEmail.html
    │   └── storage
    │       ├── bull.ts               # Bull queue instance/config
    │       ├── cleanup.job.ts        # Scheduled cleanup worker
    │       ├── cloudinary.service.ts # Cloudinary storage service
    │       ├── email.job.ts          # Background email job processor
    │       ├── local.storage.ts      # Local filesystem storage helper
    │       └── s3.service.ts         # AWS S3 storage service
    ├── modules                # Feature modules (domain-focused vertical slices)
    │   ├── Authentication
    │   │   ├── auth.controller.ts
    │   │   ├── auth.dao.ts
    │   │   ├── auth.dto.ts
    │   │   ├── auth.route.ts
    │   │   ├── auth.service.ts
    │   │   └── index.ts
    │   ├── Certificate        # Certificate issuance/verification (WIP)
    │   ├── Course             # Course lifecycle (WIP)
    │   ├── EmailTemplate      # Dynamic email templates (WIP)
    │   ├── Enrollment         # Course enrollment flows (WIP)
    │   ├── File               # File metadata/management (WIP)
    │   ├── Notification       # In-app notifications (WIP)
    │   ├── Payment            # Payments and webhooks (WIP)
    │   ├── Project            # Projects/initiatives (WIP)
    │   ├── Task               # Tasks/subtasks (WIP)
    │   ├── Trainee            # Trainee domain (WIP)
    │   └── User
    │       ├── index.ts
    │       ├── user.controller.ts
    │       ├── user.dto.ts
    │       ├── user.route.ts
    │       ├── user.schema.ts        # Validation/schema layer
    │       ├── users.dao.ts
    │       └── user.service.ts
    ├── scripts                # Operational scripts (db migrations, seeds, repairs)
    │   ├── migrate.ts
    │   ├── repair.ts
    │   └── seed.ts
    ├── shared                 # Cross-module DTOs, validators, transformers
    │   ├── dtos
    │   ├── transformers
    │   └── validators
    ├── tests                  # Test suites
    │   ├── integration
    │   └── unit
    └── types                  # Global TypeScript declarations
        ├── environment.d.ts
        ├── express.d.ts
        └── global.d.ts
```
