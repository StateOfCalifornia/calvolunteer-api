const axios = require('axios'); 

// Params: 
  // virtual - Is either/or not both
  // location - Will always be based on ZIP
  // isCovid19 - Default to true
  // radius - in miles - ?
  // pageNumber
  // specialFlag = isCovid19 - takes only "covid19"
module.exports = async function (context, req) {
  if (req.query.location || req.query.virtual) {

    let pageNumber = req.query.pageNumber? req.query.pageNumber : 1;
    let isCovid19 = req.query.isCovid19 === 'true' ? 'covid19' : '';
    let numberOfResults = req.query.numberOfResults && req.query.numberOfResults <= 100 ? req.query.numberOfResults : 100;
    let radius = req.query.radius ? req.query.radius : 20;
    let virtual = req.query.virtual ? req.query.virtual : false;
    let categories = req.query.categories ? req.query.categories: '';
    let greatFor = req.query.greatFor ? req.query.greatFor : '';


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
        categories: [${categories}]
        pageNumber:${pageNumber}
        numberOfResults: ${numberOfResults}
        sortCriteria: relevance
        specialFlag: "${isCovid19}"
        radius: "${radius}"
        virtual: ${virtual}
        greatFor: [${greatFor}]
      }){
        resultsSize,
        currentPage,
        numberOfResults,
        opportunities{
          id,
          title, 
          categories,
          greatFor,
          specialFlag,
          description,
          volunteersNeeded,
          imageUrl,
          skillsNeeded,
          dateRange{
            endDate,
            endTime,
            ongoing,
            singleDayOpps,
            startDate,
            startTime
          },
          parentOrg {
            id,
            phoneNumber,
            imageUrl,
            url,
            mission,
            name,
            description,
            mission,
            name,
            location {
              city,
              country,
              postalCode,
              region,
              street1,
              street2,
              virtual,
            }
          },
          requirements {
            bgCheck,
            drLicense,
            minimumAge,
            orientation,
          },
         location{
            city,
            country,
            postalCode,
            region,
            street1,
            street2,
            virtual,
            postalCode,
            geoLocation {
              accuracy,
              latitude,
              longitude,
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

  }
    else {
        context.res = {
            status: 400,
            body: "location parameter is required"
        };
    }
};
