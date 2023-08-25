import { useFocusEffect } from '@react-navigation/native';
import { theme } from '@enterslash/enterus/utils';
import { IsAndroid, IsIos } from '@enterslash/react-native-utils';
import React, { useEffect } from 'react';
import { View, StatusBar, KeyboardAvoidingView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
  primaryBar?: boolean;
  dark?: boolean;
  edge?: ['top' | 'right' | 'bottom' | 'left'];
  keyboardBehavior?: 'padding' | 'height' | 'position' | undefined;
  statusbarColor?: string;
  noStatusbar?: boolean;
}

export const Layout = ({
  children,
  primaryBar,
  edge,
  statusbarColor,
  noStatusbar,
  dark,
  keyboardBehavior,
}: Props) => {
  const insets = useSafeAreaInsets();
  const barColor = () => {
    if (noStatusbar) {
      return 'transparent';
    } else if (statusbarColor) {
      return statusbarColor;
    } else if (primaryBar) {
      return theme.primary;
    } else {
      return theme.white;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(
        dark ? 'light-content' : primaryBar ? 'light-content' : 'dark-content'
      );
      if(IsAndroid){
        StatusBar.setBackgroundColor(barColor());
      }
    }, [])
  );

  return (
    <>
      <StatusBar translucent={true} />
      <SafeAreaView
        edges={['top'] || edge}
        style={{
          flex: 1,
          backgroundColor: barColor(),
        }}
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={-insets.bottom}
          behavior={IsIos ? keyboardBehavior : undefined}
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: theme.white,
          }}
        >
          {children}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};
