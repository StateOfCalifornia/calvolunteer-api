const axios = require('axios');

module.exports = {
    validateCaptcha: async (req) => {
        if (process.env.RECAPTCHA_SECRET_KEY) {
            const reCaptchaOptions = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            };
            const verificationUrl = process.env.RECAPTCHA_API_URL;
            var source = req.query;
            if (req.method === 'POST') {
                  source = req.body;
            }
            const postBody = `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${source.token}`;
            const tokenVerification = await axios.post(verificationUrl, postBody, reCaptchaOptions)
            return tokenVerification;
        }
        else {
            // since no key specified, presume no need for recaptch 
            // so presume validated.....
            return {
                data: {
                    success: true
                }
            }
        }
    },

    validateParams: (req) => {
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const zipRegexp =  /^\d{5}$|^\d{5}-\d{4}$/;
        var source = req.query;
        if(req.method === 'POST'){
            source = req.body;
        }
        if(!source.oppId){
            return {errorMessage:'No Organization Selected'};
        }
    
        if(!emailRegexp.test(source.email)){
            return {errorMessage:'Invalid Email'};
        }
    
        if(!zipRegexp.test(source.zipCode)){
            return {errorMessage:'Invalid Zip Code'};
        }
    
        if(!source.firstName){
            return {errorMessage:'No First Name'};
        }
    
        if(!source.lastName){
            return {errorMessage:'No Last Name'};
        }
        if(source.acceptTermsAndConditions !== 'true'){
            return {errorMessage:'Invalid Accept Terms And Conditions'};
        }
         return {
            oppId: source.oppId,
            email: source.email,
            zipCode: source.zipCode,
            lastName: source.lastName,
            firstName: source.firstName,
            phoneNumber: source.phoneNumber,
            replies: source.replies,
            acceptTermsAndConditions: source.acceptTermsAndConditions
        };
    }
}