import { Alert } from "react-native";

export const confirmation = ({
    title,
    message,
    onConfirm,
    onCancel,
}: {
    title?: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
}) => {
    return Alert.alert(
        title || 'Are your sure?',
        message,
        [
            {
                text: 'Yes',
                onPress: onConfirm,
            },
            {
                text: 'No',
                ...(onCancel && { onPress: onCancel })
            },
        ]
    );
};