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
        'ai-analysis',
        'security', 
        'testing',
        'devops',
        'automation',
      ],
    },
  ],
};

module.exports = sidebars;
