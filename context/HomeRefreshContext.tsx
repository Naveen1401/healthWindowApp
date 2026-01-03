import { createContext, useContext, useState } from "react";

const HomeRefreshContext = createContext({
    refreshVersion: 0,
    triggerRefresh: () => { },
    refreshingCount: 0,
    startRefresh: () => { },
    endRefresh: () => { },
});

export const HomeRefreshProvider = ({ children }: any) => {
    const [refreshVersion, setRefreshVersion] = useState(0);
    const [refreshingCount, setRefreshingCount] = useState(0);

    const triggerRefresh = () => {
        setRefreshVersion(prev => prev + 1);
    };

    const startRefresh = () => {
        setRefreshingCount(prev => prev + 1);
    };

    const endRefresh = () => {
        setRefreshingCount(prev => Math.max(0, prev - 1));
    };

    return (
        <HomeRefreshContext.Provider
            value={{
                refreshVersion,
                triggerRefresh,
                refreshingCount,
                startRefresh,
                endRefresh,
            }}
        >
            {children}
        </HomeRefreshContext.Provider>
    );
};

export const useHomeRefresh = () => useContext(HomeRefreshContext);
