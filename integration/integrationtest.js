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
let expectedNumberOfResultsOpportunities = [0, 0, 0, 0, 1, 1, 1, 9, 20, 23, 23, 25, 22, 25, 22, 3,]



replies = [{
    id: 11695,
    values: ['a school affiliation']
},
{
    id: 11696,
    values: ['Sunday Evening', 'Sunday Afternoon']
}];

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


test('createConnectionGet should return 400 for exising connection', async () => {
    const element = { params: { oppId: '585778', firstName: 'testingFirst', lastName: 'testingLast', zipCode: '12345', phoneNumber: '1234567890', email: `test@a.com`, acceptTermsAndConditions: 'true' } };
    try {
        var result = await axios.get(
            'http://localhost:7071/api/createConnection',
            element,
        );
        expect(result.status).toEqual(2000);
    }
    catch (err) {
        expect(err.response.data.error).toContain('already exists');
        expect(err.response.status).toEqual(400);
    }
});

test('createConnectionGet should return 200 for new connection', async () => {
    const element = { params: { oppId: '585778', firstName: 'testingFirst', lastName: 'testingLast', zipCode: '12345', phoneNumber: '1234567890', email: `test.${new Date().getTime()}@a.com`, acceptTermsAndConditions: 'true' } };

    var result = await axios.get(
        'http://localhost:7071/api/createConnection',
        element,
    );
    expect(result.status).toEqual(200);
});

test('createConnectionPost should succeed on new email', async () => {
    var email = `test_${new Date().getTime()}@a.com`;
    const element = { oppId: '585778', firstName: 'testingFirst', lastName: 'testingLast', zipCode: '12345', phoneNumber: '1234567890', email, replies, acceptTermsAndConditions: 'true' };
    jest.setTimeout(30000);
    var result = await axios.post(
        'http://localhost:7071/api/createConnection',
        JSON.stringify(element),
    );
    expect(result.status).toEqual(200);

});

test('createConnectionPost should fail on existing email', async () => {
    var email = `test_${new Date().getTime()}@a.com`;
    const element = { oppId: '585778', firstName: 'testingFirst', lastName: 'testingLast', zipCode: '12345', phoneNumber: '1234567890', email: 'test@a.com', replies, acceptTermsAndConditions: 'true' };
    jest.setTimeout(30000);
    try {
        var result = await axios.post(
            'http://localhost:7071/api/createConnection',
            JSON.stringify(element),
        );
        expect(result.status).toEqual(2000);
    }
    catch (err) {        
        expect(err.response.status).toEqual(400);
        expect(err.response.data.error).toContain('already exists');
    }

});
