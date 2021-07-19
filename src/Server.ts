import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import BaseRouter from './routes';
import logger from '@shared/Logger';
import mCors from "./cors";


const app = express();
const { BAD_REQUEST } = StatusCodes;



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
// CORS
app.use(mCors)

// Keycloak
import session, {MemoryStore} from 'express-session';
import Keycloak from "keycloak-connect"

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const memoryStore = new MemoryStore();
app.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    session({
        secret: "abcdefageguhdok654sd65_djzuéOdnjzKIJDjneé0I",
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
);

const keycloak = new Keycloak({
    store: memoryStore
});

app.use(
    keycloak.middleware({
        logout: "/logout",
        admin: "/"
    })
);

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});


/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

// const viewsDir = path.join(__dirname, 'views');
// app.set('views', viewsDir);
// const staticDir = path.join(__dirname, 'public');
// app.use(express.static(staticDir));
// app.get('*', (req: Request, res: Response) => {
//     res.sendFile('index.html', {root: viewsDir});
// });

// Export express instance

// snentry

Sentry.init({
    dsn: "https://31596a84268a40daaca6488fb5cbbb28@o923867.ingest.sentry.io/5871653",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  
  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
  
  // All controllers should live here
  app.get("/", function rootHandler(req, res) {
    res.end("Hello world!");
  });
  
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
  
  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });


export default app;
