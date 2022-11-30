
var response = (status, data) => {
    const json = {
        message: status,
        data: data
    }
    return json
}


exports.response = response;