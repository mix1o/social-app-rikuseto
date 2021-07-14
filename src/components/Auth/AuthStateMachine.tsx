import { createMachine } from 'xstate';

type StatesInterface =
  | { value: 'signIn'; context: undefined }
  | { value: 'signUp'; context: undefined }
  | { value: 'resetPassword'; context: undefined };

type Events =
  | { type: 'SIGN_UP' }
  | { type: 'SIGN_IN' }
  | { type: 'RESET_PASSWORD' };

export const AuthStateMachine = createMachine<
  undefined,
  Events,
  StatesInterface
>({
  id: 'authMachine',
  initial: 'signIn',
  states: {
    signIn: {
      on: {
        SIGN_UP: 'signUp',
        RESET_PASSWORD: 'resetPassword',
      },
    },
    signUp: {
      on: {
        SIGN_IN: 'signIn',
      },
    },
    resetPassword: {
      on: {
        SIGN_UP: 'signUp',
        SIGN_IN: 'signIn',
      },
    },
  },
});
