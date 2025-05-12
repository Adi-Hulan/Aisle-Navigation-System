
// check if the logged user is an admin
const requireAdmin = (req, res, next) => {
    const user = req.user
    if (user.job_title !== 'admin') {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}

export default requireAdmin