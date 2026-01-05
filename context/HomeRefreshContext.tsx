import { createContext, useContext, useState } from "react";

const HomeRefreshContext = createContext({
    refreshVersion: 0,
    triggerRefresh: () => { },
    refreshingCount: 0,
    startRefresh: () => { },
    endRefresh: () => { },
    clearRefreshContext: () => {}
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

    const clearRefreshContext = ()=>{
        setRefreshVersion(0);
        setRefreshingCount(0);
    }

    return (
        <HomeRefreshContext.Provider
            value={{
                refreshVersion,
                triggerRefresh,
                refreshingCount,
                startRefresh,
                endRefresh,
                clearRefreshContext
            }}
        >
            {children}
        </HomeRefreshContext.Provider>
    );
};

export const useHomeRefresh = () => useContext(HomeRefreshContext);
