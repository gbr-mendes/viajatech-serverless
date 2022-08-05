const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

const addUserToGroup = require('./addUserToGroup');

const signUp = async (event) => {
    const signUpParams = {
        ClientId: process.env.CLIENT_ID,
        Password: event.password,
        Username: event.email,
        UserAttributes: [
            {
                Name: "email",
                Value: event.email
            }
        ]
    }
    try {
        await cognito.signUp(signUpParams).promise()
        await addUserToGroup(process.env.POOL_ID, event.group, event.email)
        return { success: "User signed up", statusCode: 201 }
    } catch (error) {
        return { error }
    }
}

module.exports = signUp;