import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import Img from "gatsby-image"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Foodprint</h1>
    <p>
      Calculate the carbon footprint of the food you eat, and see how your diet
      affects the planet.
    </p>
    <a href="https://play.google.com/store/apps/details?id=uk.orth.foodprint">
      <Img
        fixed={data.file.childImageSharp.fixed}
        alt="Available on Google Play store button"
      />
    </a>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}></div>
  </Layout>
)

export const query = graphql`
  query {
    file(relativePath: { eq: "play-store.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export default IndexPage
