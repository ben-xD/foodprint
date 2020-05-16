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
  </Layout>
)

export default Team
