const userHistory = require('../datasources/user_history');

const user_history = new userHistory();
const CarbonAPI = require('../datasources/carbon');
const carbonAPI = new CarbonAPI();

const example = async (carbonAPI, user) => {

    let res = await user_history.avg_co2_for_user(carbonAPI, user);
    console.log(res);

};

example(carbonAPI, "1");