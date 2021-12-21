import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post(
    `${process.env.REACT_APP_API}/auth/create-account`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          message:
            'Your account has been created successfully. You can now sign in',
        })
      )
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, rest };
