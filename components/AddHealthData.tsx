import { HeathDataType } from "@/util/type";
import AddBloodPressure from "./HealthData/AddForm/AddBloodPressure";
import AddGlucose from "./HealthData/AddForm/AddGlucose";
import AddInsuline from "./HealthData/AddForm/AddInsuline";
import AddWeight from "./HealthData/AddForm/AddWeight";

export interface AddHealthDataProp {
    type: HeathDataType;
    visibility: boolean;
    setVisibility: (state: boolean) => void;
    onSave: (data: any) => void
}

const AddHealthData: React.FC<AddHealthDataProp> = ({ type, visibility, setVisibility, onSave }) => {

    switch (type) {
        case 'bloodPressure':
            return (
                <AddBloodPressure visible={visibility} setVisible={setVisibility} onSave={onSave}/>
            )
        case 'glucose':
            return (
                <AddGlucose visible={visibility} setVisible={setVisibility} onSave={onSave} />
            )
        case 'insulin':
            return (
                <AddInsuline visible={visibility} setVisible={setVisibility} onSave={onSave} />
            )
        case 'weight':
            return (
                <AddWeight visible={visibility} setVisible={setVisibility} onSave={onSave}/>
            )
        default:
            break;
    }
}

export default AddHealthData;