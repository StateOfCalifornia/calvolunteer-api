const axios = require('axios');

const options = {
  headers: {
    'X-api-key': process.env.VOL_MATCH_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const filterCAOrg = (opportunities) => {
  var caOnlyOrgs = opportunities.filter(opp => opp.parentOrg.location.region === 'CA');
  return caOnlyOrgs;
}

const generateQuery = (params) => `query {
  searchOpportunities(input:{
    location: "${params.location}"
    categories: [${params.categories}]
    pageNumber:${params.pageNumber}
    numberOfResults: ${params.numberOfResults}
    specialFlag: "${params.isCovid19}"
    radius: "${params.radius}"
    virtual: ${params.virtual}
    greatFor: [${params.greatFor}],
    keywords: "${params.keywords}",
    skills: [${params.skills}],
    sortCriteria: container, 
    sortByContainers: ["tier0ca", "tier1ca", "tier2ca", "tier3ca"], 
}){
    resultsSize,
    currentPage,
    numberOfResults,
    opportunities{
      id,
      title, 
      container,
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
      },
      customFields {
        fieldId
        fieldLabel
        fieldType
        required
        choices
      }
 }}
}`;


// Params: 
// virtual - Is either/or not both
// location - Will always be based on ZIP
// isCovid19 - Default to true
// radius - in miles - ?
// pageNumber
// specialFlag = isCovid19 - takes only "covid19"
module.exports = async function (context, req) {
  context.log('Opp Request Headers = ', JSON.stringify(req.headers));
  context.log('Opp Request Query = ', JSON.stringify(req.query));
  if (!req.query.location && !req.query.virtual) {
    context.res = {
      status: 400,
      body: "location or virtual parameter is required"
    };
    context.log('Request return = ', JSON.stringify(context.res));
    return;
  }

  let location = req.query.location;
  let pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  let isCovid19 = req.query.isCovid19 === 'true' ? 'covid19' : '';
  let numberOfResults = req.query.numberOfResults && req.query.numberOfResults <= 100 ? req.query.numberOfResults : 100;
  let radius = req.query.radius ? req.query.radius : 20;
  let virtual = req.query.virtual === 'true' ? true : false;
  let categories = req.query.categories ? req.query.categories : '';
  let greatFor = req.query.greatFor ? req.query.greatFor : '';
  let keywords = req.query.keywords ? req.query.keywords : '';
  let skills = req.query.skills ? `"${req.query.skills.split(",").join('","')}"` : '';
  const VOL_MATCH_API_URL = process.env.VOL_MATCH_API_URL;


  try {
    const params = {
      location,
      virtual,
      categories,
      greatFor,
      keywords,
      radius,
      isCovid19,
      pageNumber,
      numberOfResults,
      skills
    }
    const vmQuery = generateQuery(params);
    var jsonQuery = JSON.stringify({ query: vmQuery });
    const response = await axios.post(VOL_MATCH_API_URL, jsonQuery, options)

    // If no results found
    var searchOpportunities = response.data.data.searchOpportunities
    if (!searchOpportunities) {
      context.res = {
        status: response.status,
        body: {
          resultsSize: 0,
          opportunities: []
        }
      }
    } else {
      if(virtual){
        searchOpportunities.opportunities = filterCAOrg (searchOpportunities.opportunities);
        searchOpportunities.numberOfResults = searchOpportunities.opportunities.length;
      }
       context.res = {
        status: response.status,
        body: response.data.data.searchOpportunities
     }
    }

  } catch (err) {
    context.res = {
      status: err.response.status,
      body: err
    }
  }
  context.log('Request return = ', JSON.stringify(context.res).substr(0,200));
};
