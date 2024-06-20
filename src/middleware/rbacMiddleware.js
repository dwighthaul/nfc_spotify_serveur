// Check if the user has the required permission for a route
exports.checkPermission = (permission) => {

	return (req, res, next) => {
		const userPermissions = req.session.user?.Role?.permissions ? req.session.user.Role.permissions : [];

		if (userPermissions.includes(permission)) {
			return next();
		} else {
			return res.status(403).json({ error: 'Access denied' });
		}
	};
};