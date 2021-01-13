const sendErrorMessage = (error, req, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
};
module.exports = sendErrorMessage;

// const sendErrorMessage = (error, req, res) => {
//     const sendResponse = (statusCode, status, data, req, res) => {
//         res.status(statusCode).json({
//             status: status,
//             data: data,
//         });
//     };
// };

// module.exports = sendErrorMessage;