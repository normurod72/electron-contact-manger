import { useCallback, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

export function useAsync<T, TError = unknown>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<{
    response?: T;
    pending?: boolean;
    error?: TError;
  }>({});

  const execute = useCallback(
    (...args) => {
      setState({ pending: true });

      return asyncFunction(...args)
        .then((response) => {
          setState({ response });
        })
        .catch((error) => {
          setState({ error });
        });
    },
    [asyncFunction]
  );

  useDeepCompareEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { execute, ...state };
}
