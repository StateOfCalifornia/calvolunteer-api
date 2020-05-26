const filters = require('../filters');

const caParentOrg = {
    parentOrg:{
        location:{
            region: 'CA'
        }
    }
} 
const otherParentOrg = {
    parentOrg:{
        location:{
            region: 'OTHER'
        }
    }
} 

const customField = {
    fieldId: 64065,
    fieldLabel: 'Are you looking to volunteer short-term or long-term?',
    fieldType: 'checkbox',
    required: false,
    choices: [
      'Short-term',
      'Long-term',
      'Both'
    ]             
}

const notRequiredCustomFields = {
    customFields:[
        Object.assign({}, customField),        
        Object.assign({}, customField),
        Object.assign({}, customField),
    ]
}
const reqRequiredCustomFields = {
    customFields:[
        Object.assign({}, customField),        
        Object.assign({}, customField),
        Object.assign({}, customField),
    ]
}
reqRequiredCustomFields.customFields[1].required = true;

test('CAOrg to not filter opportunities with parent org in region CA', () => {
    var pre = [caParentOrg,caParentOrg];
    var expected = pre.map(o => Object.assign({},o));
    var result = filters.CAOrg(pre);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});
test('CAOrg to remove opportunities if parent org NOT in region CA', () => {
    var pre = [caParentOrg,caParentOrg, otherParentOrg, caParentOrg];
    var expectedArray = [caParentOrg, caParentOrg, caParentOrg];
    var expected = expectedArray.map(o => Object.assign({},o));
    var result = filters.CAOrg(pre);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});



test('CustomRequiredFields to not remove opportunities with no required customFields', () => {
    var pre = [notRequiredCustomFields, notRequiredCustomFields, notRequiredCustomFields];
    var expected = pre.map(o => Object.assign({},o));
    var result = filters.CustomRequiredFields(pre);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});

test('CustomRequiredFields to  remove opportunities with  required customFields', () => {
    var pre = [notRequiredCustomFields ,reqRequiredCustomFields, notRequiredCustomFields];
    var expected = [notRequiredCustomFields, notRequiredCustomFields];
    var result = filters.CustomRequiredFields(pre);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});