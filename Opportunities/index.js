const axios = require('axios');
const query = require('./query')
const handler = require('./handler');

const options = {
  headers: {
    'X-api-key': process.env.VOL_MATCH_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};




// Params: 
// virtual - Is either/or not both
// location - Will always be based on ZIP
// covid19Flag - Default to true
// radius - in miles - ?
// pageNumber
// specialFlag = covid19Flag - takes only "covid19"
module.exports = async function (context, req) {
  context.log('Opp Request Headers = ', JSON.stringify(req.headers));
  context.log('Opp Request Query = ', JSON.stringify(req.query));

  const VOL_MATCH_API_URL = process.env.VOL_MATCH_API_URL;

  var errorMessage = handler.validateRequest(req);
  if (errorMessage) {
    context.res = {
      status: 400,
      body: "location or virtual parameter is required"
    };
    context.log('Opp Request return = ', JSON.stringify(context.res));
    return;
  }

  try {
    // get parameter object from request
    var params = handler.getParameters(req);

    //get graph ql 
    const vmQuery = query.generateQuery(params);
    var jsonQuery = JSON.stringify({ query: vmQuery });

    // call volunteermatch api
    const volMatchResponse = await axios.post(VOL_MATCH_API_URL, jsonQuery, options)

    //get opportunities and process them
    var searchOpportunities = volMatchResponse.data.data.searchOpportunities;
    var opportunitiesList = searchOpportunities.opportunities;
    var processedOpportunitiesList = handler.processOpportunities(opportunitiesList, process.env.SKIP_CUSTOM_FIELDS_FILTER);

    //adjust numbers and list based on processed list
    searchOpportunities.numberOfResults = processedOpportunitiesList.length;
    searchOpportunities.opportunities = processedOpportunitiesList;

    //return data...
    context.res = {
      status: volMatchResponse.status,
      body: searchOpportunities
    }
  } catch (err) {
  console.log(err);
  context.res = {
    status: err.response.status,
    body: err
  }
}
context.log('Opp Request return = ', JSON.stringify(context.res).substr(0, 200));
};
