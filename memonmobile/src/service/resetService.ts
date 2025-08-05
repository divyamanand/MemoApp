import { ErrorResponse } from '../constants/types';
import { resetApp } from '../store/store';

export const handleReset = async (err: ErrorResponse) => {
  try {
    await resetApp();
  } catch (err) {
    console.error('Reset failed:', err);
  }
};
