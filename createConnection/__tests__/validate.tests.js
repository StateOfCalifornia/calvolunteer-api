const validate = require('../validate');
const axios = require('axios');
jest.mock('axios');

// ////////////////////////////////////////
//  validateCaptcha
// ////////////////////////////////////////
test('validateCaptcha should return data:success = true if process.env.RECAPTCHA_SECRET_KEY not set', async () => {
    process.env.RECAPTCHA_SECRET_KEY = '';
    var req = {
        method: 'POST',
        token: 'abc'
    };
    var result = await validate.validateCaptcha(req);
    expect(axios.post).toHaveBeenCalledTimes(0);
    expect(result.data.success).toBe(true);
});

test('validateCaptcha should call axios.post if RECAPTCHA_SECRET_KEY is set ', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'MySecretKey';
    process.env.RECAPTCHA_API_URL = 'APIURL';
    var req = {
        method: 'POST',
        body: {
            token: 'abc',
        }
    };
    axios.post.mockReturnValue({ data: { success: true } });
    var result = await validate.validateCaptcha(req);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
        process.env.RECAPTCHA_API_URL,
        `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.token}`,
        {"headers": {"Content-Type": "application/x-www-form-urlencoded"}});
    expect(result.data.success).toBe(true);
});

test('validateCaptcha should call axios.post if RECAPTCHA_SECRET_KEY is set and request is get ', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'MySecretKey';
    process.env.RECAPTCHA_API_URL = 'APIURL';
    var req = {
        method: 'GET',
        query: {
            token: 'abc',
        }
    };
    axios.post.mockReturnValue({ data: { success: true } });
    var result = await validate.validateCaptcha(req);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
        process.env.RECAPTCHA_API_URL,
        `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.query.token}`,
        {"headers": {"Content-Type": "application/x-www-form-urlencoded"}});
    expect(result.data.success).toBe(true);
});


// ////////////////////////////////////////
//  validateParams
// ////////////////////////////////////////
test('validateParams should return message if oppID not set', async () => {
    var req = {
        method: 'POST',
        body: {
            oppId: 0
        }
    };
    var result = validate.validateParams(req);
    expect(result).toEqual({ errorMessage: 'No Organization Selected' });
});
test('validateParams should return message if email not set', async () => {
    var req = {
        method: 'POST',
        body: {
            oppId: 1
        }
    };
    var result = validate.validateParams(req);
    expect(result).toEqual({ errorMessage: 'Invalid Email' });
});
test('validateParams should return message if email not correct format', async () => {
    var req = {
        method: 'POST',
        body: {
            oppId: 1,
            email: 'aemailinvalid'
        }
    };
    var result = validate.validateParams(req);
    expect(result).toEqual({ errorMessage: 'Invalid Email' });
});
test('validateParams should return message if zip not correct format', async () => {
    var req = {
        method: 'POST',
        body: {
            oppId: 1,
            email: 'a@b.com',
            zipCode: 'abc'
        }
    };
    var result = validate.validateParams(req);
    expect(result).toEqual({ errorMessage: 'Invalid Zip Code' });
});
test('validateParams should return message if zip not set', async () => {
    var req = {
        method: 'POST',
        body: {
            oppId: 1,
            email: 'a@b.com',
            zipCodex: 'abc'
        }
    };
    var result = validate.validateParams(req);
    expect(result).toEqual({ errorMessage: 'Invalid Zip Code' });
});

test('validateParams should return message if firstName not set', async () => {
    var req = {
        method: 'POST',
        body: {
            oppId: 1,
            email: 'a@b.com',
            zipCode: '12345'
        }
    };
    var result = validate.validateParams(req);
    expect(result).toEqual({ errorMessage: 'No First Name' });
});
test('validateParams should return message if last not set', async () => {
    var req = {
        method: 'POST',
        body: {
            oppId: 1,
            email: 'a@b.com',
            zipCode: '12345',
            firstName: 'first'
        }
    };
    var result = validate.validateParams(req);
    expect(result).toEqual({ errorMessage: 'No Last Name' });
});
test('validateParams should return message if acceptTermsAndConditions not set to true', async () => {
    var req = {
        method: 'POST',
        body: {
            oppId: 1,
            email: 'a@b.com',
            zipCode: '12345',
            firstName: 'first',
            lastName: 'last',
            acceptTermsAndConditions: 'TRUx'
        }
    };
    var result = validate.validateParams(req);
    expect(result).toEqual({ errorMessage: 'Invalid Accept Terms And Conditions' });
});


test('validateParams should return param object  if all params set correctly', async () => {
    const params = {
        oppId: 1,
        email: 'a@b.com',
        zipCode: '12345',
        firstName: 'first',
        lastName: 'last',
        acceptTermsAndConditions: 'true'
    }
    var req = {
        method: 'POST',
        body: params
    };
    var result = validate.validateParams(req);
    expect(result).toEqual(params);
});

test('validateParams should return param object  if all params set correctly in get query', async () => {
    const params = {
        oppId: 1,
        email: 'a@b.com',
        zipCode: '12345',
        firstName: 'first',
        lastName: 'last',
        acceptTermsAndConditions: 'true'
    }
    var req = {
        method: 'GET',
        query: params
    };
    var result = validate.validateParams(req);
    expect(result).toEqual(params);
});