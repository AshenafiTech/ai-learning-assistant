const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Resource not found';
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'File size is too large';
        statusCode = 400;
    }

    // Multer unexpected field or too many files
    if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.message === 'Unexpected field') {
        message = 'Unexpected file field. Use form-data key "file" with a single PDF.';
        statusCode = 400;
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') { 
        message = 'Invalid token. Please log in again.';
        statusCode = 401;
    }

    // JWT expired error
    if (err.name === 'TokenExpiredError') {
        message = 'Your token has expired. Please log in again.';
        statusCode = 401;
    }

    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;