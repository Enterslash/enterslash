import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import Toast, {
  SuccessToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';

const toastConfig = {
  success: (props: any) => (
    <SuccessToast
      {...props}
      text1Style={styles.successText}
      text1NumberOfLines={3}
      style={styles.success}
      contentContainerStyle={[styles.success, contentContainerStyle]}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={styles.errorText}
      text1NumberOfLines={3}
      style={styles.error}
      contentContainerStyle={[styles.error, contentContainerStyle]}
    />
  ),
  // info: (props: any) => (
  //   <InfoToast
  //     {...props}
  //     text1Style={styles.infoText}
  //     text1NumberOfLines={3}
  //     style={styles.info}
  //     contentContainerStyle={styles.info}
  //   />
  // ),
};

const text1Style: TextStyle = {
  fontWeight: 'bold',
  fontSize: 15,
  // opacity: 8,
  // textAlign: 'center',
};

const borderRadius = 10;

const contentContainerStyle = {
  borderRadius,
  borderWidth: 0.5,
  borderLeftWidth: 5,
  // height: 50,
};

const success = {
  background: '#d0ffd2',
  border: '#4caf50',
  text: '#4caf50',
};

const error = {
  background: '#ffcac6',
  border: '#f44336',
  text: '#f44336',
};

// const info = {
//   background: '#0c0d0ea8',
//   border: '#0c0d0ea8',
// }

const styles = StyleSheet.create({
  // info: {
  //   ...contentContainerStyle,
  //   borderLeftColor: info.border,
  //   backgroundColor: info.background,
  // },
  // infoText: {
  //   ...text1Style,
  //   color: 'white',
  // },
  success: {
    borderRadius,
    borderColor: success.border,
    borderLeftWidth: 0,
    backgroundColor: success.background,
  },
  successText: {
    ...text1Style,
    color: success.text,
  },
  error: {
    borderRadius,
    borderColor: error.border,
    borderLeftWidth: 0,
    backgroundColor: error.background,
  },
  errorText: {
    ...text1Style,
    color: error.text,
  },
});

export const AlertInitializer = () => <Toast config={toastConfig} />;
