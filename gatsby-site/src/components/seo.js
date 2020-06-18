/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { withPrefix } from 'gatsby';
import { graphql, useStaticQuery } from "gatsby"

function SEO({ title }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteHeadline
          siteUrl
          siteDescription
          siteLanguage
          siteImage
        }
      }
    }
  `)

  const {
    title: siteTitle,
    siteUrl,
    siteDescription: description,
    siteLanguage,
    siteImage: defaultImage,
    author,
  } = site;

  const seo = {
    title: title,
    description: description,
    image: `${siteUrl}${defaultImage}`,
    url: siteUrl,
  };

  return (
    <Helmet
      title={title}
      titleTemplate={`%s | ${siteTitle}`}
    >
      <html lang={siteLanguage} />
      <meta name='description' content={description} />
      <meta name='image' content={seo.image} />
      <meta
        prefix='og: http://ogp.me/ns#'
        property='og:title'
        content={seo.title}
      />
      <meta
        prefix='og: http://ogp.me/ns#'
        property='og:url'
        content={seo.url}
      />
      <meta property='og:description' content={description} />
      <meta
        prefix='og: http://ogp.me/ns#'
        property='og:image'
        content={seo.image}
      />
      <meta
        prefix='og: http://ogp.me/ns#'
        property='og:type'
        content='website'
      />
      <meta property='og:image:alt' content={description} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={seo.title} />
      <meta name='twitter:url' content={siteUrl} />
      <meta name='twitter:description' content={seo.description} />
      <meta name='twitter:image' content={seo.image} />
      <meta name='twitter:image:alt' content={seo.description} />
      <meta name='twitter:creator' content={author} />
      <meta name='gatsby-theme' content='@lekoarts/gatsby-theme-minimal-blog' />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href={withPrefix(`/favicon-32x32.png`)}
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href={withPrefix(`/favicon-16x16.png`)}
      />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href={withPrefix(`/apple-touch-icon.png`)}
      />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href={withPrefix(`/apple-touch-icon-precomposed.png`)}
      />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
