/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['installation', 'configuration'],
    },
    {
      type: 'category',
      label: 'Job Types',
      items: ['cron-jobs', 'time-jobs'],
    },
    {
      type: 'category',
      label: 'Advanced Features',
      items: ['exception-handling', 'dashboard'],
    },
    'api-reference',
  ],
};

module.exports = sidebars;
