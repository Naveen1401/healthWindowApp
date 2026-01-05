import { createContext, ReactNode, useState } from "react"
import { ReportType } from '@/util/type';

interface ReportContextType {
    reportData: ReportType[] | null;
    setReportData: React.Dispatch<React.SetStateAction<ReportType[] | null>>;
    clearReportData: () => void;
}  

export const ReportDataContext = createContext<ReportContextType>({
    reportData:null,
    setReportData: () => {},
    clearReportData: () => {}
});

export const ReportDataProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [reportData, setReportData] = useState<ReportType[]|null>(null);
    const clearReportData = () => {
        setReportData(null);
    };
    return (
        <ReportDataContext.Provider value={{ reportData, setReportData, clearReportData }}>
            {children}
        </ReportDataContext.Provider>
    )
};