const jwt_decode = require('jwt-decode')

const validateByGroup = async (event) => {
    let isAllowed = false
    const { allowedGroups } = event
    const { accessToken } = event
    const decoded = jwt_decode(accessToken)

    const userGroups = decoded["cognito:groups"]
    userGroups.map(group => {
        if (allowedGroups.includes(group)) {
            isAllowed = true
        }
    })

    return isAllowed
}

module.exports = validateByGroup