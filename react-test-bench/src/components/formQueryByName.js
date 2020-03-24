import React from "react";
import ApolloClient from "apollo-boost";
import { gql } from 'apollo-boost'

const SERVER = "server";
const PRODUCT = "product";

// GraphQL schema for correction mutation
const POST_CORRECTION_MUTATION = gql`
mutation PostCorrectionMutation($name: String!) {
  postCorrection(name: $name) {
    product {
      name
    }
    carbonFootprintPerKg
  }
}
`;

export class FormQueryByName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      [SERVER]: 'http://localhost:4000/',
      [PRODUCT]: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleSubmit(event) {
    console.log('\nserver:' + this.state[SERVER] + '\nproduct name: ' + this.state[PRODUCT]);
    event.preventDefault();

    const client = new ApolloClient({
      uri: 'http://localhost:4000/',
    });

    client
      .mutate({
        mutation: POST_CORRECTION_MUTATION,
        variables: {
          name: this.state[PRODUCT]
        }
      })
      .then(result => console.log(result));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Server:
          <select name={SERVER} type="text" value={this.state[SERVER]} onChange={this.handleChange}>
            <option value="http://localhost:4000/"> http://localhost:4000/</option>
          </select>
        </label>
        {/*<br/>*/}
        <label>
          Product name:
          <input name={PRODUCT} type="text" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
