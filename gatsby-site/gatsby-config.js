module.exports = {
  siteMetadata: {
    title: `Foodprint`,
    description: `Calculate the carbon footprint of your diet. Save the planet.`,
    author: `@orth.uk`,
    siteHeadline: `Foodprint - track the carbon footprint of your diet.`,
    siteUrl: `https://foodprint.orth.uk`,
    siteDescription: `Foodprint - a mobile app to track the carbon footprint of your diet.`,
    siteLanguage: `en`,
    siteImage: '/preview.png'
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#117F13`,
        theme_color: `#117F13`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
