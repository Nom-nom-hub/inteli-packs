/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['intro', 'installation', 'quick-start'],
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
      ],
    },
  ],
};

module.exports = sidebars;
