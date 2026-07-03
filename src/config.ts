/**
 * Application configuration
 */
export const config = {
  version: '1.00',
  appName: 'Taskly',
  database: {
    name: 'TasklyDB',
    version: 1,
  },
  ai: {
    textModel: 'gemini-2.5-flash',
    imageModel: 'imagen-4.0-fast-generate-001',
  },
  devCredentials: {
    username: 'benpay',
    password: 'Traducete1!',
  },
  branding: {
    userName: 'Benpay User',
    planName: 'Plan Premium',
    userInitials: 'BP',
  }
};
