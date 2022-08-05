const AWS = require("aws-sdk")
const lambda = new AWS.Lambda()

const addUserToGroup = async (poolId, group, username) => {
    return await new Promise((resolve, reject) => {
        const params = {
            FunctionName: "addUserToGroup",
            Payload: JSON.stringify({
                poolId,
                group,
                username
            })
        }
        lambda.invoke(params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results.Payload)
            }
        })
    })
}

module.exports = addUserToGroup;