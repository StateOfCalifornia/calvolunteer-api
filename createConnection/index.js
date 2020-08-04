const axios = require('axios');
const query = require('./query');
const validate = require('./validate');



// Params: 
// oppId - Is either/or not both
// email - Will always be based on ZIP
// firstName - Default to true
// lastName - in miles - ?
// phoneNumber
// zip
// acceptTermsAndConditions
module.exports = async function (context, req) {
    context.log('Connection Request Headers = ', JSON.stringify(req.headers));
    context.log('Connection Request Query = ', JSON.stringify(req.query));
    context.log('Connection Request Body = ', JSON.stringify(req.body));
    // Invalid Token Short Circuit
    var tokenVerification = await validate.validateCaptcha(req);
    if (!tokenVerification.data.success) {
        context.res = {
            status: 400,
            body: { error: tokenVerification.data['error-codes'] }
        };
        context.log('Connection Request return = ', JSON.stringify(context.res));
        return;
    }

    // Invalid Params Short Circuit
    var validParams = validate.validateParams(req);
    if (validParams.errorMessage) {
        context.res = {
            status: 400,
            body: { error: validParams.errorMessage }
        };
        context.log('Connection Request return = ', JSON.stringify(context.res));
        return;
    }

    const queryString = query.generateQuery(validParams);
    try {
        const VOL_MATCH_API_KEY = process.env.VOL_MATCH_API_KEY;
        const VOL_MATCH_API_URL = process.env.VOL_MATCH_API_URL;
        const volMatchOptions = {
            headers: {
                'X-api-key': VOL_MATCH_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        context.log("VOL_MATCH_API_URL=" + VOL_MATCH_API_URL);
        context.log("queryString=" + queryString);
        const response = await axios.post(VOL_MATCH_API_URL, JSON.stringify({ query: queryString }), volMatchOptions)

        // If no results found
        if(response.data.errors && response.data.errors.length){
            context.log("response message=" + response.data.errors[0].message)
        }
        if (!response.data.data.createConnection) {
            context.res = {
                status: 400,
                body: { error: response.data.errors[0].message }
            }
        } else {
            context.res = {
                status: response.status,
                body: response.data.data.createConnection
            }
        }

    } catch (err) {
        context.log(err);
        context.res = {
            status: 500,
            body: err.message
        }
    }
    context.log('Connection Request return = ', JSON.stringify(context.res));
};