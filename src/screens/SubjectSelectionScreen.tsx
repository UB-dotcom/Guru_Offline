import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useProfileStore } from '../store/profileStore';
import { getSubjectsForProfile } from '../services/curriculumCatalog';

interface SubjectSelectionScreenProps {
  navigation: any;
}

export const SubjectSelectionScreen: React.FC<SubjectSelectionScreenProps> = ({ navigation }) => {
  const { profile, toggleSubject, setSelectedSubjects } = useProfileStore();

  const availableSubjects = getSubjectsForProfile(
    profile.board,
    profile.state,
    profile.classLevel,
    profile.stream,
    profile.language
  );

  const handleToggle = (subjectId: string) => {
    toggleSubject(subjectId);
  };

  const handleSelectAll = () => {
    setSelectedSubjects(availableSubjects.map((s) => s.id));
  };

  const handleContinue = () => {
    // Ensure at least one subject is selected
    if (profile.selectedSubjects.length === 0 && availableSubjects.length > 0) {
      setSelectedSubjects([availableSubjects[0].id]);
    }
    navigation.navigate('ModuleSelection');
  };

  const isHindi = profile.language === 'hi' || profile.language === 'bilingual';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.stepBadge}>STEP 5 OF 6</Text>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          {isHindi ? 'विषय चुनें (Choose Subjects)' : 'Choose Subjects'}
        </Text>
        <Text style={styles.subtitle}>
          Curriculum for Class {profile.classLevel} • {profile.board.toUpperCase()}
          {profile.state ? ` (${profile.state.toUpperCase()})` : ''}
          {profile.stream ? ` • ${profile.stream.toUpperCase()}` : ''}
        </Text>
      </View>

      {availableSubjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>
            {isHindi ? 'ऑफ़लाइन सामग्री उपलब्ध नहीं है' : 'Curriculum Not Ingested Yet'}
          </Text>
          <Text style={styles.emptyDesc}>
            {isHindi
              ? `इस बोर्ड/कक्षा के लिए डेटाबेस में अभी कोई ऑफ़लाइन मॉड्यूल लोड नहीं है। वर्तमान में CBSE Class 10 (गणित और विज्ञान) पूरी तरह से उपलब्ध है।`
              : `No offline curriculum packages are currently loaded in the database for ${profile.board.toUpperCase()} Class ${profile.classLevel}. Currently verified and loaded: CBSE Class 10 Mathematics & Science.`}
          </Text>
          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => {
              useProfileStore.getState().setBoard('cbse');
              useProfileStore.getState().setClassLevel(10);
              useProfileStore.getState().setState(null);
              useProfileStore.getState().setStream(null);
            }}
          >
            <Text style={styles.switchBtnText}>
              {isHindi ? '⚡ CBSE कक्षा 10 चुनें (सत्यापित)' : '⚡ Switch to CBSE Class 10 (Verified)'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardsContainer}>
          {availableSubjects.map((s) => {
            const isSelected = profile.selectedSubjects.includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleToggle(s.id)}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`${s.name}, ${s.description}`}
              >
                <Text style={styles.subjectIcon}>{s.icon}</Text>

                <View style={styles.textCol}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.subjectName, isSelected && styles.subjectNameSelected]}>
                      {s.name}
                    </Text>
                    <View style={styles.chapterBadge}>
                      <Text style={styles.chapterBadgeText}>{s.chapterCount} Chapters</Text>
                    </View>
                  </View>
                  <Text style={styles.subjectDesc}>{s.description}</Text>
                  <Text style={styles.sizeText}>📦 Approx. {s.totalSizeMB} MB offline</Text>
                </View>

                <View style={[styles.checkBox, isSelected && styles.checkBoxSelected]}>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {availableSubjects.length > 0 && (
        <PrimaryButton
          title={`Continue with ${profile.selectedSubjects.length} Subject${profile.selectedSubjects.length === 1 ? '' : 's'}`}
          onPress={handleContinue}
          style={styles.continueBtn}
        />
      )}
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  stepBadge: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
  },
  selectAllText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '700',
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
    padding: spacing.md,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.base,
    borderWidth: 2,
    borderColor: palette.gray200,
    minHeight: spacing.minTouchTarget + 30,
  },
  cardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  subjectIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  subjectName: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: palette.gray900,
  },
  subjectNameSelected: {
    color: palette.primary,
  },
  chapterBadge: {
    backgroundColor: palette.gray100,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  chapterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.gray600,
  },
  subjectDesc: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
  },
  sizeText: {
    ...typography.caption,
    color: palette.gray400,
    marginTop: 4,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: palette.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  checkBoxSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primary,
  },
  checkMark: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '900',
  },
  emptyContainer: {
    backgroundColor: palette.white,
    padding: spacing.xl,
    borderRadius: spacing.radiusBase,
    alignItems: 'center',
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.h2,
    color: palette.gray800,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptyDesc: {
    ...typography.body,
    color: palette.gray500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.base,
  },
  switchBtn: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusBase,
  },
  switchBtnText: {
    color: palette.white,
    fontWeight: '700',
    fontSize: 14,
  },
  continueBtn: {
    marginTop: spacing.base,
  },
});
