import app from './index.js';

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly (not when imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  });
}

export default app;