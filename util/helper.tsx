import { ReportType } from '@/util/type';
import { Router } from 'expo-router';
import { Alert } from 'react-native';

export interface User {
    id: string;
    name: string;
    email: string;
    imageURL: string;
    phoneNo: string;
}

export interface CallApiFunction {
    (config: {
        url: string;
        method: string;
        headers: Record<string, string>;
        body?: string;
    }): Promise<any>;
}

export interface RouterPushFunction {
    (params: {
        pathname: string;
        params: Record<string, string>;
    }): void;
}

export const handleViewReport = async (
    report: ReportType,
    user: User | null,
    callApi: CallApiFunction,
    router: Router
) => {
    try {
        const urlString = `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/common/s3UrlGenerator?key=reports/${user?.id}/${report.reportDate}/${report.reportName}.pdf`;

        const request = await callApi({
            url: urlString,
            method: "GET",
            headers: {
                "Patient-Id": user?.id ?? "-1"
            },
        });

        const presignedUrl = request.data;

        if (!presignedUrl) {
            Alert.alert("Error", "Could not get PDF URL");
            return;
        }

        console.log(presignedUrl);
        

        router.push({
            pathname: '/home/pdfViewer',
            params: { url: encodeURIComponent(presignedUrl) },
        });
    } catch (error) {
        console.error("Error in handleViewReport:", error);
        Alert.alert("Error", "Failed to load report");
    }
};