import PropTypes from "prop-types"
import React from "react"
import { Link } from "gatsby"

const Header = ({ siteTitle, data }) => {
  console.log({ data })

  return (
    <nav class="navbar navbar-expand-md navbar-light bg-light mb-3">
      <Link style={{ display: 'flex', padding: 0, alignItems: "center" }} class="navbar-brand" activeClassName="navbar-brand" to="/">{siteTitle}</Link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ml-auto">
          <Link partiallyActive class="nav-item nav-link disabled" activeClassName="nav-item nav-link active" to={"/video"}>Video (coming soon)</Link>
          <a class="nav-item nav-link" href="https://github.com/ben-xD/foodprint/">GitHub</a>
          <Link partiallyActive class="nav-item nav-link" activeClassName="nav-item nav-link active" to={"/privacy-policy"}>Privacy Policy</Link>
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
