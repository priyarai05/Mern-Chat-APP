const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404);
    next(error);
}

// const errorHandler = (err, req, res, next) => {
//     const statusCode = req.statusCode === 200 ? 500 : req.statusCode;
//     res.status(statusCode)
//     res.json({
//         message: err.message,
//         stack: process.env.NODE_ENV === "production" ? null : err.stack
//     });
// }
const errorHandler = (error, req, res, next) => {
    // Safely determine status code
    let statusCode = res.statusCode;
    if (statusCode === 200 || statusCode === null || statusCode === undefined) {
        statusCode = 500;
    }
    
    res.status(statusCode).json({
        success: false, 
        message: error.message || 'Server Error'
    });
};

module.exports = { notFound, errorHandler }