const AWS = require("aws-sdk")
const lambda = new AWS.Lambda()

const generateUUID = async (event) => {
    return await new Promise((resolve, reject) => {
        const params = {
            FunctionName: "generateUUID",
            Payload: JSON.stringify({})
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

module.exports = generateUUID;