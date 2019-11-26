import middy from 'middy';
import { enqueue } from 'Core/queueRepository';
import { http } from 'slsrun/middlewares';
import { app } from '../config';

const originalHandler = async event => {
  const result = await enqueue(JSON.parse(event.body), 'phantomQueue');

  return { result };
};

// eslint-disable-next-line import/prefer-default-export
export const handler = middy(originalHandler);

handler.use(http({ debugMode: app.debug }));
