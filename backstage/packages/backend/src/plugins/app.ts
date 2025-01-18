import { createRouter } from '@backstage/plugin-app-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    appPackageName: 'app',
  });
}


// import { githubAuthApiRef } from '@backstage/core-plugin-api';
// import { SignInPage } from '@backstage/core-components';

// const app = createApp({
//   components: {
//     SignInPage: props => (
//       <SignInPage
//         {...props}
//         auto
//         provider={{
//           id: 'github-auth-provider',
//           title: 'GitHub',
//           message: 'Sign in using GitHub',
//           apiRef: githubAuthApiRef,
//         }}
//       />
//     ),
//   },
//   // ..
// });