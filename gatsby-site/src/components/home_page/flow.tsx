import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import Img from "gatsby-image"

interface Props {}

const Flow = (props: Props) => {
  return (
    <StaticQuery
      query={graphql`
        query {
          barcode: file(relativePath: { eq: "barcode.png" }) {
            childImageSharp {
              fluid(quality: 100, maxWidth: 250) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          recipe: file(relativePath: { eq: "recipe.png" }) {
            childImageSharp {
              fluid(quality: 100, maxWidth: 250) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          unpackagedFood: file(relativePath: { eq: "unpackagedFood.png" }) {
            childImageSharp {
              fluid(quality: 100, maxWidth: 250) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `}
      render={data => (
        <div className="text-center my-5">
          <p className="display-4">
            Foodprint knows <strong>3 things.</strong>
          </p>
          <div className="row">
            <div
              className="d-flex flex-column col-sm justify-content-center"
              style={{
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Img
                fadeIn={true}
                className="mb-3 mx-auto"
                style={{
                  paddingBottom: 0,
                  width: 150,
                  display: "flex",
                }}
                fluid={data.unpackagedFood.childImageSharp.fluid}
                alt="Picture of a barcode"
              />
              <strong>Unpackaged food photos</strong>
              <p>
                Take a photo of any food your eye spies. Remember to take a
                photo <strong>before</strong> you eat it.
              </p>
            </div>
            <div
              className="d-flex flex-column col-sm justify-content-center"
              style={{ alignItems: "center", textAlign: "center" }}
            >
              <Img
                fadeIn={true}
                className="mb-3 mx-auto"
                style={{
                  paddingBottom: 0,
                  width: 150,
                  display: "flex",
                }}
                fluid={data.barcode.childImageSharp.fluid}
                alt="Picture of a barcode"
              />
              <strong>Barcodes</strong>
              <p>
                The camera doubles as a barcode scanner so you can scan the
                packet of Oreos you had last night.
              </p>
            </div>
            <div
              className="d-flex flex-column col-sm justify-content-center"
              style={{ alignItems: "center", textAlign: "center" }}
            >
              <Img
                fadeIn={true}
                className="mb-3 mx-auto"
                style={{
                  paddingBottom: 0,
                  width: 150,
                  display: "flex",
                }}
                fluid={data.recipe.childImageSharp.fluid}
                alt="Picture of a barcode"
              />
              <strong>Recipes</strong>
              <p>
                Recognise the CO<sub>2</sub> impact of recipes before you decide
                to cook them.
              </p>
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default Flow
