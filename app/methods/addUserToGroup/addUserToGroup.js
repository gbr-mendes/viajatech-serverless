const AWS = require('aws-sdk')
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()

const addUserToGroup = async (event) => {
    const groupParams = {
        GroupName: event.group,
        UserPoolId: event.poolId,
    }

    const addUserParams = {
        GroupName: event.group,
        UserPoolId: event.poolId,
        Username: event.username,
    }

    try {
        await cognitoidentityserviceprovider.createGroup(groupParams).promise();
    } catch (e) {
        await cognitoidentityserviceprovider.getGroup(groupParams).promise();
    }

    try {
        await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
        const response = {
            statusCode: 200,
            success: "User added to the assigned group"
        }
        return response;
    } catch (err) {
        return {
            error: err.message
        }
    }
};

module.exports = addUserToGroup;