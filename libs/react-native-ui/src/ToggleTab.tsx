import React from 'react';
import { StyleProp, StyleSheet, TextStyle, Touchable, TouchableOpacity, View } from 'react-native';
import { Text } from './Text';
import { css, theme } from '@enterslash/enterus/utils';

interface Props {
  tabs: {
    title: string;
    value: string | string[];
  }[];
  active: number;
  onTabChange?: (tab: number) => void;
  tabTitleStyle?: StyleProp<TextStyle>;
}
export const ToggleTab = ({ tabs, active, onTabChange, tabTitleStyle }: Props) => {
  const isActive = (tab: number) => {
    return active === tab;
  };
  return (
    <View style={styles.container}>
      {tabs.map((tab, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={[styles.tab, isActive(i) && styles.active]}
            onPress={() => onTabChange && onTabChange(i)}
          >
            <Text
              style={[{fontSize: 13},tabTitleStyle]}
              bold
              color={isActive(i) ? 'white' : theme.grey200}
              center
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.grey100,
    borderWidth: 1,
    borderRadius: css.border.radius.sm,
    padding: 3,
  },
  active: {
    backgroundColor: theme.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: css.border.radius.sm - 2,
    width: '100%',
  },
});
