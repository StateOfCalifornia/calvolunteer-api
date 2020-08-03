const filter = require('./filters')

module.exports = {
    validateRequest: (req) => {
        var message = '';
        if (!req.query.location && !req.query.virtual && !req.query.ids) {
            message = 'location, virtual, or ids parameter is required';
        }
        return message;
    },


    getParameters: (req) => {
        let key = req.query.key ? req.query.key : '';
        let ids = req.query.ids ? req.query.ids : '';
        let location = req.query.location ? req.query.location : '';
        let pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
        let covid19Flag = req.query.isCovid19 === 'true' ? 'covid19' : '';
        let radius = req.query.radius ? req.query.radius : 20;
        let virtual = req.query.virtual === 'true' ? true : false;
        let categories = req.query.categories ? req.query.categories : '';
        let greatFor = req.query.greatFor ? req.query.greatFor : '';
        let keywords = req.query.keywords ? req.query.keywords : '';
        let skills = req.query.skills ? `"${req.query.skills.split(",").join('","')}"` : '';
        let numberOfResults = req.query.numberOfResults && req.query.numberOfResults <= 100 ? req.query.numberOfResults : 100;
        
        const params = {
            key,
            ids,
            location,
            virtual,
            categories,
            greatFor,
            keywords,
            radius,
            covid19Flag,
            pageNumber,
            numberOfResults,
            skills
        };
        return params;
    },

    processOpportunities: (opportunitiesList, skipCustom) => {
        // If no results found
        var processedOpps = opportunitiesList.map(opp => Object.assign({}, opp));
 
        // filter out opportunities with required custom fields
        if(!skipCustom){
            processedOpps = filter.CustomRequiredFields(processedOpps);
        }

        // filter out all non california based orgs
        processedOpps = filter.CAOrg(processedOpps);
        
        return processedOpps;
    }
}