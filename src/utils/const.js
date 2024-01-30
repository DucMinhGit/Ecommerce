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
    CREATE_SHOP_ERROR: 'There was an error when creating the shop, please come back after a few minutes!',
    REFRESH_TOKEN_FORBIDDEN: 'Something wrong happend !! please relogin',
    REFRESH_TOKEN_SUCCESS: 'Refresh token success!',
    CREATE_CLOTHING_ERROR: 'Create new Clothing error!',
    CREATE_ELECTRONICS_ERROR: 'Create new Electronis error!',
    CREATE_PRODUCT_ERROR: 'Create Product error!',
    INVALID_PRODUCT_TYPES: 'Invalid Product Types',
    DISCOUNT_EXPIRED: 'Discount code has expried!',
    DISCOUNT_ERROR_SET_DATE: 'Start date must be before end_date',
    DISCOUNT_EXISTS: 'Discount exists!'
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