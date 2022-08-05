const AWS = require("aws-sdk")
const lambda = new AWS.Lambda()

const signUp = async (userInfo) => {
    return await new Promise((resolve, reject) => {
        const params = {
            FunctionName: "viajaTechSignUp",
            Payload: JSON.stringify({
                ...userInfo
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

module.exports = signUp;