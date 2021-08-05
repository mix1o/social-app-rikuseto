import { createHook } from 'react-sweet-state';
import Store from './store';

export const useCounter = createHook(Store);
