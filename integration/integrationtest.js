//run with:
//   node_modules\.bin\jest -i integration/integrationtest.js -c jest.config.integration.js

const axios = require('axios');
let queriesOpportunities = [
    // 585778 is a local opportunit in 90015 zipcode
    { params: { ids: '585778', isCovid19: 'true', location: '11111', virtual: 'false', pageNumber: 1 } },
    { params: { ids: '585778', isCovid19: 'true', location: '11111', virtual: 'true', pageNumber: 1 } },
    { params: { ids: '585778', isCovid19: 'false', location: '11111', virtual: 'false', pageNumber: 1 } },
    { params: { ids: '585778', isCovid19: 'false', location: '11111', virtual: 'true', pageNumber: 1 } },
    { params: { ids: '585778', isCovid19: 'false', location: '', virtual: 'false', pageNumber: 1 } },
    { params: { ids: '585778', isCovid19: 'false', location: '90015', virtual: 'false', pageNumber: 1 } },

    { params: { ids: '', isCovid19: 'true', location: '95670', virtual: 'false', pageNumber: 1 } },
    { params: { ids: '', isCovid19: 'true', location: '95670', virtual: 'true', pageNumber: 1 } },
    { params: { ids: '', isCovid19: 'false', location: '95670', virtual: 'false', pageNumber: 1 } },
    { params: { ids: '', isCovid19: 'false', location: '95670', virtual: 'true', pageNumber: 1 } },

    { params: { ids: '', isCovid19: 'false', location: '90011', virtual: 'false', pageNumber: 1 } },
    { params: { ids: '', isCovid19: 'false', location: '90011', virtual: 'false', pageNumber: 4 } },
    { params: { ids: '', isCovid19: 'false', location: '90011', virtual: 'false', pageNumber: 4, keywords: 'hospice' } },
    { params: { ids: '', isCovid19: 'false', location: '90011', virtual: 'false', pageNumber: 4, keywords: 'hospice', radius: 100 } },
    { params: { ids: '', isCovid19: 'false', location: '90011', virtual: 'false', pageNumber: 4, keywords: 'hospice', radius: 100, categories: 'animals' } },
    { params: { ids: '', isCovid19: 'false', location: '90011', virtual: 'false', pageNumber: 1, keywords: 'pets', radius: 100, categories: 'animals, community', greatFor: 'kids,teens', skills: 'animals' } },


];
let expectedNumberOfResultsOpportunities = [0, 0, 0, 0, 1, 1, 1, 9, 20, 21, 24, 24, 22, 25, 22, 3,]



let queriesConnectionsGet = [
    { oppId: '585778', firstName: 'testingFirst', lastName: 'testingLast', zipCode: '12345', phoneNumber: '1234567890', email: `test@a.com` },
    { oppId: '585778', firstName: 'testingFirst', lastName: 'testingLast', zipCode: '12345', phoneNumber: '1234567890', email: `test.${new Date().getTime()}@a.com` },
]
let expectedResultCodeConnectionGet = [200, 400];

var email = `test_${new Date().getTime()}@a.com`;
replies = [{
    id: 11695,
    values: ['a school affiliation']
},
{
    id: 11696,
    values: ['Sunday Evening', 'Sunday Afternoon']
}];
let queriesConnectionsPost = [
    { oppId: '585778', firstName: 'testingFirst', lastName: 'testingLast', zipCode: '12345', phoneNumber: '1234567890', email, replies },
    { oppId: '585778', firstName: 'testingFirst', lastName: 'testingLast', zipCode: '12345', phoneNumber: '1234567890', email },
]
let expectedResultCodeConnectionPost = [200, 400];

test('Opportunities', async () => {
    for (let index = 0; index < queriesOpportunities.length; index++) {
        const element = queriesOpportunities[index];
        jest.setTimeout(30000);
        var result = await axios.get(
            'http://localhost:7071/api/Opportunities',
            element,
        );
        expect(result.data.numberOfResults).toEqual(expectedNumberOfResultsOpportunities[index]);
        expect(result.data).toMatchSnapshot();
    }
});





test('createConnectionGet', async () => {
    for (let index = 0; index < queriesConnectionsGet.length; index++) {
        const element = queriesConnectionsGet[index];
        jest.setTimeout(30000);
        var result = await axios.get(
            'http://localhost:7071/api/createConnection',
            element,
        );
        expect(result.resultCode).toEqual(expectedResultCodeConnectionGet[index]);
        expect(result.data).toMatchSnapshot();
    }
});

test('createConnectionPost', async () => {
    for (let index = 0; index < queriesConnectionsGet.length; index++) {
        const element = queriesConnectionsGet[index];
        jest.setTimeout(30000);
        var result = await axios.post(
            'http://localhost:7071/api/createConnection',
            element,
        );
        expect(result.resultCode).toEqual(expectedResultCodeConnectionPost[index]);
        expect(result.data).toMatchSnapshot();
    }
});

