import { theme } from '@enterslash/enterus/utils';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CheckboxProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onChange,
  size=18,
}) => {
  const handlePress = () => {
    const newValue = !value;
    onChange(newValue);
  };

  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        {
          width: size,
          height: size,
          borderRadius: 3,
        },
      ]}
      onPress={handlePress}
    >
      <View style={value ? styles.check : {}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  check: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.primary,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: theme.grey500,
    marginRight: 10,
    padding: 2,
  },
});
