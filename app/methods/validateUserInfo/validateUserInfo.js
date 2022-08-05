const validatePayload = require('./validatePayload')

const validateUserInfo = async (event) => {
    const { error } = validatePayload.validate(event)
    if (error) {
        return { error: error.details[0].message }
    }
    return { success: "Payload is valid" }
}

module.exports = validateUserInfo;