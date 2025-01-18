/*
2 * Copyright 1 The Backstage Authors
3 *
4 * Licensed under the Apache License, Version 2.0 (the "License");
5 * you may not use this file except in compliance with the License.
6 * You may obtain a copy of the License at
7 *
8 *     http://www.apache.org/licenses/LICENSE-2.0
9 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    HomePageToolkit,
    HomePageCompanyLogo,
    HomePageStarredEntities,
    TemplateBackstageLogo,
    TemplateBackstageLogoIcon,
  } from '@backstage/plugin-home';
  import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
  import { Content, Page, InfoCard } from '@backstage/core-components';
  import {
    starredEntitiesApiRef,
    MockStarredEntitiesApi,
    entityRouteRef,
    catalogApiRef,
  } from '@backstage/plugin-catalog-react';
  import { configApiRef } from '@backstage/core-plugin-api';
  import { ConfigReader } from '@backstage/config';
  import { HomePageSearchBar, searchPlugin } from '@backstage/plugin-search';
  import {
    searchApiRef,
    SearchContextProvider,
  } from '@backstage/plugin-search-react';
  import { stackOverflowApiRef, HomePageStackOverflowQuestions } from '@backstage/plugin-stack-overflow';
  import { Grid, makeStyles } from '@material-ui/core';
  import React, { ComponentType, PropsWithChildren } from 'react';
  import MyCustomLogoFull from './logo/uoledtech_verde.png';
  import jira from './tools/Jiraicon.png'
  import github from './tools/github-icon.png'
  import sonarqube from './tools/sonar3.png'
  import newrelic from './tools/nr.png'
  import loop from './tools/loop.png'
  import jenkins from './tools/jenkins.png'
  import newRelicProd from './tools/perf-metrics.png'
  import vault from './tools/vault.svg'

 const toolsVar = [{
    url: 'https://newrelic.com/welcome-back',
    label: 'New Relic',
    icon: <img src={newrelic} />,
  }, {
    url: 'https://sonarqube.edtech.com.br/',
    label: 'SonarQube',
    icon: <img src={sonarqube} />,
  },
  {
    url: 'https://github.com/',
    label: 'GitHub',
    icon: <img src={github} />,
  },
  {
    url: 'https://uoledtech.atlassian.net/jira/servicedesk/projects/CH/queues/custom/410',
    label: 'Jira',
    icon: <img src={jira} />,
  },
  {
    url: 'https://loop.microsoft.com/p/eyJ3Ijp7InUiOiJodHRwczovL3VvbGluYy5zaGFyZXBvaW50LmNvbS8%2FbmF2PWN6MGxNa1ltWkQxaUlUTTBSaTFVYkVoa01qQmxWWEpRYlVrMGJtNWhSUzFoUVV0ZmJISmphV3hJWjJoUVZ6QlhPVmxuYTI1blZFcEdObGczVjAxUlNVdDVjVVYwZEROc1gyZ21aajB3TVRSQlVrMDJNMWN5UTA1T1VFSlJSRlpNVWtaSlZUTkhVRlEzVlZwWFRscFhKbU05Sm1ac2RXbGtQVEUlM0QiLCJyIjpmYWxzZX0sInAiOnsidSI6Imh0dHBzOi8vdW9saW5jLnNoYXJlcG9pbnQuY29tLzpmbDovci9jb250ZW50c3RvcmFnZS9DU1BfNGU3ZTgxZGYtZGQ1MS00N2RiLTk0YWMtZjk4OGUyNzlkYTEzL0JpYmxpb3RlY2ElMjBkZSUyMERvY3VtZW50b3MvTG9vcEFwcERhdGEvUCVDMyVBMWdpbmElMjBzZW0lMjB0JUMzJUFEdHVsby5mbHVpZD9kPXdlZThkOWE4ZTVjOWM0ZTdmOWI2NWZkZGEzZmEyZjg2MiZjc2Y9MSZ3ZWI9MSZuYXY9Y3owbE1rWmpiMjUwWlc1MGMzUnZjbUZuWlNVeVJrTlRVRjgwWlRkbE9ERmtaaTFrWkRVeExUUTNaR0l0T1RSaFl5MW1PVGc0WlRJM09XUmhNVE1tWkQxaUlUTTBSaTFVYkVoa01qQmxWWEpRYlVrMGJtNWhSUzFoUVV0ZmJISmphV3hJWjJoUVZ6QlhPVmxuYTI1blZFcEdObGczVjAxUlNVdDVjVVYwZEROc1gyZ21aajB3TVRSQlVrMDJNMVZQVkV0SE5qVklRelJRTlVoS1YxcFFOVE5KTnpKR05rUkRKbU05SlRKR0ptWnNkV2xrUFRFbVlUMU1iMjl3UVhCd0puQTlKVFF3Wm14MWFXUjRKVEpHYkc5dmNDMXdZV2RsTFdOdmJuUmhhVzVsY2laNFBTVTNRaVV5TW5jbE1qSWxNMEVsTWpKVU1GSlVWVWg0TVdJeWVIQmliVTExWXpKb2FHTnRWbmRpTW14MVpFTTFhbUl5TVRoWmFVVjZUa1ZaZEZaSGVFbGFSRWwzV2xaV2VWVkhNVXBPUnpWMVdWVlZkRmxWUmt4WU1uaDVXVEpzYzFOSFpHOVZSbU4zVm5wc1dsb3lkSFZhTVZKTFVtcGFXVTR4WkU1VlZXeE1aVmhHUm1SSVVYcGlSamx2WmtSQmVFNUZSbE5VVkZsNlZucEtSRlJyTlZGUmJFWkZWbXQ0VTFKcmJGWk5NR1JSVmtSa1ZsZHNaRTlYYkdNbE0wUWxNaklsTWtNbE1qSnBKVEl5SlROQkpUSXlOakZtT1RZNU1qSXRPR1k1WlMwME5UQTRMV0kwT1dNdFltVXhNalEzWXpJeU5qTmhKVEl5SlRkRSIsInIiOmZhbHNlfSwiaSI6eyJpIjoiNjFmOTY5MjItOGY5ZS00NTA4LWI0OWMtYmUxMjQ3YzIyNjNhIn19',
    label: 'Loop',
    icon: <img src={loop} />,
  },
{
  url: 'https://onenr.io/0ERz41OxdQr',
  label: 'Jenkins',
  icon: <img src={jenkins}/>
},
{
  url: 'https://onenr.io/0oR87LgVowG',
  label: 'Métricas Produção',
  icon: < img src={newRelicProd}/>

},
{
  url: 'https://vault.edtech.com.br',
  label: 'Vault',
  icon: < img src={vault}/>

}]
  
  
  const entities = [
    {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'mock-starred-entity',
        title: 'Mock Starred Entity!',
      },
    },
    {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'mock-starred-entity-2',
        title: 'Mock Starred Entity 2!',
      },
    },
    {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'mock-starred-entity-3',
        title: 'Mock Starred Entity 3!',
      },
    },
    {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'mock-starred-entity-4',
        title: 'Mock Starred Entity 4!',
      },
    },
  ];
  
  const mockCatalogApi = {
    getEntities: async () => ({ items: entities }),
  };
  
  const mockStackOverflowApi = {
    listQuestions: async () => [
      {
        title: 'Customizing Spotify backstage UI',
        link: 'stackoverflow.question/1',
        answer_count: 0,
        tags: ['backstage'],
        owner: { 'some owner': 'name' },
      },
      {
        title: 'Customizing Spotify backstage UI',
        link: 'stackoverflow.question/1',
        answer_count: 0,
        tags: ['backstage'],
        owner: { 'some owner': 'name' },
      },
    ],
  };
  
  const starredEntitiesApi = new MockStarredEntitiesApi();
  starredEntitiesApi.toggleStarred('component:default/example-starred-entity');
  starredEntitiesApi.toggleStarred('component:default/example-starred-entity-2');
  starredEntitiesApi.toggleStarred('component:default/example-starred-entity-3');
  starredEntitiesApi.toggleStarred('component:default/example-starred-entity-4');
  
  export default {
    title: 'Plugins/Home/Templates',
    decorators: [
      (Story: ComponentType<PropsWithChildren<{}>>) =>
        wrapInTestApp(
          <>
            <TestApiProvider
              apis={[
                [stackOverflowApiRef, mockStackOverflowApi],
                [catalogApiRef, mockCatalogApi],
                [starredEntitiesApiRef, starredEntitiesApi],
                [searchApiRef, { query: () => Promise.resolve({ results: [] }) }],
                [
                  configApiRef,
                  new ConfigReader({
                    stackoverflow: {
                      baseUrl: 'https://api.stackexchange.com/2.2',
                    },
                  }),
                ],
              ]}
            >
              <Story />
            </TestApiProvider>
          </>,
          {
            mountedRoutes: {
              '/hello-company': searchPlugin.routes.root,
              '/catalog/:namespace/:kind/:name': entityRouteRef,
            },
          },
        ),
    ],
  };
  
  const useStyles = makeStyles(theme => ({
    searchBarInput: {
      maxWidth: 'vw',
      margin: 'auto',
      backgroundColor: theme.palette.background.paper,
      borderRadius: 'px',
      boxShadow: theme.shadows[1],
    },
    searchBarOutline: {
      borderStyle: 'none'
    }
  }));
  
  const useLogoStyles = makeStyles(theme => ({
    container: {
      margin: theme.spacing(5, 0),
    },
    svg: {
      width: 'auto',
      height: 100 ,
    },
    path: {
      fill: '#7df3e1',
    },
  }));
  
  export const HomePage = () => {
    const classes = useStyles();
    const { svg, path, container } = useLogoStyles();
  
    return (
      <SearchContextProvider>
        <Page themeId="home">
          <Content>
            <Grid container justifyContent="center" spacing={6}>
              <HomePageCompanyLogo
                className={container}
                logo={<img src={MyCustomLogoFull} />}
              />
              <Grid container item xs={12} justifyContent='center'>
                <HomePageSearchBar
                  InputProps={{ classes: { root: classes.searchBarInput, notchedOutline: classes.searchBarOutline }}}
                  placeholder="Search"
                />
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={12} md={6}>
                  <HomePageStarredEntities />
                </Grid>
                <Grid item xs={12} md={6}>
                  <HomePageToolkit
                    tools={toolsVar}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoCard title="Links Importantes">
                    {
                     <ul>
                     <h3><li>DNS dos Serviços</li></h3>
                     <ul>
                     
                     <h3><li><a href='https://onenr.io/0MRNNDap2Rn' target="_blank">Desenvolvimento</a></li></h3>
                     <h3><li><a href='https://onenr.io/07wkZbygmQL' target="_blank">Homologação</a></li></h3>
                     <h3><li><a href='https://onenr.io/0BQ1zPmvlwx' target="_blank">Produção</a></li></h3>
 
                     </ul>
                     <h3><li><a href='https://loop.cloud.microsoft/p/eyJ3Ijp7InUiOiJodHRwczovL3VvbGluYy5zaGFyZXBvaW50LmNvbS8%2FbmF2PWN6MGxNa1ltWkQxaUlUTTBSaTFVYkVoa01qQmxWWEpRYlVrMGJtNWhSUzFoUVV0ZmJISmphV3hJWjJoUVZ6QlhPVmxuYTI1blZFcEdObGczVjAxUlNVdDVjVVYwZEROc1gyZ21aajB3TVRSQlVrMDJNMWN5UTA1T1VFSlJSRlpNVWtaSlZUTkhVRlEzVlZwWFRscFhKbU05Sm1ac2RXbGtQVEUlM0QiLCJyIjpmYWxzZX0sInAiOnsidSI6Imh0dHBzOi8vdW9saW5jLnNoYXJlcG9pbnQuY29tLzpmbDovci9jb250ZW50c3RvcmFnZS9DU1BfNGU3ZTgxZGYtZGQ1MS00N2RiLTk0YWMtZjk4OGUyNzlkYTEzL0JpYmxpb3RlY2ElMjBkZSUyMERvY3VtZW50b3MvTG9vcEFwcERhdGEvU2VtJTIwdCVDMyVBRHR1bG8ubG9vcD9kPXdmNzc0M2I3NTE3NmQ0MDhkYjQ3YjcxZjgzNDRjOWFmMyZjc2Y9MSZ3ZWI9MSZuYXY9Y3owbE1rWmpiMjUwWlc1MGMzUnZjbUZuWlNVeVJrTlRVRjgwWlRkbE9ERmtaaTFrWkRVeExUUTNaR0l0T1RSaFl5MW1PVGc0WlRJM09XUmhNVE1tWkQxaUlUTTBSaTFVYkVoa01qQmxWWEpRYlVrMGJtNWhSUzFoUVV0ZmJISmphV3hJWjJoUVZ6QlhPVmxuYTI1blZFcEdObGczVjAxUlNVdDVjVVYwZEROc1gyZ21aajB3TVRSQlVrMDJNMVJXU0U0eVVFOHpTVmhTVmtGTVNUWXpVamRCTWtWYVIxaFVKbU05SlRKR0ptWnNkV2xrUFRFbVlUMU1iMjl3UVhCd0puQTlKVFF3Wm14MWFXUjRKVEpHYkc5dmNDMXdZV2RsTFdOdmJuUmhhVzVsY2laNFBTVTNRaVV5TW5jbE1qSWxNMEVsTWpKVU1GSlVWVWg0TVdJeWVIQmliVTExWXpKb2FHTnRWbmRpTW14MVpFTTFhbUl5TVRoWmFVVjZUa1ZaZEZaSGVFbGFSRWwzV2xaV2VWVkhNVXBPUnpWMVdWVlZkRmxWUmt4WU1uaDVXVEpzYzFOSFpHOVZSbU4zVm5wc1dsb3lkSFZhTVZKTFVtcGFXVTR4WkU1VlZXeE1aVmhHUm1SSVVYcGlSamx2WmtSQmVFNUZSbE5VVkZsNlZucEtSRlJyTlZGUmJFWkZWbXQ0VTFKcmJGWk5NR1JSVmtSa1ZsZHNaRTlYYkdNbE0wUWxNaklsTWtNbE1qSnBKVEl5SlROQkpUSXlZVFl4T1dFNU9HSXROVGN4TUMwME9UWTNMV0U1T0RndE5qQmxNamN4Tm1abU5HUTRKVEl5SlRkRSIsInIiOmZhbHNlfSwiaSI6eyJpIjoiYTYxOWE5OGItNTcxMC00OTY3LWE5ODgtNjBlMjcxNmZmNGQ4In19' target="_blank">Backstage Docs</a></li></h3>
                     <h3><li><a href='https://glowing-fishstick-934zp2g.pages.github.io/starter-topic.html' target="_blank">Fórum Tech</a></li></h3>
                   </ul>

                      
                    }
                    <div style={{ height: 370 }} />
                  </InfoCard>
                </Grid>
                <Grid item xs={12} md={6}>
		<InfoCard title="Platform Engineering">
                    {/* placeholder for content */}
                    <div style={{ height: 370 }} />
                  </InfoCard>                  
                </Grid>
              </Grid>
            </Grid>
          </Content>
        </Page>
      </SearchContextProvider>
    );
  };
