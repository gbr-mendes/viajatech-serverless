const { v4: uuidv4 } = require('uuid');

const generateUUID = async (event) => {
    return { uuid: uuidv4() }
}

module.exports = generateUUID;