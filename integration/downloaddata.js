const axios = require('axios');
const queries = [
    { params: { ids: '', isCovid19: 'true', location: 'california', virtual: 'false', pageNumber: 1 } },
    { params: { ids: '', isCovid19: 'false', location: 'california', virtual: 'false', pageNumber: 1 } },
    { params: { ids: '', isCovid19: 'true', location: 'california', virtual: 'true', pageNumber: 1 } },
    { params: { ids: '', isCovid19: 'false', location: 'california', virtual: 'true', pageNumber: 1 } },
];

const dumpOpportunities = (opps) => {
    opps.forEach(opp => {
         console.log(`"${opp.id}","${opp.title.replace(/\"/g, '""')}","${opp.parentOrg.name.replace(/\"/g, '""')}"`);
    });
}

const getData = async () => {
    for (let index = 0; index < queries.length; index++) {
        let numberPages;
        const element = queries[index];
        let result = await axios.get(
            'http://localhost:7071/api/Opportunities',
            element);
        //dumpOpportunities(result.data.opportunities);
 
        numberPages = Math.floor(result.data.resultsSize / result.data.numberOfResults) + 1;
        console.log(result.data.resultsSize,result.data.numberOfResults)
        console.log('numberPages=', numberPages)
        for (let page = 2000; page <= numberPages; page++) {
            element.params.pageNumber = page;
            result = await axios.get(
                'http://localhost:7071/api/Opportunities',
                element);
           // dumpOpportunities(result.data.opportunities);
         }
    }
}

getData();