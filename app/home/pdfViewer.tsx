import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReportViewerScreen = () => {
    const { url } = useLocalSearchParams<{ url: string }>();
    const decodedUrl = decodeURIComponent(url);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>Loading report...</Text>
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <WebView
                source={{ uri: decodedUrl }}
                style={[styles.webview, isLoading && { height: 0 }]}
                startInLoadingState={false}
                onLoadStart={() => {
                    setIsLoading(true);
                    setError(null);
                }}
                onLoadEnd={() => setIsLoading(false)}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    setError(`Failed to load report: ${nativeEvent.description}`);
                    setIsLoading(false);
                }}
                renderError={(errorName) => (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error: {errorName}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ReportViewerScreen;