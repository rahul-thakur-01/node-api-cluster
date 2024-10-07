import redis from './rateLimiterClient.js'; 

const rateLimiterScript = `
  local current
  current = redis.call("INCR", KEYS[1]) -- Increment the count
  if tonumber(current) == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1]) -- Set expiration if this is the first increment
  end
  return current -- Return the current count
`;

/**
 * Checks and updates the rate limit for a given user using a Lua script.
 * @param {string} userId - The unique identifier for the user.
 * @param {number} limit - The maximum number of allowed requests.
 * @param {number} windowInSeconds - The time window in seconds.
 * @returns {Promise<boolean>} - Returns true if under the limit, else false.
 */
export const isUnderLimit = async (userId, limit = 5, windowInSeconds = 60) => {
  const key = `rate_limit:${userId}`;
  const currentCount = await redis.eval(rateLimiterScript, 1, key, windowInSeconds); 
  console.log("Rate Limiter Js: ", currentCount); 
  
  if (currentCount > limit) {
    return false; 
  }

  return true; 
};