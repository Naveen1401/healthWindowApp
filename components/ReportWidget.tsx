import { View, Text, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from "react-native";
import WidgetCard from "./Widgets/WidgetCard";
import WidgetHeader from "./Widgets/WidgetHeader";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import useApi from "@/CustomHooks/useCallAPI";
import { ReportDataContext } from "@/context/ReportContext";
import WidgetList from "./Widgets/WidgetList";
import { handleViewReport } from "@/util/helper";

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

type ReportWidgetProps = {
    onDragStart?: () => void;
};

const ReportWidget: React.FC<ReportWidgetProps> = ({onDragStart}) => {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const { reportData, setReportData } = useContext(ReportDataContext);
    const { callApi, loading } = useApi();
    const [hasFetchedInitial, setHasFetchedInitial] = useState(false);

    // Fetch reports data only once on mount
    const fetchReports = async () => {
        try {
            const request = await callApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/myReports`,
                method: "GET",
                headers: {
                    "Patient-Id": user?.id ?? "-1"
                }
            });

            const reports = request.data || [];

            // Update context only (no local state needed)
            if (setReportData) {
                setReportData(reports);
            }

            setHasFetchedInitial(true);
            return reports;
        } catch (err) {
            console.log("Error fetching reports:", err);
            Alert.alert("Error", "Failed to load reports");
            setHasFetchedInitial(true);
            return [];
        }
    };

    // Initial fetch only if context is empty
    useEffect(() => {
        if (!reportData && !hasFetchedInitial) {
            fetchReports();
        } else {
            setHasFetchedInitial(true);
        }
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const header = (
        <WidgetHeader
            title="Recent Reports"
            onHeaderPress={() => router.push('/home/uploadReports')}
            onDragStart={onDragStart}
        />
    );

    const isLoading = loading && !reportData;

    const content = isLoading ? (
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2563EB" />
        </View>
    ) : (
        <View style={{ padding: 8 }}>
            {reportData?.slice(0, 4).map((report, index) => (
                    <WidgetList
                        key={report.id}
                        index={formatDate(report.reportDate)}
                        value={report.reportName}
                        actionComponent={
                            <TouchableOpacity
                                style={styles.viewButton}
                                onPress={() => handleViewReport(report, user, callApi, router)}
                            >
                                <Text style={styles.viewButtonText}>VIEW</Text>
                            </TouchableOpacity>
                        }
                    />
                ))
            }
        </View>
    );


    return (
        <WidgetCard
            header={header}
            content={content}
            hasData={reportData? reportData.length > 0:false}
            emptyStateComponent={
                <View style={{alignItems: 'center' }}>
                    <Text>No reports available</Text>
                </View>
            }
            footer={
                <TouchableOpacity onPress={() => router.push('/home/myReports')}>
                    <Text style={{ color: '#2563EB' }}>View All Reports</Text>
                </TouchableOpacity>
            }
        />
    );
};

const styles = StyleSheet.create({
    viewButton: {
        backgroundColor: '#4dabf7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        minWidth: 60,
        alignItems: 'center',
    },
    viewButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    uploadButton: {
        backgroundColor: '#4dabf7',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 8,
    },
    uploadButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ReportWidget;