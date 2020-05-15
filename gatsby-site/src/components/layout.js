/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}>
      <Header siteTitle={data.site.siteMetadata.title} />
      <main
        style={{
          margin: `0 auto`,
          width: '100%',
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
          flexGrow: 1
        }}
      >
        {children}
      </main>
      <footer class="mb-3" style={{ textAlign: "center" }}>
        © {new Date().getFullYear()} Foodprint
        </footer>
    </ div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
