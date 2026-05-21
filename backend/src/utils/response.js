/**
 * Utility helper to standardize API responses across the application.
 */

const successResponse = (res, statusCode = 200, message, data = null) => {
    const response = { status: 'success', message };
    if (data !== null) response.data = data;
    return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 500, message, errors = null) => {
    const response = { status: 'error', message };
    if (errors !== null) response.errors = errors;
    return res.status(statusCode).json(response);
};

// EXPORTACIÓN MODERNA (ESM)
export {
    successResponse,
    errorResponse
};