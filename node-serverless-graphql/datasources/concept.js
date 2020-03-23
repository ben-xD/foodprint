const axios = require('axios');

class ConceptAPI {

  constructor(MAX_NUMBER_OF_CONCEPTS = 10) {
    this.MAX_NUMBER_OF_CONCEPTS = MAX_NUMBER_OF_CONCEPTS;
    console.log('ConceptAPI: initialised with MAX_NUMBER_OF_CONCEPTS: ', this.MAX_NUMBER_OF_CONCEPTS);
  }

  async getConceptResponse(label) {
    return await axios.get(`http://api.conceptnet.io/query?start=/c/en/${label}&rel=/r/IsA&limit=${this.MAX_NUMBER_OF_CONCEPTS}&end=/c/en`);
  }

  async usedForResponse(label) {
    return await axios.get(`http://api.conceptnet.io/query?start=/c/en/${label}&rel=/r/UsedFor&limit=${this.MAX_NUMBER_OF_CONCEPTS}&end=/c/en`);
  }

  async getReletedTerms(label) {
    return await axios.get(`http://api.conceptnet.io/query?start=/c/en/${label}&rel=/r/RelatedTo&limit=${this.MAX_NUMBER_OF_CONCEPTS}&end=/c/en`);
  }

}

module.exports = ConceptAPI;
