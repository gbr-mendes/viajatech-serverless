const AWS = require("aws-sdk")
const lambda = new AWS.Lambda()

const validateByGroup = async (accessToken, allowedGroups) => {
    return await new Promise((resolve, reject) => {
        const params = {
            FunctionName: "validateByGroup",
            Payload: JSON.stringify({
                accessToken,
                allowedGroups,
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

module.exports = validateByGroup