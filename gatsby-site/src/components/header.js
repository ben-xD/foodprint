import PropTypes from "prop-types"
import React from "react"
import Img from "gatsby-image"
import { StaticQuery, graphql, Link } from "gatsby"

const Header = ({ siteTitle, data }) => {
  console.log({ data })

  const getLogo = () => (
    <StaticQuery
      query={graphql`
        query {
          logo: file(relativePath: { eq: "favicon.png" }) {
            childImageSharp {
              fluid(quality: 100, maxWidth: 250) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `}
      render={data => (
        <Img fadeIn={true} style={{ margin: "0 12px 0 0", paddingBottom: 0, width: 40, display: "flex" }} fluid={data.logo.childImageSharp.fluid} alt="Foodprint Logo" />
      )}
    />
  )

  return (
    <nav class="navbar navbar-expand-md navbar-light bg-light mb-3">
      <Link style={{ display: 'flex', padding: 0, alignItems: "center" }} class="navbar-brand" activeClassName="navbar-brand" to="/">{getLogo()}{siteTitle}</Link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ml-auto">
          <Link class="nav-item nav-link" activeClassName="nav-item nav-link active" to={"/team/"}>Team</Link>
          <Link class="nav-item nav-link" activeClassName="nav-item nav-link active" to={"/privacy-policy/"}>Privacy Policy</Link>
        </div>
      </div>
    </nav>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}


export default Header
