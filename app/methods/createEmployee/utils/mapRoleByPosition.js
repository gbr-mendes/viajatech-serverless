const mapRoleByPosition = (position) => {
    if (position == "Sales Manager") {
        return "SalesManager"
    } else if (position == "General Manager") {
        return "Admin"
    } else if (position == "Content Manager") {
        return "ContentManager"
    }
}

module.exports = mapRoleByPosition