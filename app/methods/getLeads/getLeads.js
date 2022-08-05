const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const validateByGroup = require('./validateByGroup')

const defaultHeader = require('./constants/defaultHeader')

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
                body: JSON.stringify({ error: "Você não tem permissão para realizar esta ação" }),
                headers: defaultHeader
            }
        }

        const { Items: data } = await dynamoDB.scan(params).promise()

        return {
            statusCode: 200,
            body: JSON.stringify({ results: data }),
            headers: defaultHeader
        }
    } catch (error) {
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ error: error.message }),
            headers: defaultHeader
        }
    }
}

module.exports = getLeads;