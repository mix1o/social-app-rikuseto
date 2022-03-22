export const createParams = (params: {}) => {
  return new URLSearchParams(params).toString();
};
