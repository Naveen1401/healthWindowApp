import { createContext, ReactNode, useState } from "react"

interface ReportType {
    id: number,
    patientId: number,
    reportName: string,
    fileExtension: string,
    reportDate: string,
    createdAt: string,
    updatedAt: string,
    deleted: boolean
}

interface ReportContextType {
    reportData: ReportType[] | null;
    setReportData: React.Dispatch<React.SetStateAction<ReportType[] | null>>;
}  

export const ReportDataContext = createContext<ReportContextType>({
    reportData:null,
    setReportData: () => {}
});

export const ReportDataProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [reportData, setReportData] = useState<ReportType[]|null>(null);
    return (
        <ReportDataContext.Provider value={{reportData, setReportData}}>
            {children}
        </ReportDataContext.Provider>
    )
};