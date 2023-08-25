import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from './Text';
import { css, theme } from '@enterslash/enterus/utils';
import { Space } from './Space';
import { WEEKS } from '@enterslash/utils';

interface Props {
  selectedDays: string[];
  setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>;
}

export const WeekCheckBox = ({ selectedDays, setSelectedDays }: Props) => {
    const weeks = Object.keys(WEEKS)
  const handleSelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays((prev) => prev.filter((d) => d !== day));
    } else {
      setSelectedDays((prev) => [...prev, day]);
    }
  };
  return (
    <>
      <Text color={theme.grey500}>Weekly Frequency</Text>
      <Space height={10} />
      <View style={styles.container}>
        {weeks.map((day, i) => {
          return (
            <View
              key={i}
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => handleSelect(day)}
                style={[
                  styles.box,
                  selectedDays.includes(day) && {
                    backgroundColor: theme.primary,
                  },
                ]}
              >
                <Text
                  bold={selectedDays.includes(day)}
                  color={selectedDays.includes(day) ? 'white' : theme.grey500}
                  size={12}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.white,
    borderColor: theme.grey100,
    borderWidth: 1,
    borderRadius: css.border.radius.sm,
  },
});
