const query = require('../query');

test('createQuery should return graphql', () => {
    var params = {
        ids: '',
        location: 'california',
        categories: '1,2,3',
        pageNumber: 22,
        numberOfResults: 14,
        covid19Flag: 'false',
        radius: 12,
        virtual: 'false',
        greatFor: 'kids,teens',
        keywords: 'tutoring',
        skills: 'reading,writing',
     }
    var graphql = query.generateQuery(params);
    expect(graphql).toMatchSnapshot();
});
