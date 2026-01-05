import { createContext, ReactNode, useState } from "react"

interface DoctorDetails {
    degree: string;
    "yrs of experience": number;
}

interface Doctor {
    id: number;
    userId: number;
    first_name: string;
    last_name: string;
    affiliatedPatientIds: number[] | null;
    doctorDetails: DoctorDetails;
    requestedAffiliationPatientIds: number[] | null;
    createdAt: string;
    updatedAt: string;
}

interface DoctorContextType {
    doctorData: Doctor[] | null,
    setDoctorData: (data: Doctor[] | null) => void,
    clearDoctorContext: () => void
}

export const DoctorDataContext = createContext<DoctorContextType>({
    doctorData: null,
    setDoctorData: () => {},
    clearDoctorContext: () => {}
});

export const DoctorDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [doctorData, setDoctorData] = useState<Doctor[] | null>(null);
    const clearDoctorContext = () =>{
        setDoctorData(null);
    }
    return (
        <DoctorDataContext.Provider value={{ doctorData, setDoctorData, clearDoctorContext }}>
            {children}
        </DoctorDataContext.Provider>
    )
};