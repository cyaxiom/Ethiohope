import compression from 'compression';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import { version } from '../package.json';
import swaggerFile from '../swagger.json';

import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT, FRONTEND_BUILD_PATH } from '@config/env';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import errorMiddleware from '@middlewares/error.middleware';
import { stream } from '@utils/logger';
import { Routes } from '@common/interfaces/route.interface';
import modelsErrorMiddleware from '@middlewares/modelsError.middleware';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public allowedOrigins = [
    'https://ethiohope.com',
    'https://www.ethiohope.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://localhost:2707',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    // Production domains
    
    // ORIGIN env var can be a single URL or comma-separated list of additional URLs
    // e.g. ORIGIN=http://123.45.67.89  (useful for VPS IP access during testing)
    ...(ORIGIN ? ORIGIN.split(',').map(o => o.trim()).filter(Boolean) : []),
  ].filter(Boolean) as string[];

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT as string, { stream }));

    this.app.use(
      cors({
        origin: (origin, callback) => {
          // Allow internal requests (e.g. server-to-server) or requests from trusted origins
          if (!origin || this.allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            console.error(`[CORS Blocked] Origin: "${origin}" — Add it to ORIGIN env var or allowedOrigins list.`);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
          }
        },
        credentials: true, // Force true for secure chat syncing
        optionsSuccessStatus: 200,
      }),
    );


    this.app.use(hpp());
    this.app.use(compression());
    this.app.use((req, res, next) => {
      if (req.originalUrl === '/api/v1/payments/webhook') {
        next();
      } else {
        express.json({ limit: '5mb' })(req, res, next);
      }
    });
    this.app.use((req, res, next) => {
      if (req.originalUrl === '/api/v1/payments/webhook') {
        next();
      } else {
        express.urlencoded({ extended: true })(req, res, next);
      }
    });
    this.app.use(cookieParser());
    this.app.use('/assets', express.static(path.join(process.cwd(), 'public', 'assets')));
    this.app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
  }

  private initializeRoutes(routes: Routes[]) {
    const API_PREFIX = '/api/v1';
    routes.forEach(route => {
      this.app.use(`${API_PREFIX}${route.path}`, route.router);
    });

    // 👉 STATIC FRONTEND
    if (FRONTEND_BUILD_PATH) {
      this.app.use(express.static(path.resolve(__dirname, FRONTEND_BUILD_PATH as string)));

      // 👉 SPA fallback (IMPORTANT)
      this.app.get(/.*/, (req: Request, res: Response) => {
        if (NODE_ENV === 'development') {
          console.log(`Fallback triggered by: ${req.method} ${req.url}`);
        }
        res.sendFile(path.resolve(__dirname, FRONTEND_BUILD_PATH as string, 'index.html'));
      });
    }
  }

  private initializeSwagger() {
    const options: swaggerJSDoc.Options = {
      apis: ['src/routes/*.route.ts', 'src/dtos/*.dto.ts'],
      definition: {
        apis: ['swagger.json'],
        components: {
          securitySchemes: {
            bearerAuth: {
              bearerFormat: 'JWT',
              scheme: 'bearer',
              type: 'http',
            },
          },
        },
        info: {
          contact: { email: 'ethiohope@gmail.com' },
          description: '',
          license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Swagger Cousrses API',
          version: version,
        },
        openapi: '3.0.0',
        security: [
          {
            bearerAuth: [],
          },
        ],
        servers: [{ url: `http://localhost:${this.port}` }],
      },
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    this.app.get('/swagger.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerFile);
    });
  }

  private initializeErrorHandling() {
    this.app.use(modelsErrorMiddleware);
    this.app.use(errorMiddleware);
  }
}

export default App;
