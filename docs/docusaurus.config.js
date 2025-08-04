// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Inteli-Packs',
  tagline: 'Smart developer assistant for Node.js project optimization using Gemini AI',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://nom-nom-hub.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/inteli-packs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nom-nom-hub', // Usually your GitHub org/user name.
  projectName: 'inteli-packs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/Nom-nom-hub/inteli-packs/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/Nom-nom-hub/inteli-packs/tree/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Inteli-Packs',
        logo: {
          alt: 'Inteli-Packs Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          { to: '/docs/intro', label: 'Documentation', position: 'left' },
          {
            href: 'https://github.com/Nom-nom-hub/inteli-packs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
              {
                label: 'Installation',
                to: '/docs/installation',
              },
              {
                label: 'Quick Start',
                to: '/docs/quick-start',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Nom-nom-hub/inteli-packs',
              },
              {
                label: 'Issues',
                href: 'https://github.com/Nom-nom-hub/inteli-packs/issues',
              },
              {
                label: 'Discussions',
                href: 'https://github.com/Nom-nom-hub/inteli-packs/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Nom-nom-hub/inteli-packs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Inteli-Packs. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
