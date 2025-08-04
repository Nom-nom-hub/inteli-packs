/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: ['installation', 'quick-start', 'configuration'],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/ai-analysis',
        'features/security',
        'features/testing',
        'features/devops',
        'features/automation',
        'features/plugins',
        'features/documentation',
      ],
    },
    {
      type: 'category',
      label: 'Usage',
      items: [
        'usage/cli-commands',
        'usage/interactive-mode',
        'usage/programmatic',
        'usage/examples',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/plugins',
        'advanced/profiles',
        'advanced/customization',
        'advanced/api-reference',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/contributing',
        'development/plugin-development',
        'development/testing',
        'development/deployment',
      ],
    },
  ],
};

export default sidebars;
