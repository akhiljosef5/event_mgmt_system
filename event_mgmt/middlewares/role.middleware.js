function isOrganizer(req, res, next) {
    if (req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Access forbidden, you arent an organizer' });
    }
    next();
}

module.exports = { isOrganizer };
