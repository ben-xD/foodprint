const CarbonAPI = require('../../datasources/carbon');
const carbonAPI = new CarbonAPI();

const get_all_user_data = async (user) => {

    const carbonModel = await this.getCarbonFootprintModel();
    let itemlList;
    try {
        await carbonModel.find({user_id: user}, (err, items) => {
            if (err) {
                throw err;
            }
            itemList = items;
        }).exec();

        return itemlList;

    } catch (err) {
        return undefined;
    }

};

const avg_co2_for_user = async (user) => {

    const user_data = get_all_user_data(user);
    let user_co2 = 0;
    let no_of_datapoints = 0;
    for (let i = 0; i < user_data.length; i++){
        let carbonResult = carbonAPI.searchData(user_data[i].item);
        if(carbonResult.carbonpkilo !== undefined){
            user_co2 += carbonResult.carbonpkilo;
            no_of_datapoints += 1;
        }
    }

    return user_co2/no_of_datapoints;

};