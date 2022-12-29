import { useEffect, useState } from "react";

export default function useIsAuthenticated() {
  const [token, setToken] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const data = await fetch(
          `https://jsonplaceholder.typicode.com/todos/1`
        );
        const response = await data.json();
        setToken(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { token, error, loading };
}
