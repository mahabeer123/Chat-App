// Input validation and sanitization utilities

/**
 * Sanitizes text input by removing potentially harmful content
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .substring(0, 1000); // Limit length
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates message content
 * @param {string} message - Message to validate
 * @returns {object} - Validation result with isValid and error
 */
export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  const sanitized = sanitizeInput(message);
  if (!sanitized) {
    return { isValid: false, error: 'Message cannot be empty after sanitization' };
  }
  
  if (sanitized.length > 1000) {
    return { isValid: false, error: 'Message too long (max 1000 characters)' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Validates user name
 * @param {string} name - Name to validate
 * @returns {object} - Validation result with isValid and error
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name cannot be empty' };
  }
  
  const sanitized = sanitizeInput(name);
  if (!sanitized) {
    return { isValid: false, error: 'Name cannot be empty after sanitization' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: 'Name too long (max 50 characters)' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Validates user status
 * @param {string} status - Status to validate
 * @returns {object} - Validation result with isValid and error
 */
export const validateStatus = (status) => {
  if (!status || typeof status !== 'string') {
    return { isValid: true, sanitized: '' }; // Status can be empty
  }
  
  const sanitized = sanitizeInput(status);
  if (sanitized.length > 100) {
    return { isValid: false, error: 'Status too long (max 100 characters)' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Validates file upload
 * @param {File} file - File to validate
 * @returns {object} - Validation result with isValid and error
 */
export const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only images are allowed' };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large. Maximum size is 5MB' };
  }
  
  return { isValid: true };
}; 