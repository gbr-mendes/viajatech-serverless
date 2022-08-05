const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const validateByGroup = require('./validateByGroup')

const getLeads = async (event) => {
    const accessToken = event.headers.Authorization

    const params = {
        TableName: 'viaja-tech-leads'
    }

    try {
        const isAllowed = JSON.parse(await validateByGroup(accessToken, ["Admin", , "SalesManager"]))

        if (!isAllowed) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: "Você não tem permissão para realizar esta ação" })
            }
        }

        const { Items: data } = await dynamoDB.scan(params).promise()

        return {
            statusCode: 200,
            body: JSON.stringify({ results: data })
        }
    } catch (error) {
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ error: error.message })
        }
    }
}

module.exports = getLeads;