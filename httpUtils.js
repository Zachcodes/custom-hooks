// This hook utilizes axios and allows for any kind of request to be made. You can either call it immediately or use it as a post request and pass in a payload to the callback. It can also take in an optional second callback argument that can be invoked later once the request resolves which allows the developers components to stay clean of if logic deciding when to fire.

import { useState, useCallback } from 'react';
import axios from 'axios';

export const useFetchData = ({
  url,
  method = 'get',
  headers = { 'Content-Type': 'application/json' }
}) => {
  const [res, setRes] = useState({
    data: [],
    error: null,
    isLoading: false,
    called: false
  });

  const callAPI = useCallback(
    async (payload, cbOpt = { cb: null, cbArgs: null }) => {
      try {
        setRes(prevState => ({ ...prevState, isLoading: true, called: true }));
        const { data } = await axios({
          method,
          url,
          headers,
          data: payload ? payload : null
        });
        setRes({ data, isLoading: false, error: null, called: true });
        if (cbOpt.cb) cbOpt.cb(...cbOpt.cbArgs);
      } catch (error) {
        setRes({ data: null, isLoading: false, error, called: true });
      }
    },
    [url, headers, method]
  );

  return [res, callAPI];
};
