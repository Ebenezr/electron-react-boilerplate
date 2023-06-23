import { useState, useEffect } from 'react';
// hash local storage
const STORAGE_KEY = 'authObject';
// Load data from local storage
const loadData = async () => {
  let data = null;
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      data = JSON.parse(storedData);
    }
  }
  return data;
};

export function useIsAuthenticated() {
  const [authObject, setAuthObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    loadData().then((data) => {
      setAuthObject(data);
      setIsLoading(false);
    });
  }, []);

  const isAuthenticated = authObject && authObject?.authenticated;
  const token = authObject && authObject?.token;
  const role = authObject && authObject?.role;
  const userId = authObject && authObject?.userId;
  const name = authObject && authObject?.name;
  const email = authObject && authObject?.email;
  const expiresAt = authObject && authObject?.expiresAt;

  return {
    isAuthenticated,
    isLoading,
    token,
    role,
    userId,
    expiresAt,
    name,
    email,
  };
}
