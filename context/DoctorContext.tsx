import { createContext, ReactNode, useState } from "react"

interface DoctorDetails {
    degree: string;
    "yrs of experience": number;
}

interface Doctor {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    affiliatedPatientIds: number[] | null;
    doctorDetails: DoctorDetails;
    requestedAffiliationPatientIds: number[] | null;
    createdAt: string;
    updatedAt: string;
}

interface ReportContextType {
    doctorData: Doctor[] | null,
    setDoctorData: (data: Doctor[] | null) => void
}

export const DoctorDataContext = createContext<ReportContextType>({
    doctorData: null,
    setDoctorData: () => { }
});

export const DoctorDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [doctorData, setDoctorData] = useState<Doctor[] | null>(null);
    return (
        <DoctorDataContext.Provider value={{ doctorData, setDoctorData }}>
            {children}
        </DoctorDataContext.Provider>
    )
};