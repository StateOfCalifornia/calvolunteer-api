const axios = require('axios'); 

module.exports = async function (context, req) {
  if (req.query.location) {

    let pageNumber = req.query.pageNumber? req.query.pageNumber : 1;
    let isCovid19 = req.query.isCovid19 ? 'covid19' : '';
    let numberOfResults = req.query.numberOfResults && req.query.numberOfResults <= 100 ? req.query.numberOfResults : 100;
    let radius = req.query.radius ? req.query.radius : 15;

  // Params: 
    // virtual - Is either/or not both
    // location - Will always be based on ZIP
    // isCovid19 - Default to true
    // radius - in miles - ?
    // pageNumber
    // specialFlag = isCovid19 - takes only "covid19"

    const VOL_MATCH_API_KEY = process.env.VOL_MATCH_API_KEY;
    const VOL_MATCH_API_URL = process.env.VOL_MATCH_API_URL;

    const options = {
      headers: { 
        'X-api-key': VOL_MATCH_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const q = `query {
      searchOpportunities(input:{
        location: "${req.query.location}"
        categories:[]
        pageNumber:${pageNumber}
        numberOfResults: ${numberOfResults}
        sortCriteria: relevance
        specialFlag: "${isCovid19}"
        radius: "${radius}"
      }){
        resultsSize,
        opportunities{
          id,
          title, 
          categories,
          specialFlag,
          description,
          volunteersNeeded,
          location{
            city
            country
            postalCode
            region
            street1
            street2
            virtual
            postalCode
            geoLocation {
              accuracy
              latitude
              longitude
            }
          }
      }}
    }`;

    try {
      const response = await axios.post(VOL_MATCH_API_URL, JSON.stringify({query: q}), options)

      // If no results found
      if (!response.data.data.searchOpportunities) {
        context.res = {
          body: {
            resultsSize: 0,
            opportunities:[]
          }
        }
      } else {
        context.res = {
          body: response.data.data.searchOpportunities
        }
      }

    } catch(err) {
      context.res = {
        body: err
      }
    }
    

    // console.log('location: ',  response.data);


  }
    else {
        context.res = {
            status: 400,
            body: "location parameter is required"
        };
    }
};
