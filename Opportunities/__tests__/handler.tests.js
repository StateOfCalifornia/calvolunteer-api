const handler = require('../handler');
const filters = require('../filters');

// ////////////////////////////////////////
//  validateRequest
// ////////////////////////////////////////
test('validateRequest should not return error message if location is set', () => {
    var req = {
        query: {
            location: 'a location'
        }
    }
    var result = handler.validateRequest(req);
    expect(result).toBeFalsy();
});

test('validateRequest should not return error message if virtual is set', () => {
    var req = {
        query: {
            virtual: true
        }
    }
    var result = handler.validateRequest(req);
    expect(result).toBeFalsy();
});

test('validateRequest should  return error message if location and virtual are not set', () => {
    var req = {
        query: {
        }
    }
    var result = handler.validateRequest(req);
    expect(result).toBeTruthy();
});

// ////////////////////////////////////////
//  getParameters
// ////////////////////////////////////////
test('getParameters should return proper json with true literal', () => {
    var req = {
        query: {
            ids: '1,2,3',
            location: 'california',
            pageNumber: 44,
            isCovid19: 'true',
            radius: 55,
            virtual: 'true',
            categories: '1,2,3',
            greatFor: 'kids,teens',
            skills: 'reading,writing',
            numberOfResults: 12,
            keywords: 'hospice care'
        }
    }
    var result = handler.getParameters(req);
    expect(result).toMatchSnapshot();
});

test('getParameters should return proper json with false literal', () => {
    var req = {
        query: {
            ids: '1,2,3',
            location: 'california',
            pageNumber: 22,
            isCovid19: 'false',
            radius: 12,
            virtual: 'false',
            categories: '1,2,3',
            greatFor: 'kids,teens',
            skills: 'reading,writing',
            numberOfResults: 14,
            keywords: 'tutoring'
        }
    }
    var result = handler.getParameters(req);
    expect(result).toMatchSnapshot();
});

test('getParameters should set defaults', () => {
    var req = {
        query: {
            location: 'california',
        }
    }
    var result = handler.getParameters(req);
    expect(result).toMatchSnapshot();
});
test('getParameters should set defaults with virtual', () => {
    var req = {
        query: {
            virtual: 'true',
        }
    }
    var result = handler.getParameters(req);
    expect(result).toMatchSnapshot();
});
// ////////////////////////////////////////
//  processOpportunities
// ////////////////////////////////////////

jest.mock('../filters');
test('processOpportunities should call filter.CustomRequiredFields', () => {
    var pre = [{},{},{}];
    handler.processOpportunities(pre);
    expect(filters.CustomRequiredFields).toHaveBeenCalledTimes(1);
});

test('processOpportunities should not call filter.CustomRequiredFields if skipCustom is truthy', () => {
    var pre = [{},{},{}];
    var skipCustom = 1;
    handler.processOpportunities(pre, skipCustom);
    expect(filters.CustomRequiredFields).toHaveBeenCalledTimes(0);
});
test('processOpportunities should call filter.CAOrg', () => {
    var pre = [{},{},{}];
    handler.processOpportunities(pre);
    expect(filters.CAOrg).toHaveBeenCalledTimes(1);
});
