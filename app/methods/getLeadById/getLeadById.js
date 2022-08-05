const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const validateByGroup = require('./validateByGroup')

const getLeadById = async (event) => {
    const accessToken = event.headers.Authorization


    const params = {
        TableName: "viaja-tech-leads",
        Key: { leadId: event.pathParameters.leadId }
    }

    try {
        const isAllowed = JSON.parse(await validateByGroup(accessToken, ["Admin", "SalesManager"]))

        if (!isAllowed) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: "Você não tem permissão para realizar esta ação" })
            }
        }
        const { Item: lead } = await dynamoDB.get(params).promise()
        return {
            statusCode: 200,
            body: JSON.stringify(lead)
        }
    } catch (error) {
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ error: error.message })
        }
    }
}

module.exports = getLeadById;