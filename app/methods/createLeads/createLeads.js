const AWS = require("aws-sdk")
const cognito = new AWS.CognitoIdentityServiceProvider();

const { v4: uuidv4 } = require('uuid');

const leadValidator = require('./leadValidator')
const daynamoDB = new AWS.DynamoDB.DocumentClient()

const addUserToGroup = require('./addUserToGroup')

const createLeads = async (event) => {
    const { userInfo } = JSON.parse(event.body)
    if (!userInfo) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Payload inválida" })
        }
    }

    const { error } = leadValidator.validate(userInfo)
    if (error) {
        const { message } = error.details[0]
        return {
            statusCode: 400,
            body: JSON.stringify({ error: message })
        }
    }

    // signup user

    const signUpParams = {
        ClientId: process.env.CLIENT_ID,
        Password: userInfo.password,
        Username: userInfo.email,
        UserAttributes: [
            {
                Name: "email",
                Value: userInfo.email
            }
        ]
    }

    const leadInfo = {
        leadId: uuidv4(),
        websiteVisits: 1,
        destinationsViewed: [],
        mostViewedDestination: null
    }

    // remove passowrd from userInfo to merge it with the lead info
    delete userInfo.password
    delete userInfo.confirmPassword

    try {
        await cognito.signUp(signUpParams).promise()
        const params = {
            TableName: "viaja-tech-leads",
            Item: {
                ...leadInfo,
                ...userInfo
            }
        }

        await daynamoDB.put(params).promise()
        await addUserToGroup(process.env.POOL_ID, "Leads", userInfo.email)
        return {
            statusCode: 201,
            body: JSON.stringify({ sucess: "Usuário registrado com sucesso" })
        }
    } catch (error) {
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ error: error.message })
        }
    }
}

module.exports = createLeads