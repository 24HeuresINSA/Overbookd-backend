import cors from "cors";

const ALLOWED_ORIGINS = ["http://localhost:3000", "https://localhost:3000"];

const mCors = cors({
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: ALLOWED_ORIGINS,
  preflightContinue: false,
});

// const mCors = cors();

export default mCors;
