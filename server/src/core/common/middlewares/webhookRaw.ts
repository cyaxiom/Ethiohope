import express from 'express';

export const webhookRawMiddleware = express.raw({ type: 'application/json' });
