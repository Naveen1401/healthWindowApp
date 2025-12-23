import React, { ReactNode } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'primary-inverted' | 'secondary' | 'secondary-inverted' | 'outline' | 'outline-inverted' | 'danger' | 'danger-inverted' | 'text';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    leftIcon,
    rightIcon,
    style,
    textStyle,
}) => {
    const getButtonStyle = () => {
        let baseStyle: ViewStyle = {};
        let variantStyle: ViewStyle = {};

        // Size styles
        switch (size) {
            case 'small':
                baseStyle.paddingHorizontal = 16;
                baseStyle.paddingVertical = Platform.OS === 'ios' ? 8 : 6;
                baseStyle.minHeight = 36;
                break;
            case 'medium':
                baseStyle.paddingHorizontal = 20;
                baseStyle.paddingVertical = Platform.OS === 'ios' ? 12 : 10;
                baseStyle.minHeight = 44;
                break;
            case 'large':
                baseStyle.paddingHorizontal = 24;
                baseStyle.paddingVertical = Platform.OS === 'ios' ? 16 : 14;
                baseStyle.minHeight = 52;
                break;
        }

        // Variant styles
        switch (variant) {
            case 'primary':
                variantStyle = {
                    backgroundColor: disabled ? '#94d3a2' : '#007AFF',
                    ...Platform.select({
                        android: {
                            backgroundColor: disabled ? '#94d3a2' : '#2196F3',
                            elevation: disabled ? 0 : 2,
                            shadowColor: '#000',
                        },
                    }),
                };
                break;
            case 'primary-inverted':
                variantStyle = {
                    backgroundColor: 'transparent',
                    // NO BORDER - just transparent background
                };
                break;
            case 'secondary':
                variantStyle = {
                    backgroundColor: disabled ? '#e5e5ea' : '#f2f2f7',
                    ...Platform.select({
                        ios: {
                            borderWidth: 1,
                            borderColor: disabled ? '#e5e5ea' : '#c7c7cc',
                        },
                        android: {
                            elevation: disabled ? 0 : 1,
                            shadowColor: '#000',
                        },
                    }),
                };
                break;
            case 'secondary-inverted':
                variantStyle = {
                    backgroundColor: 'transparent',
                    // NO BORDER - just transparent background
                };
                break;
            case 'outline':
                variantStyle = {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: disabled ? '#c7c7cc' : '#007AFF',
                    ...Platform.select({
                        android: {
                            borderColor: disabled ? '#c7c7cc' : '#2196F3',
                        },
                    }),
                };
                break;
            case 'outline-inverted':
                variantStyle = {
                    backgroundColor: disabled ? '#94d3a2' : '#007AFF',
                    ...Platform.select({
                        android: {
                            backgroundColor: disabled ? '#94d3a2' : '#2196F3',
                            elevation: disabled ? 0 : 1,
                            shadowColor: '#000',
                        },
                    }),
                };
                break;
            case 'danger':
                variantStyle = {
                    backgroundColor: disabled ? '#ffb3b8' : '#ff3b30',
                    ...Platform.select({
                        android: {
                            backgroundColor: disabled ? '#ffb3b8' : '#f44336',
                            elevation: disabled ? 0 : 2,
                            shadowColor: '#000',
                        },
                    }),
                };
                break;
            case 'danger-inverted':
                variantStyle = {
                    backgroundColor: 'transparent',
                    // NO BORDER - just transparent background
                };
                break;
            case 'text':
                variantStyle = {
                    backgroundColor: 'transparent',
                    minHeight: undefined,
                    paddingVertical: 8,
                };
                break;
        }

        // Platform-specific overrides
        const platformStyle = Platform.select({
            ios: {
                borderRadius: 8,
            },
            android: {
                borderRadius: 4,
            },
        });

        return [
            styles.baseButton,
            baseStyle,
            variantStyle,
            platformStyle,
            fullWidth && styles.fullWidth,
            disabled && styles.disabled,
            style,
        ];
    };

    const getTextStyle = () => {
        // Initialize with default style
        let variantTextStyle: TextStyle = {
            color: '#000000' // Default black color
        };

        // Override based on variant
        switch (variant) {
            case 'primary':
                variantTextStyle.color = '#ffffff';
                break;
            case 'primary-inverted':
                variantTextStyle.color = disabled ? '#94d3a2' : '#007AFF';
                // Apply platform-specific styles directly
                if (Platform.OS === 'android') {
                    variantTextStyle.color = disabled ? '#94d3a2' : '#2196F3';
                }
                break;
            case 'secondary':
                variantTextStyle.color = disabled ? '#8e8e93' : '#000000';
                break;
            case 'secondary-inverted':
                variantTextStyle.color = disabled ? '#e5e5ea' : '#8e8e93';
                if (Platform.OS === 'android') {
                    variantTextStyle.color = disabled ? '#e5e5ea' : '#9E9E9E';
                }
                break;
            case 'outline':
                variantTextStyle.color = disabled ? '#c7c7cc' : '#007AFF';
                if (Platform.OS === 'android') {
                    variantTextStyle.color = disabled ? '#c7c7cc' : '#2196F3';
                }
                break;
            case 'outline-inverted':
                variantTextStyle.color = '#ffffff';
                break;
            case 'danger':
                variantTextStyle.color = '#ffffff';
                break;
            case 'danger-inverted':
                variantTextStyle.color = disabled ? '#ffb3b8' : '#ff3b30';
                if (Platform.OS === 'android') {
                    variantTextStyle.color = disabled ? '#ffb3b8' : '#f44336';
                }
                break;
            case 'text':
                variantTextStyle.color = disabled ? '#c7c7cc' : '#007AFF';
                if (Platform.OS === 'android') {
                    variantTextStyle.color = disabled ? '#c7c7cc' : '#2196F3';
                }
                break;
        }

        // Size text styles
        let sizeTextStyle: TextStyle = {};
        switch (size) {
            case 'small':
                sizeTextStyle.fontSize = 14;
                break;
            case 'medium':
                sizeTextStyle.fontSize = 16;
                break;
            case 'large':
                sizeTextStyle.fontSize = 18;
                break;
        }

        return [
            styles.baseText,
            sizeTextStyle,
            variantTextStyle,
            disabled && styles.disabledText,
            textStyle,
        ];
    };

    // Get activity indicator color based on variant
    const getActivityIndicatorColor = () => {
        switch (variant) {
            case 'primary':
            case 'outline-inverted':
            case 'danger':
                return '#ffffff';
            case 'primary-inverted':
                return '#007AFF';
            case 'secondary-inverted':
                return '#8e8e93';
            case 'danger-inverted':
                return '#ff3b30';
            case 'secondary':
                return '#000000';
            case 'outline':
                return '#007AFF';
            case 'text':
                return '#007AFF';
            default:
                return '#007AFF';
        }
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            accessibilityRole="button"
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={getActivityIndicatorColor()}
                />
            ) : (
                <>
                    {leftIcon && <>{leftIcon}</>}
                    <Text style={getTextStyle()}>{title}</Text>
                    {rightIcon && <>{rightIcon}</>}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    },
    disabledText: {
        opacity: 0.6,
    },
    baseText: {
        fontWeight: '600',
        letterSpacing: 0.5,
        ...Platform.select({
            ios: {
                fontWeight: '600',
            },
            android: {
                fontWeight: '500',
                fontFamily: 'sans-serif-medium',
            },
        }),
    },
});

export default Button;