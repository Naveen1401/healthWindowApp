import { AuthContext } from '@/context/AuthContext';
import { useState, useCallback, useContext } from 'react';

interface APIProps {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
}

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);

    const callApi = useCallback(async ({ url, method = 'GET', headers, body }: APIProps) => {
        setLoading(true);
        setError(null);

        const makeRequest = async (token?: string) => {
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token || accessToken}`,
                    ...(headers || {}),
                },
                body: body ? body : undefined,
            });
            return response;
        };

        try {
            // FIRST REQUEST
            let response = await makeRequest();

            // IF TOKEN EXPIRED → TRY REFRESH
            if (response.status === 403) {
                console.log("403 detected → trying refresh token");

                const newToken = await refreshAccessToken();

                if (!newToken) {
                    console.log("Refresh failed → logging out");
                    await logout();
                    throw new Error("Session expired. Please log in again.");
                }

                // RETRY ORIGINAL REQUEST WITH NEW TOKEN
                response = await makeRequest(newToken);
            }

            // STILL NOT OK AFTER RETRY
            if (!response.ok) {
                let errMsg = "Something went wrong while making API call";

                try {
                    const jsonError = await response.json();
                    errMsg = jsonError?.message || errMsg;
                } catch { }

                setError(errMsg);
                throw new Error(errMsg);
            }

            // SUCCESS
            const data = await response.json();
            return data;

        } catch (err: any) {
            setError(err?.message || err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [accessToken, refreshAccessToken, logout]);

    return { callApi, loading, error };
};

export default useApi;