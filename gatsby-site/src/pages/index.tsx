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
    <div
      className=""
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <a
        style={{ lineHeight: 0, margin: 8 }}
        href="https://play.google.com/store/apps/details?id=uk.orth.foodprint"
      >
        <Img
          fixed={data.playStoreImage.childImageSharp.fixed}
          alt="Available on Google Play Store button"
        />
      </a>
      <a
        href="https://apps.apple.com/us/app/foodprint/id1510153419?ls=1"
        style={{ lineHeight: 0, margin: 8 }}
      >
        <Img
          fixed={data.iosStoreImage.childImageSharp.fixed}
          alt="Available on iOS Store button"
        />
      </a>
    </div>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}></div>
  </Layout>
)

export const query = graphql`
  query {
    playStoreImage: file(relativePath: { eq: "play-store.png" }) {
      childImageSharp {
        fixed(quality: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    iosStoreImage: file(relativePath: { eq: "ios-store.png" }) {
      childImageSharp {
        fixed(quality: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export default IndexPage
