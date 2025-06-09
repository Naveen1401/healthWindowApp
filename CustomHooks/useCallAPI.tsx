import { useState, useCallback } from 'react';

interface APIProps {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
}

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const callApi = useCallback(async ({ url, method = 'GET', headers, body }: APIProps) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(headers || {}),
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { callApi, loading, error };
};

export default useApi;
