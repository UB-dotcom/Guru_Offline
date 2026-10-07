import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Chapter } from '../types/module';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ChapterItemProps {
  chapter: Chapter;
  onPress: (chapter: Chapter) => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({ chapter, onPress }) => {
  const getStatusSymbol = () => {
    switch (chapter.status) {
      case 'completed':
        return { symbol: '✓', color: palette.secondary, bg: palette.secondarySurface };
      case 'current':
        return { symbol: '◉', color: palette.primary, bg: palette.primarySurface };
      default:
        return { symbol: '○', color: palette.gray400, bg: palette.gray100 };
    }
  };

  const status = getStatusSymbol();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        chapter.status === 'current' && styles.currentContainer,
      ]}
      onPress={() => onPress(chapter)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Chapter ${chapter.chapterNumber}: ${chapter.title}, status: ${chapter.status}`}
    >
      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
        <Text style={[styles.statusSymbol, { color: status.color }]}>
          {status.symbol}
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.chapterNumber}>Chapter {chapter.chapterNumber}</Text>
        <Text style={styles.title}>{chapter.title}</Text>
        <Text style={styles.summary} numberOfLines={1}>
          {chapter.summary}
        </Text>
      </View>

      <Text style={styles.arrow}>➔</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    backgroundColor: palette.white,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.gray200,
    minHeight: spacing.minTouchTarget,
  },
  currentContainer: {
    borderColor: palette.primary,
    backgroundColor: '#FAF5FF', // Subtle active tint
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statusSymbol: {
    fontSize: 16,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  chapterNumber: {
    ...typography.caption,
    color: palette.gray500,
  },
  title: {
    ...typography.h4,
    color: palette.gray900,
    fontSize: 15,
  },
  summary: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
  },
  arrow: {
    fontSize: 14,
    color: palette.gray400,
    marginLeft: spacing.sm,
  },
});
