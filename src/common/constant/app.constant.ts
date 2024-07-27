export const appConstant = {
  APP_BASE_URL: process.env.BASE_URL,
  REDIS: {
    MODE: {
      EX: 'EX',
      REDIS_DURATION: 86400,
    },
  },
  REDIS_CONNECTION_FAILED: 'Redis connection failed',
  TOKENS: {
    REFRESH: {
      REDIS_DURATION: 7776000, // in seconds
      JWT_DURATION: '90d',
    },
  },
};
