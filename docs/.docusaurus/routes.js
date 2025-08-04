import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/inteli-packs/docs',
    component: ComponentCreator('/inteli-packs/docs', 'c69'),
    routes: [
      {
        path: '/inteli-packs/docs',
        component: ComponentCreator('/inteli-packs/docs', 'ab7'),
        routes: [
          {
            path: '/inteli-packs/docs',
            component: ComponentCreator('/inteli-packs/docs', '282'),
            routes: [
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
    path: '*',
    component: ComponentCreator('*'),
  },
];
