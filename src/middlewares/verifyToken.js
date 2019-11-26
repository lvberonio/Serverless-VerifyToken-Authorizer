import middy from 'middy';
import jwtVerify from 'jsonwebtoken/verify';
import { app } from '../config';

function displayError(errorMessage) {
  const error = new Error(errorMessage);
  error.statusCode = 403;
  throw error;
}

function validateSiteId(id) {
  // eslint-disable-next-line no-unused-expressions
  !id && displayError('Missing header site id');

  // eslint-disable-next-line no-unused-expressions
  !['wyp', 'seeking'].includes(id) && displayError('Invalid header site id');
}

const originalHandler = async (event, context, callback) => {
  const { headers } = event;
  const token = headers.Authorization;
  const siteId = headers['x-site-id'];

  // checks header validation
  // eslint-disable-next-line no-unused-expressions
  !token && displayError('Missing header auth token');
  validateSiteId(siteId);

  try {
    // decodes JWT and assigns site id and hash id to event
    const bearerToken = token.split(' ')[1];
    const decoded = await jwtVerify(bearerToken, app.jwt.secret[siteId]);

    // eslint-disable-next-line no-param-reassign
    event.authSiteId = siteId;
    // eslint-disable-next-line no-param-reassign
    event.authUserHashId = decoded.user.hashId;

    const authResponse = {};
    const policyDocument = {};

    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    policyDocument.Statement.push({
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: event.methodArn,
    });

    authResponse.policyDocument = policyDocument;
    authResponse.principalId = decoded.user.hashId;

    return callback(null, authResponse);
  } catch (error) {
    // sets default error code to ForbiddenError (403)
    error.statusCode = 403;
    if (error.name === 'TokenExpiredError') {
      // sets error code to TokenExpiredError (401)

      // eslint-disable-next-line no-console
      console.log('TokenExpiredError', error.name, error.message);

      // eslint-disable-next-line no-ex-assign
      error = {
        ...error,
        code: 40101002,
        message_detail: 'Token has expired',
      };

      throw error;
    }

    // eslint-disable-next-line no-console
    console.log('JsonWebTokenError', error.name, error.message);
    return callback('Unauthorized');
  }
};

// eslint-disable-next-line import/prefer-default-export
export const handler = middy(originalHandler);
