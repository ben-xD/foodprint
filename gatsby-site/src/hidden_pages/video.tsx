import React from "react"
import { PageProps, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

interface Props {}

const video = (props: Props) => {
  return (
    <Layout>
      <SEO title="Team" />
      <h1>Our video</h1>
      <iframe
        width="900"
        height="506.25"
        src="https://www.youtube.com/embed/B0_mkVJN1HE"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </Layout>
  )
}

export default video
