import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
//import { createNewFileAction } from './scaffolder/actions/custom';
import { CatalogClient } from '@backstage/catalog-client';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import {createHttpBackstageAction} from "@roadiehq/scaffolder-backend-module-http-request"
import {ContainerRunner} from "@backstage/backend-common"

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({ discoveryApi: env.discovery });
  const integrations = ScmIntegrations.fromConfig(env.config);

  /*
  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });
  */
 
  const actions = [
    createHttpBackstageAction({discovery: env.discovery }),
      ...createBuiltinActions({
          catalogClient: catalogClient,
          integrations: integrations,
          config: env.config,
          reader: env.reader,
      }),
  ];

  return createRouter({
    actions,
    catalogClient: catalogClient,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
  });
}