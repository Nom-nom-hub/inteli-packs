import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/inteli-packs/docs',
    component: ComponentCreator('/inteli-packs/docs', 'f74'),
    routes: [
      {
        path: '/inteli-packs/docs',
        component: ComponentCreator('/inteli-packs/docs', '82a'),
        routes: [
          {
            path: '/inteli-packs/docs',
            component: ComponentCreator('/inteli-packs/docs', 'a2f'),
            routes: [
              {
                path: '/inteli-packs/docs/features/ai-analysis',
                component: ComponentCreator('/inteli-packs/docs/features/ai-analysis', '9ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/features/automation',
                component: ComponentCreator('/inteli-packs/docs/features/automation', '139'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/features/devops',
                component: ComponentCreator('/inteli-packs/docs/features/devops', '48d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/features/security',
                component: ComponentCreator('/inteli-packs/docs/features/security', 'e74'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/inteli-packs/docs/features/testing',
                component: ComponentCreator('/inteli-packs/docs/features/testing', '84e'),
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
