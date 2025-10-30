// Vercel serverless function wrapper for Express app
import '../dist/index.js';

export default async function handler(req, res) {
  const app = (await import('../dist/index.js')).default;
  return app(req, res);
}
