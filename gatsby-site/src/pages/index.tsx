import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import "./index.css"
import Flow from "../components/home_page/flow"
import Features from "../components/home_page/features"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <div className="text-center my-5">
      <h1 className="display-3 text-center mx-auto" style={{ maxWidth: 600 }}>
        Eat responsibly. Save the 🌍.
      </h1>
      <h1 className="lead text-center mx-auto" style={{ maxWidth: 400 }}>
        Food production is responsible for{" "}
        <a href="https://ourworldindata.org/food-ghg-emissions">
          26% of global greenhouse gas emissions.
        </a>
      </h1>
      <h1>
        <a
          href="https://www.youtube.com/watch?v=B0_mkVJN1HE&feature=youtu.be"
          type="button"
          className="btn btn-primary btn-lg"
          role="button"
        >
          Watch the video
        </a>
      </h1>
    </div>
    <Features />
    <Flow />
    <div
      className="text-center my-5"
      style={{
        backgroundSize: "100%",
      }}
    >
      <p className="display-4">
        <strong>Join us</strong> on the mission.
      </p>

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
    <div className="text-center mx-auto" style={{ maxWidth: 600 }}>
      <p>
        <strong>Built by</strong>{" "}
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
        , <strong>for the environment.</strong>
      </p>
      <p>
        <strong>Supervised by</strong> Dr Anandha Gopalan @ Imperial College
        London
      </p>
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
