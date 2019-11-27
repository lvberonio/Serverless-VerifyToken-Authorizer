import { handler } from 'Middlewares/verifyToken';

describe('test verifyToken', () => {
  // eslint-disable-next-line
  let token = 'yourJWTokenHere';
  let headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'x-api-key': 'd41d8cd98f00b204e9800998ecf8427e',
    'x-site-id': 'wyp',
    'Content-Type': 'application/json',
  };

  it('test verifyToken middleware must pass validation with valid requests', () => {
    const param = {
      headers,
    };

    handler(param, {}, (error, response) => {
      expect(response).toMatchObject({
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: undefined,
            },
          ],
        },
      });
      expect(error).toBeNull();
    });
  });

  it('test verifyToken middleware must not pass validation with expired token', () => {
    const expiredToken = 'yourExpiredJWTokenHere';
    headers = { ...headers, Authorization: `Bearer ${expiredToken}` };
    const param = {
      headers,
    };

    handler(param, {}, (error, response) => {
      expect(response).toBeUndefined();
      expect(error.message).toEqual('jwt expired');
    });
  });

  it('test verifyToken middleware must pass validation with invalid Authorization requests', () => {
    // eslint-disable-next-line
    let token = 'whateverkeyshere';
    headers = { ...headers, Authorization: `Bearer ${token}` };
    const param = {
      headers,
    };

    handler(param, {}, (error, response) => {
      expect(error.message).toEqual('Unauthorized');
      expect(response).toBeUndefined();
    });
  });

  it('test verifyToken middleware must not pass validation if site id is neither wyp nor seeking', () => {
    headers = { ...headers, 'x-site-id': 'mt' };
    const param = {
      headers,
    };

    handler(param, {}, (error, response) => {
      expect(error.message).toEqual('Invalid header site id');
      expect(response).toBeUndefined();
    });
  });

  it('test verifyToken middleware must not pass validation if no site id', () => {
    headers = { ...headers, 'x-site-id': '' };
    const param = {
      headers,
    };

    handler(param, {}, (error, response) => {
      expect(error.message).toEqual('Missing header site id');
      expect(response).toBeUndefined();
    });
  });

  it('test verifyToken middleware must not pass validation if no authorization', () => {
    headers = { ...headers, Authorization: '' };
    const param = {
      headers,
    };

    handler(param, {}, (error, response) => {
      expect(error.message).toEqual('Missing header auth token');
      expect(response).toBeUndefined();
    });
  });
});
