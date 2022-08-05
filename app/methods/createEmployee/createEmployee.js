const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const signUp = require('./signUp')

const validateUserInfo = require('./validators/validateUserInfo');
const validateEmployeeInfo = require('./validators/validateEmployeeInfo');
const validateByGroup = require('./validators/validateByGroup')

const mapRoleByPosition = require('./utils/mapRoleByPosition');
const generateUUID = require('./utils/generateUUID');

const createEmployee = async (event) => {
    const body = JSON.parse(event.body)
    const accessToken = event.headers.Authorization

    const isAllowed = JSON.parse(await validateByGroup(accessToken, ["Admin"]))

    if (!isAllowed) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: "Você não tem permissão para realizar esta ação" })
        }
    }

    const { userInfo } = body
    const { employeeInfo } = body

    const { error: userError } = JSON.parse(await validateUserInfo(userInfo))
    if (userError) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: userError })
        }
    }

    const { error: employeeError } = validateEmployeeInfo.validate(employeeInfo)
    if (employeeError) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: employeeError.details[0].message })
        }
    }

    // create employee
    const { position } = employeeInfo
    const group = mapRoleByPosition(position)

    try {
        const { error: signUpError } = JSON.parse(await signUp({ email: userInfo.email, password: userInfo.password, group }))
        if (signUpError) {
            return {
                statusCode: signUpError.statusCode,
                body: JSON.stringify({ error: signUpError.message })
            }
        }

        // remove password from user info
        delete userInfo.password;
        delete userInfo.confirmPassword;

        const employeePayload = { ...userInfo, ...employeeInfo }
        const { uuid } = JSON.parse(await generateUUID(event))
        employeePayload.employeeId = uuid

        const params = {
            TableName: "viaja-tech-employee",
            Item: employeePayload
        }

        await dynamoDB.put(params).promise()

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Colaborador registrado com sucesso", statusCode: 20 })
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ error: error.message })
        }
    }
}

module.exports = createEmployee;