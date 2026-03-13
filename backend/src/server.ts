import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`K-Space CMS API running on port ${env.port}`);
});
