module.exports = {
    generateQuery: (params) => {
        var replies = params.replies;
        if (!replies) {
            replies = [];
        }
        var repliesString = '[';
        replies.forEach(r => {
            repliesString += `{ id: ${r.id}, values: ${JSON.stringify(r.values)} },`;
        });
        repliesString += ']';

        return `mutation {
        createConnection ( 
            input: {
            oppId: ${params.oppId}
            replies: ${repliesString}
            comments: "Connection created by #CaliforniansForAll"
            volunteer: {
                email: "${params.email}"
                firstName: "${params.firstName}"
                lastName: "${params.lastName}"
                phoneNumber: "${params.phoneNumber}"
                zipCode: "${params.zipCode}"
                acceptTermsAndConditions: ${params.acceptTermsAndConditions}
            } 
            }) 
            {
            oppId
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
}