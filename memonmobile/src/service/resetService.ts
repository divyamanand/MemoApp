import { resetApp } from '../store/store';

export const handleReset = async () => {
  try {
    await resetApp();
  } catch (err) {
    console.error('Reset failed:', err);
  }
};
