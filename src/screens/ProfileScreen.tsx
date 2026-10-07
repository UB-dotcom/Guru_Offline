import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
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
          Class {profile.classNumber} • {profile.language === 'en' ? 'English' : 'Hindi'}
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {user?.isGuest ? 'Guest Mode' : 'Offline Verified'}
            </Text>
          </View>
        </View>
      </View>

      {/* Curriculum Details Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Curriculum Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Education Stage</Text>
          <Text style={styles.infoVal}>
            {profile.educationLevel === 'secondary'
              ? 'Secondary (9th - 10th)'
              : profile.educationLevel === 'primary'
              ? 'Primary (1st - 5th)'
              : profile.educationLevel === 'middle'
              ? 'Middle (6th - 8th)'
              : 'Senior Secondary'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Selected Class</Text>
          <Text style={styles.infoVal}>Class {profile.classNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Primary Medium</Text>
          <Text style={styles.infoVal}>
            {profile.language === 'en' ? 'English (EN)' : 'Hindi (हिंदी)'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Active Module</Text>
          <Text style={styles.infoVal}>NCERT Class 10 Syllabus</Text>
        </View>
      </View>

      {/* On-Device Diagnostics Summary */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Device Footprint & Storage</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>On-Device AI Engine</Text>
          <Text style={[styles.infoVal, { color: palette.secondary }]}>
            SmolLM INT4 (Active)
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Total Guru Footprint</Text>
          <Text style={styles.infoVal}>318 MB</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Offline Capability</Text>
          <Text style={[styles.infoVal, { color: palette.primary }]}>
            100% Functional
          </Text>
        </View>
      </View>

      {/* Quick Navigation Menu */}
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EducationLevel')}
        >
          <Text style={styles.menuItemText}>📚 Change Education Level & Class</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('LanguageSelection')}
        >
          <Text style={styles.menuItemText}>🌐 Change Medium of Learning</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

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
          <Text style={styles.menuItemText}>🤖 On-Device AI Engine Info</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuItemText}>⚙️ App Settings & Diagnostics</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Action */}
      <SecondaryButton
        title="Switch Profile / Sign Out"
        onPress={handleLogout}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.gray50,
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusLg,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: palette.primaryLight,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  studentName: {
    ...typography.h2,
    color: palette.gray900,
    marginBottom: 2,
  },
  classBadge: {
    ...typography.bodySecondary,
    color: palette.gray600,
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: palette.secondarySurface,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: spacing.radiusPill,
    borderWidth: 1,
    borderColor: palette.secondaryLight,
  },
  statusBadgeText: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.secondaryDark,
  },
  sectionCard: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  sectionHeader: {
    ...typography.h4,
    color: palette.gray900,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  infoKey: {
    ...typography.bodySecondary,
    color: palette.gray600,
  },
  infoVal: {
    ...typography.body,
    fontWeight: '700',
    color: palette.gray900,
  },
  menuCard: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    minHeight: 52,
  },
  menuItemText: {
    ...typography.body,
    fontWeight: '600',
    color: palette.gray800,
  },
  chevron: {
    fontSize: 20,
    color: palette.gray400,
    fontWeight: '700',
  },
  menuDivider: {
    height: 1,
    backgroundColor: palette.gray100,
  },
  logoutBtn: {
    marginTop: spacing.xs,
  },
});
