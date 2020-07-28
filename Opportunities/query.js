module.exports = {
  generateQuery: (params) => {
    //var locationSection = params.ids ? '' : `location: "${params.location}"`;
    //var virtualSection = params.ids ? '' : `virtual: ${params.virtual}`;
    return `query {
    searchOpportunities(input:{
      ids: [${params.ids}]
      location: "${params.location}"
      categories: [${params.categories}]
      pageNumber:${params.pageNumber}
      numberOfResults: ${params.numberOfResults}
      specialFlag: "${params.covid19Flag}"
      radius: "${params.radius}"
      virtual: ${params.virtual}
      greatFor: [${params.greatFor}],
      keywords: "${params.keywords}",
      skills: [${params.skills}],
      sortCriteria: container, 
      sortByContainers: ["tier0ca", "tier1ca", "tier2ca", "tier3ca"], 
  }){
      currentPage,
      numberOfResults,
      resultsSize,
      sortCriteria,
      opportunities{
        categories,
        container,
        description,
        greatFor,
        groupSize,
        id,
        imageUrl,
        plaintextDescription,
        shifts {
          date,
          endTime,
          id,
          name,
          notes,
          startTime,
          volNeeded
        },
        skillsNeeded,
        specialFlag,
        tags,
        timeCommitment,
        title, 
        url,
        volunteersNeeded,
        customFields {
          fieldId
          fieldLabel
          fieldType
          required
          choices
        }
        dateRange{
          endDate,
          endTime,
          ongoing,
          singleDayOpps,
          startDate,
          startTime
        },
        parentOrg {
          categories,
          classification,
          description,
          id,
          imageUrl,
          mission,
          name,
          phoneNumber,
          plaintextDescription,
          url,
          location {
            city,
            country,
            postalCode,
            region,
            street1,
            street2,
            virtual,
            geoLocation {
              accuracy,
              latitude,
              longitude,
            }  
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
   }}
  }`;
  }
}