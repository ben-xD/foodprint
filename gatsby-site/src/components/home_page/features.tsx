import React from "react"

interface Props {}

const Features = (props: Props) => {
  return (
    <div className="text-center my-5">
      <p className="display-4 my-3">
        <strong>You</strong> have the power.
      </p>
      <p>
        ...to decide how much CO<sub>2</sub> gets produced by the food industry.
        Choose your food responsibly, save the planet. Foodprint is here to
        help. Analyse your food consumption habits and identify ways to reduce
        your CO2 emissions.
      </p>
    </div>
  )
}

export default Features
