// @ts-check
// Note: type annotations allow type checking in IDEs when disabled, they don't make any difference at runtime

const {themes} = require('@docusaurus/theme-classic');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TickerQ Demo Documentation',
  tagline: 'Background Job Processing with TickerQ in .NET',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://EbrahimDawoud.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'EbrahimDawoud',
  projectName: 'TickerQ-Docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          editUrl: 'https://github.com/EbrahimDawoud/TickerQ-Docs/tree/master/',
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
        title: 'TickerQ Demo',
        logo: {
          alt: 'TickerQ Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/EbrahimDawoud/TickerQ-Docs',
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
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/EbrahimDawoud/TickerQ-Docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} TickerQ Demo. Built with Docusaurus.`,
      },
      prism: {
        additionalLanguages: ['csharp', 'json', 'bash'],
      },
    }),
};

module.exports = config;
