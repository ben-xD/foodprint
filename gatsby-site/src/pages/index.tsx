import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import "./index.css"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Foodprint: eat responsibly to save the planet 🌍</h1>
    <p>
      <i>
        Food production is responsible for{" "}
        <a href="https://ourworldindata.org/food-ghg-emissions">
          {" "}
          26% of global greenhouse gas emissions.{" "}
        </a>
      </i>
    </p>
    <div id="foodprint-description">
      <p>
        You have the power to decide how much CO<sub>2</sub> gets produced by
        the food industry. Choose your food responsibly, save the planet.
        Foodprint is here to help you in that mission ✅
      </p>
      <p>
        <ul>
          <li>
            Simply take a picture of raw food or scan a barcode of processed
            food to see its carbon footprint{" "}
          </li>
          <li>
            Analyse your food consumption habits and identify ways to reduce
            your CO<sub>2</sub> emissions
          </li>
          <li>
            View the CO<sub>2</sub> impact of your new recipes even before you
            decide to cook them
          </li>
        </ul>
      </p>
      <p>Join us on the mission! 🚀</p>
    </div>
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
    <div id="developers">
      <p>
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/alba-garc%C3%ADa-rey-0596bb109/"
          target="_blank"
        >
          Alba García Rey
        </a>
        ,{" "}
        <a href="https://www.linkedin.com/in/bbutterworth/" target="_blank">
          Ben Butterworth
        </a>
        ,{" "}
        <a href="https://www.linkedin.com/in/daniel-hausner/" target="_blank">
          Daniel Hausner
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/laura-caune-4a143a1aa/"
          target="_blank"
        >
          Laura Caune
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/sandrine-chausson/"
          target="_blank"
        >
          Sandrine Chausson
        </a>
        ,{" "}
        <a href="https://www.linkedin.com/in/sandercoates/" target="_blank">
          Sander Coates
        </a>
      </p>
      <p>Supervised by Dr Anandha Gopalan @ Imperial College London</p>
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
