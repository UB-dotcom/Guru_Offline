import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { StreamType } from '../types/student';
import { useProfileStore } from '../store/profileStore';
import { SUPPORTED_STREAMS } from '../services/curriculumCatalog';

interface StreamSelectionScreenProps {
  navigation: any;
}

export const StreamSelectionScreen: React.FC<StreamSelectionScreenProps> = ({ navigation }) => {
  const { profile, setStream } = useProfileStore();

  const handleSelect = (streamId: StreamType) => {
    setStream(streamId);
  };

  const handleContinue = () => {
    navigation.navigate('SubjectSelection');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 4 OF 6</Text>
        <Text style={styles.title}>Academic Stream</Text>
        <Text style={styles.subtitle}>
          Select your Class {profile.classLevel} study stream to filter specialized subjects
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {SUPPORTED_STREAMS.map((s) => {
          const isSelected = profile.stream === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleSelect(s.id)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${s.name}, ${s.description}`}
            >
              <Text style={styles.streamIcon}>{s.icon}</Text>

              <View style={styles.textCol}>
                <Text style={[styles.streamName, isSelected && styles.streamNameSelected]}>
                  {s.name}
                </Text>
                <Text style={styles.streamDesc}>{s.description}</Text>
              </View>

              <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton
        title="Continue to Subject Selection"
        onPress={handleContinue}
        style={styles.continueBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.gray50,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: spacing.base,
  },
  stepBadge: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: palette.gray900,
  },
  subtitle: {
    ...typography.body,
    color: palette.gray500,
    marginTop: spacing.xs,
  },
  cardsContainer: {
    marginVertical: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.base,
    borderWidth: 2,
    borderColor: palette.gray200,
    minHeight: spacing.minTouchTarget + 24,
  },
  cardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  streamIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  textCol: {
    flex: 1,
  },
  streamName: {
    ...typography.h3,
    color: palette.gray900,
  },
  streamNameSelected: {
    color: palette.primary,
    fontWeight: '800',
  },
  streamDesc: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: palette.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  checkCircleSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primary,
  },
  checkMark: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '900',
  },
  continueBtn: {
    marginTop: spacing.base,
  },
});
