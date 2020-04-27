const axios = require('axios'); 

function validateParams(req){
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const zipRegexp =  /^\d{5}$|^\d{5}-\d{4}$/;
    if(!req.query.oppId){
        return {errorMessage:'No Organization() Selected'};
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
    return {
        oppId: req.query.oppId,
        email: req.query.email,
        zip: req.query.zip,
        lastName: req.query.lastName,
        firstName: req.query.firstName,
        phoneNumber: req.query.phoneNumber
    };
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

  // Params: 
    // oppId - Is either/or not both
    // email - Will always be based on ZIP
    // firstName - Default to true
    // lastName - in miles - ?
    // phoneNumber
    // zipCode
    //acceptTermsAndConditions
    var validParams = validateParams(req);
    if (!validParams.errorMessage) {

        const VOL_MATCH_API_KEY = process.env.VOL_MATCH_API_KEY;
        const VOL_MATCH_API_URL = process.env.VOL_MATCH_API_URL;

        const options = {
            headers: {
                'X-api-key': VOL_MATCH_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        var q = `mutation {
            createConnection ( 
              input: {
              oppId: ${validParams.oppId}
                comments: "Connection created by CaliforniaVolunteers"
                volunteer: {
                  email: "${validParams.email}"
                  firstName: "${validParams.firstName}"
                  lastName: "${validParams.lastName}"
                  phoneNumber: "${validParams.phoneNumber}"
                  zipCode: "${validParams.zip}"
                  acceptTermsAndConditions: true
                }
              } ) {
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
        try {
            const response = await axios.post(VOL_MATCH_API_URL, JSON.stringify({ query: q }), options)

            // If no results found
            if (!response.data.data.createConnection) {
                context.res = {
                    body: response.data.errors[0].message
                }
            } else {
                context.res = {
                    body: response.data.data.createConnection
                }
            }

        } catch (err) {
            context.res = {
                body: err
            }
        }
    }
    else {
        context.res = {
            status: 400,
            body: validParamsMessage.errorMessage
        };
    }
};