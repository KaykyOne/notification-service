const response = (type) => {

    return {
        100: `Continue in ${type}`,
        200: `OK in ${type}`,
        201: `${type} Created Successfully`,
        400: `Bad Request in ${type}`,
        401: `Unauthorized access in ${type}`,
        403: `Forbidden in ${type}`,
        404: `Not Found in ${type}`,
        500: `Internal Server Error in ${type}`,
    }
}