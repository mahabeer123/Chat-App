import PropTypes from 'prop-types';

// User object prop types
export const UserPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profile_pic: PropTypes.string,
    status: PropTypes.string,
    lastSeen: PropTypes.string,
  }).isRequired,
});

// Message object prop types
export const MessagePropTypes = PropTypes.shape({
  text: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  receiver: PropTypes.string.isRequired,
});

// Auth context prop types
export const AuthContextPropTypes = PropTypes.shape({
  userData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profile_pic: PropTypes.string,
    status: PropTypes.string,
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isUploading: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired,
  updatePhoto: PropTypes.func.isRequired,
});

// Toast component prop types
export const ToastPropTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

// Error boundary prop types
export const ErrorBoundaryPropTypes = {
  children: PropTypes.node.isRequired,
}; 