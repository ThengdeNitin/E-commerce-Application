const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'Strict'
    };

    // Exclude sensitive data
    const { password, otp, ...safeUser } = user._doc;

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user: safeUser,
            token
        });
};

export default sendToken;
