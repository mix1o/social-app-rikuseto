import { createMachine, interpret } from 'xstate';

type MachineStateInterface =
  | { value: 'signIn'; context: undefined }
  | { value: 'signUp'; context: undefined }
  | { value: 'resetPassword'; context: undefined };

export type MachineEvents =
  | { type: 'SIGN_UP' }
  | { type: 'SIGN_IN' }
  | { type: 'RESET_PASSWORD' };

export const AuthStateMachine = createMachine<
  undefined,
  MachineEvents,
  MachineStateInterface
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

export const authService = interpret(AuthStateMachine);
authService.start();
