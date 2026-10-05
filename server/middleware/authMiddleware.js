import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getJwtSecret = () => {
  return process.env.JWT_SECRET || 'taskflow_default_jwt_secret_key_for_dev_2026';
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token || token === 'null' || token === 'undefined') {
        res.status(401);
        return next(new Error('Not authorized, authentication token is missing'));
      }

      // Verify token
      const decoded = jwt.verify(token, getJwtSecret());

      // Extract user ID and attach authenticated user to request
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, user account no longer exists'));
      }

      req.user = user;
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, invalid or expired token'));
    }
  }

  res.status(401);
  return next(new Error('Not authorized, no authentication token provided'));
};

export { getJwtSecret };
