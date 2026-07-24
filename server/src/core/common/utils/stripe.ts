import Stripe from 'stripe';
import { STRIPE_PRIVATE_KEY } from '@config/env';

if (!STRIPE_PRIVATE_KEY) {
  throw new Error('STRIPE_PRIVATE_KEY is not defined in environment variables');
}

const stripe = new Stripe(STRIPE_PRIVATE_KEY, {
  apiVersion: '2024-06-20' as any, // Using a stable API version format
});

export default stripe;
