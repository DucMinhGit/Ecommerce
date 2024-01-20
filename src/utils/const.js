module.exports = {
  SALT_OR_ROUNDS: 10,
  ENCRYPT_ENCODING: 'hex',
  ROLES: {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
  },
  MESSAGES: {
    EMAIL_ALREADY_EXISTS: 'Email already exists!',
    CREATE_PUBLIC_KEY_TOKEN_ERROR: 'Error generating public key!',
    NOT_FOUND: 'Not Found!',
    ERROR: 'Error!',
    INTERNAL_SERVER_ERROR: 'Internal Server Error!',
    FORBIDDEN: 'Unauthorized access!',
    CONFLICT: 'Conflict error!',
    BAD_REQUEST: 'Bad request error!',
    REGISTER_SUCCESS: 'Account registration successful!',
    NOT_REGISTERED: 'Shop not registered!',
    INVALID_REQUEST: 'Invalid Request!',
    NOT_FOUND_KEY: 'Not found key!',
    INVALID_USER: 'Invalid user!',
    LOGOUT_SUCCESS: 'Logout Success!',
    CREATE_SHOP_ERROR: 'There was an error when creating the shop, please come back after a few minutes'
  },
  CODES: {
    SUCCESS: 200,
    CREATED: 201,
    ERROR: 500,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    CONFLICT: 409
  },
  STATUS: {
    ERROR: 'error',
    SUCCESS: 'success',
    CREATED: 'created'
  }
};