import { ScrollView, Text } from 'react-native';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { colors } from '@/theme/tokens';
import type { FilterOption } from '@/stores/faxStore';

export type FilterPillsProps = {
  options: readonly FilterOption[];
  active: FilterOption;
  onChange: (f: FilterOption) => void;
};

export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingRight: 20 }}
    >
      {options.map((opt) => {
        const isActive = opt === active;
        return (
          <HapticPressable
            key={opt}
            haptic="selection"
            onPress={() => onChange(opt)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 9999,
              backgroundColor: isActive ? colors.green900 : '#FFFFFF',
              borderWidth: isActive ? 0 : 1,
              borderColor: colors.gray300,
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: isActive ? '#FFFFFF' : colors.black,
              }}
            >
              {opt}
            </Text>
          </HapticPressable>
        );
      })}
    </ScrollView>
  );
}
