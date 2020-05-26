const query = require('../query');

test('createQuery should return graphql', () => {
    var params = {
        oppId: 1234,
        replies: [{
            id: 123,
            values: ['a', 'b']
        }],
        email: 'a@b.com',
        firstName: 'first',
        lastName: 'last',
        phoneNumber: "123-456-7890",
        zipCode: '12345',
        acceptTermsAndConditions: true,
    }
    var graphql = query.generateQuery(params);
    expect(graphql).toMatchSnapshot();
})

test('createQuery should return graphql with no replies set', () => {
    var params = {
        oppId: 1234,
        replies: 0,
        email: 'a@b.com',
        firstName: 'first',
        lastName: 'last',
        phoneNumber: "123-456-7890",
        zipCode: '12345',
        acceptTermsAndConditions: true,
    }
    var graphql = query.generateQuery(params);
    expect(graphql).toMatchSnapshot();
})