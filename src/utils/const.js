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
    CREATE_PUBLIC_KEY_TOKEN_ERROR: 'Error generating public key!'
  },
  CODES: {
    SUCCESS: 200,
    CREATED: 201,
    ERROR: 400,
    EMAIL_ALREADY_EXISTS: 409
  }
};