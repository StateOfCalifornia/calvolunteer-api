const axios = require('axios'); 

function validateParams(req){
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const zipRegexp =  /^\d{5}$|^\d{5}-\d{4}$/;
    if(!req.query.oppId){
        return {errorMessage:'No Organization Selected'};
    }

    if(!emailRegexp.test(req.query.email)){
        return {errorMessage:'Invalid Email'};
    }

    if(!zipRegexp.test(req.query.zip)){
        return {errorMessage:'Invalid zip'};
    }

    if(!req.query.firstName){
        return {errorMessage:'No First Name'};
    }

    if(!req.query.lastName){
        return {errorMessage:'No Last Name'};
    }
    if(req.query.acceptTermsAndConditions !== 'true'){
        return {errorMessage:'Invalid Accept Terms And Conditions'};
    }
     return {
        oppId: req.query.oppId,
        email: req.query.email,
        zip: req.query.zip,
        lastName: req.query.lastName,
        firstName: req.query.firstName,
        phoneNumber: req.query.phoneNumber,
        acceptTermsAndConditions: req.query.acceptTermsAndConditions
    };
}

function generateQuery(params) {
    return `mutation {
        createConnection ( 
            input: {
            oppId: ${params.oppId}
            comments: "Connection created by CaliforniaVolunteers"
            volunteer: {
                email: "${params.email}"
                firstName: "${params.firstName}"
                lastName: "${params.lastName}"
                phoneNumber: "${params.phoneNumber}"
                zipCode: "${params.zip}"
                acceptTermsAndConditions: ${params.acceptTermsAndConditions}
            } 
            }) 
            {
            comments
            volunteer {
                email
                firstName
                lastName
                phoneNumber
                zipCode
            }
            enlister {
                email
                firstName
                lastName
                phoneNumber
                zipCode
            }
            shifts {
                id
                name
                notes
                date
                startTime
                endTime
                volNeeded
            }
            replies {
                id
                values
            }
        }
    }`;
}


// Params: 
    // oppId - Is either/or not both
    // email - Will always be based on ZIP
    // firstName - Default to true
    // lastName - in miles - ?
    // phoneNumber
    // zip
    // acceptTermsAndConditions
module.exports = async function (context, req) {
    const reCaptchaOptions = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
    const verificationUrl = process.env.RECAPTCHA_API_URL;
    const postBody = `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.query.token}`;
    const tokenVerification = await axios.post(verificationUrl, postBody, reCaptchaOptions)


    // Invalid Token Short Circuit
    if(!tokenVerification.data.success) {
        context.res = {
            status: 400,
            body: {error: tokenVerification.data['error-codes']}
        }; 
        return;
    }

    // Invalid Params Short Circuit
    var validParams = validateParams(req);
    if (validParams.errorMessage) {
        context.res = {
            status: 400,
            body: {error: validParams.errorMessage}
        };
        return;
    }

    const query = generateQuery(validParams);
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
        const response = await axios.post(VOL_MATCH_API_URL, JSON.stringify({ query: query }), volMatchOptions)

        // If no results found
        if (!response.data.data.createConnection) {
            context.res = {
                status: 400,
                body: {error: response.data.errors[0].message}
            }
        } else {
            context.res = {
                body: response.data.data.createConnection
            }
        }

    } catch (err) {
        context.res = {
            status: 400,
            body: {error: err}
        }
    }
};