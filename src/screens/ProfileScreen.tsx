import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import { OfflineBanner } from '../components/OfflineBanner';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { profile } = useProfileStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Switch Profile / Logout',
      'Are you sure you want to log out? Your downloaded offline modules will remain saved on this phone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ]
    );
  };

  const getLanguageLabel = () => {
    if (profile.language === 'hi') return 'हिंदी (Hindi)';
    if (profile.language === 'bilingual') return 'Hinglish / Bilingual';
    return 'English';
  };

  const getBoardLabel = () => {
    if (profile.board === 'cbse') return 'CBSE (NCERT)';
    if (profile.board === 'icse') return 'ICSE / CISCE';
    return `State Board${profile.state ? ` (${profile.state.toUpperCase()})` : ''}`;
  };

  const formattedSubjects =
    profile.selectedSubjects && profile.selectedSubjects.length > 0
      ? profile.selectedSubjects
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' '))
          .join(', ')
      : 'Mathematics, Science';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <OfflineBanner text="Active Offline Profile" />

      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>👨‍🎓</Text>
        </View>

        <Text style={styles.studentName}>{profile.name}</Text>
        <Text style={styles.classBadge}>
          Class {profile.classLevel} • {getBoardLabel()} • {getLanguageLabel()}
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {user?.isGuest ? 'Guest Mode' : '✓ Offline Verified'}
            </Text>
          </View>
        </View>
      </View>

      {/* MY LEARNING PROFILE CARD (Requirement 20) */}
      <View style={styles.learningProfileCard}>
        <View style={styles.learningProfileHeader}>
          <Text style={styles.learningProfileTitle}>🎓 My Learning Profile</Text>
          <View style={styles.verifiedChip}>
            <Text style={styles.verifiedChipText}>Syllabus Locked</Text>
          </View>
        </View>

        <View style={styles.profileFieldRow}>
          <Text style={styles.fieldLabel}>Language:</Text>
          <Text style={styles.fieldValue}>{getLanguageLabel()}</Text>
        </View>

        <View style={styles.profileFieldRow}>
          <Text style={styles.fieldLabel}>Board:</Text>
          <Text style={styles.fieldValue}>{getBoardLabel()}</Text>
        </View>

        {profile.state && (
          <View style={styles.profileFieldRow}>
            <Text style={styles.fieldLabel}>State:</Text>
            <Text style={styles.fieldValue}>{profile.state.toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.profileFieldRow}>
          <Text style={styles.fieldLabel}>Class:</Text>
          <Text style={styles.fieldValue}>Class {profile.classLevel}</Text>
        </View>

        {profile.stream && (
          <View style={styles.profileFieldRow}>
            <Text style={styles.fieldLabel}>Stream:</Text>
            <Text style={styles.fieldValue}>{profile.stream.toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.profileFieldRow}>
          <Text style={styles.fieldLabel}>Subjects:</Text>
          <Text style={styles.fieldValue}>{formattedSubjects}</Text>
        </View>

        {/* 4 Interactive Buttons to Update Profile */}
        <View style={styles.profileActionsGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('LanguageSelection')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnIcon}>🌐</Text>
            <Text style={styles.actionBtnText}>Change Language</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('BoardSelection')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnIcon}>🏛️</Text>
            <Text style={styles.actionBtnText}>Change Board</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('ClassSelection')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnIcon}>🎒</Text>
            <Text style={styles.actionBtnText}>Change Class</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('SubjectSelection')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnIcon}>📚</Text>
            <Text style={styles.actionBtnText}>Manage Subjects</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* On-Device Diagnostics Summary */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>On-Device AI Engine</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Local SLM</Text>
          <Text style={[styles.infoVal, { color: palette.secondary }]}>
            SmolLM-135M INT4 (On-Device)
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Retrieval Engine</Text>
          <Text style={styles.infoVal}>Local BM25 + SQLite FTS5</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Offline Status</Text>
          <Text style={[styles.infoVal, { color: palette.primary }]}>
            Zero-Cloud Local Functioning
          </Text>
        </View>
      </View>

      {/* Quick Navigation Menu */}
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Storage')}
        >
          <Text style={styles.menuItemText}>💾 Manage Storage & Modules</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('AIInfo')}
        >
          <Text style={styles.menuItemText}>🤖 On-Device AI Benchmarks</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Switch Profile / Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    backgroundColor: palette.gray50,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  studentName: {
    ...typography.h2,
    color: palette.gray900,
  },
  classBadge: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
    textAlign: 'center',
  },
  badgeRow: {
    marginTop: spacing.sm,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.radiusSm,
  },
  statusBadgeText: {
    ...typography.caption,
    color: '#166534',
    fontWeight: '700',
  },
  learningProfileCard: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: palette.primary,
  },
  learningProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray200,
  },
  learningProfileTitle: {
    ...typography.h3,
    color: palette.gray900,
  },
  verifiedChip: {
    backgroundColor: palette.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: palette.primary,
  },
  profileFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  fieldLabel: {
    ...typography.body,
    fontWeight: '600',
    color: palette.gray600,
    width: 90,
  },
  fieldValue: {
    ...typography.body,
    fontWeight: '700',
    color: palette.gray900,
    flex: 1,
    textAlign: 'right',
  },
  profileActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  actionBtn: {
    width: '48%',
    backgroundColor: palette.gray50,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: palette.gray300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  actionBtnIcon: {
    fontSize: 14,
  },
  actionBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.gray800,
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  sectionHeader: {
    ...typography.h3,
    color: palette.gray900,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoKey: {
    ...typography.bodySmall,
    color: palette.gray600,
  },
  infoVal: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: palette.gray900,
  },
  menuCard: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
  },
  menuItemText: {
    ...typography.body,
    fontWeight: '600',
    color: palette.gray800,
  },
  chevron: {
    fontSize: 18,
    color: palette.gray400,
  },
  menuDivider: {
    height: 1,
    backgroundColor: palette.gray200,
  },
  logoutBtn: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.danger,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  logoutBtnText: {
    color: palette.danger,
    fontWeight: '700',
    fontSize: 14,
  },
});
