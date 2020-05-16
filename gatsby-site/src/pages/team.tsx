// Gatsby supports TypeScript natively!
import React from "react"
import { PageProps, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Team = (props: PageProps) => (
  <Layout>
    <SEO title="Team" />
    <h1>Team</h1>
    <p>👋 Hey there!</p>
    <p>
      <a href="mailto:support@orth.uk?subject=Foodprint%20Support">Email us</a>{" "}
      with your questions or concerns.
    </p>
  </Layout>
)

export default Team
