const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();


const signIn = async (event) => {
    const body = JSON.parse(event.body)
    const signInParams = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.CLIENT_ID,
        AuthParameters: {
            USERNAME: body.email,
            PASSWORD: body.password,
        }
    }
    try {
        const { AuthenticationResult } = await cognito.initiateAuth(signInParams).promise()
        const { IdToken: accessToken } = AuthenticationResult
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Logado com sucesso", accessToken
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
                'Access-Control-Allow-Credentials': true
            }
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ error: error.message })
        }
    }
}

module.exports = signIn