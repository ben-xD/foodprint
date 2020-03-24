const carbon_api = require("../datasources/carbon.js");

carbon = new carbon_api();
let carbonSchema;

carbon.connect();
let new_data = [{item: "Pasta", carbonpkilo: 3.4, categories: "2000", label: "testing"}];
carbon.insert_in_DB(new_data);
carbon.disconnect();