import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { BoardType } from '../types/student';
import { useProfileStore } from '../store/profileStore';
import { SUPPORTED_BOARDS } from '../services/curriculumCatalog';

interface BoardSelectionScreenProps {
  navigation: any;
}

export const BoardSelectionScreen: React.FC<BoardSelectionScreenProps> = ({ navigation }) => {
  const { profile, setBoard, setState } = useProfileStore();

  const handleSelect = (boardId: BoardType) => {
    setBoard(boardId);
  };

  const handleContinue = () => {
    if (profile.board === 'state') {
      navigation.navigate('StateSelection');
    } else {
      setState(null);
      navigation.navigate('ClassSelection');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 2 OF 6</Text>
        <Text style={styles.title}>Education Board</Text>
        <Text style={styles.subtitle}>
          Select your affiliated educational board for textbook alignment
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {SUPPORTED_BOARDS.map((b) => {
          const isSelected = profile.board === b.id;
          return (
            <TouchableOpacity
              key={b.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleSelect(b.id)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${b.shortName}, ${b.name}`}
            >
              <View style={styles.badgeCol}>
                <View style={[styles.boardBadge, isSelected && styles.boardBadgeSelected]}>
                  <Text style={[styles.boardBadgeText, isSelected && styles.boardBadgeTextSelected]}>
                    {b.shortName}
                  </Text>
                </View>
              </View>

              <View style={styles.textCol}>
                <Text style={[styles.boardName, isSelected && styles.boardNameSelected]}>
                  {b.name}
                </Text>
                <Text style={styles.boardDesc}>{b.description}</Text>
              </View>

              <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton
        title={profile.board === 'state' ? 'Continue to State Selection' : 'Continue to Class Selection'}
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
  badgeCol: {
    marginRight: spacing.md,
  },
  boardBadge: {
    backgroundColor: palette.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    minWidth: 64,
    alignItems: 'center',
  },
  boardBadgeSelected: {
    backgroundColor: palette.primary,
  },
  boardBadgeText: {
    ...typography.h3,
    fontSize: 14,
    color: palette.gray800,
    fontWeight: '800',
  },
  boardBadgeTextSelected: {
    color: palette.white,
  },
  textCol: {
    flex: 1,
  },
  boardName: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: palette.gray900,
  },
  boardNameSelected: {
    color: palette.primary,
  },
  boardDesc: {
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
