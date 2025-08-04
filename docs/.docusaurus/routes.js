import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/inteli-packs/docs',
    component: ComponentCreator('/inteli-packs/docs', 'bf4'),
    routes: [
      {
        path: '/inteli-packs/docs',
        component: ComponentCreator('/inteli-packs/docs', '1bd'),
        routes: [
          {
            path: '/inteli-packs/docs',
            component: ComponentCreator('/inteli-packs/docs', '36c'),
            routes: [
              {
                path: '/inteli-packs/docs/ai-analysis',
                component: ComponentCreator('/inteli-packs/docs/ai-analysis', '8f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/automation',
                component: ComponentCreator('/inteli-packs/docs/automation', '08c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/devops',
                component: ComponentCreator('/inteli-packs/docs/devops', '199'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/installation',
                component: ComponentCreator('/inteli-packs/docs/installation', 'ead'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/intro',
                component: ComponentCreator('/inteli-packs/docs/intro', '7f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/quick-start',
                component: ComponentCreator('/inteli-packs/docs/quick-start', 'f1f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/security',
                component: ComponentCreator('/inteli-packs/docs/security', 'f4f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/testing',
                component: ComponentCreator('/inteli-packs/docs/testing', 'd0a'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/inteli-packs/',
    component: ComponentCreator('/inteli-packs/', 'fc4'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
