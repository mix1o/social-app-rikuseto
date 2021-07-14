export const useFetch = async (endpointURL: string, opts?: {}) => {
  const { method, body } = { method: 'POST', body: {}, ...opts };

  const res = await fetch(`${process.env.REACT_APP_API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
};
