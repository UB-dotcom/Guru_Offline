import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { storageService } from '../services/storageService';
import { useModuleStore } from '../store/moduleStore';
import { StorageUsage } from '../types/progress';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { OfflineBanner } from '../components/OfflineBanner';
import { LoadingState } from '../components/LoadingState';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface StorageScreenProps {
  navigation: any;
}

export const StorageScreen: React.FC<StorageScreenProps> = ({ navigation }) => {
  const { modules, deleteModule } = useModuleStore();
  const [storage, setStorage] = useState<StorageUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStorage = async () => {
    setIsLoading(true);
    const data = await storageService.getStorageUsage();
    setStorage(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStorage();
  }, [modules]);

  const handleDeleteModule = (moduleId: string, moduleName: string, sizeMB: number) => {
    Alert.alert(
      `Delete ${moduleName}?`,
      `This will free up ${sizeMB} MB of storage. You can re-download it anytime when internet is available.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteModule(moduleId);
            await loadStorage();
          },
        },
      ]
    );
  };

  if (isLoading || !storage) {
    return <LoadingState message="Calculating on-device storage usage..." />;
  }

  const appPct = (storage.appSizeMB / storage.totalUsedMB) * 100;
  const aiPct = (storage.aiModelSizeMB / storage.totalUsedMB) * 100;
  const modPct = (storage.modulesSizeMB / storage.totalUsedMB) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <OfflineBanner text="Local Storage Management" />

      {/* Main Storage Gauge Card */}
      <View style={styles.gaugeCard}>
        <View style={styles.gaugeHeader}>
          <Text style={styles.gaugeTitle}>Guru App Footprint</Text>
          <Text style={styles.totalUsedText}>{storage.totalUsedMB} MB</Text>
        </View>

        {/* Stacked Storage Bar */}
        <View style={styles.barContainer}>
          <View style={[styles.barSegment, { width: `${appPct}%`, backgroundColor: palette.primary }]} />
          <View style={[styles.barSegment, { width: `${aiPct}%`, backgroundColor: palette.secondary }]} />
          <View style={[styles.barSegment, { width: `${modPct}%`, backgroundColor: palette.warning }]} />
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: palette.primary }]} />
            <Text style={styles.legendLabel}>App: {storage.appSizeMB}MB</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: palette.secondary }]} />
            <Text style={styles.legendLabel}>AI: {storage.aiModelSizeMB}MB</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: palette.warning }]} />
            <Text style={styles.legendLabel}>Curriculum: {storage.modulesSizeMB}MB</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.freeSpaceRow}>
          <Text style={styles.freeSpaceLabel}>Device Free Storage:</Text>
          <Text style={styles.freeSpaceValue}>
            {(storage.freeSpaceMB / 1024).toFixed(1)} GB Available
          </Text>
        </View>
      </View>

      {/* Itemized List */}
      <View style={styles.listSection}>
        <Text style={styles.listSectionTitle}>Stored Items Breakdown</Text>

        {storage.breakdown.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {item.canDelete ? 'Removable Offline Module' : 'Essential System Component'}
              </Text>
            </View>

            <View style={styles.itemActionArea}>
              <Text style={styles.itemSize}>{item.sizeMB} MB</Text>
              {item.canDelete && item.moduleId ? (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteModule(item.moduleId!, item.name, item.sizeMB)}
                >
                  <Text style={styles.deleteBtnText}>Remove</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.protectedBadge}>
                  <Text style={styles.protectedText}>Protected</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Storage Optimization Notice */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Storage Tip for Budget Phones</Text>
        <Text style={styles.tipBody}>
          Guru Offline modules are compressed under 60 MB each. You can remove finished terms or chapters anytime to keep your device running fast.
        </Text>
      </View>

      <PrimaryButton
        title="Download More Modules 📥"
        onPress={() => navigation.navigate('ModuleSelection')}
        style={styles.addModulesBtn}
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
  gaugeCard: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginVertical: spacing.md,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gaugeTitle: {
    ...typography.h4,
    color: palette.gray900,
  },
  totalUsedText: {
    ...typography.h3,
    color: palette.primary,
    fontWeight: '800',
  },
  barContainer: {
    height: 14,
    borderRadius: 7,
    backgroundColor: palette.gray200,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  barSegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...typography.caption,
    fontSize: 11,
    color: palette.gray600,
  },
  divider: {
    height: 1,
    backgroundColor: palette.gray200,
    marginVertical: spacing.md,
  },
  freeSpaceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freeSpaceLabel: {
    ...typography.bodySecondary,
    color: palette.gray600,
  },
  freeSpaceValue: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.secondaryDark,
  },
  listSection: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginBottom: spacing.md,
  },
  listSectionTitle: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  itemDetails: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  itemName: {
    ...typography.body,
    fontWeight: '700',
    color: palette.gray900,
  },
  itemMeta: {
    ...typography.caption,
    color: palette.gray500,
    marginTop: 2,
  },
  itemActionArea: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemSize: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.gray800,
  },
  deleteBtn: {
    backgroundColor: palette.dangerSurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: palette.dangerLight,
  },
  deleteBtnText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '800',
    color: palette.danger,
  },
  protectedBadge: {
    backgroundColor: palette.gray100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  protectedText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: palette.gray500,
  },
  tipCard: {
    backgroundColor: palette.primarySurface,
    padding: spacing.md,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.primaryLight,
    marginBottom: spacing.md,
  },
  tipTitle: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.primaryDark,
    marginBottom: 2,
  },
  tipBody: {
    ...typography.caption,
    color: palette.gray700,
    lineHeight: 18,
  },
  addModulesBtn: {
    marginTop: spacing.xs,
  },
});
