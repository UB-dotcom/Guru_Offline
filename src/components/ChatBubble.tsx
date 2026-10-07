import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TutorMessage } from '../types/tutor';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ChatBubbleProps {
  message: TutorMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isStudent = message.role === 'student';

  return (
    <View
      style={[
        styles.container,
        isStudent ? styles.studentAlign : styles.guruAlign,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isStudent ? styles.studentBubble : styles.guruBubble,
        ]}
      >
        {!isStudent && (
          <View style={styles.guruHeader}>
            <Text style={styles.guruName}>Guru (On-Device AI)</Text>
            {message.isOffline && (
              <View style={styles.offlineChip}>
                <Text style={styles.offlineChipText}>📵 Offline</Text>
              </View>
            )}
          </View>
        )}

        <Text
          style={[
            styles.messageText,
            isStudent ? styles.studentText : styles.guruText,
          ]}
        >
          {message.text}
        </Text>

        {!isStudent && message.latencyMs !== undefined && (
          <View style={styles.telemetryRow}>
            <Text style={styles.telemetryText}>
              ⚡ {message.latencyMs}ms • RAM: {message.ramUsageMB} MB • Zero Cloud
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    width: '100%',
  },
  studentAlign: {
    alignItems: 'flex-end',
  },
  guruAlign: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '86%',
    padding: spacing.md,
    borderRadius: spacing.radiusBase,
  },
  studentBubble: {
    backgroundColor: palette.primary,
    borderBottomRightRadius: spacing.radiusSm,
  },
  guruBubble: {
    backgroundColor: palette.white,
    borderBottomLeftRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  guruHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  guruName: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.primary,
  },
  offlineChip: {
    backgroundColor: palette.secondarySurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offlineChipText: {
    ...typography.caption,
    fontSize: 9,
    color: palette.secondary,
    fontWeight: '700',
  },
  messageText: {
    ...typography.body,
    lineHeight: 21,
  },
  studentText: {
    color: palette.white,
  },
  guruText: {
    color: palette.gray900,
  },
  telemetryRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: palette.gray100,
  },
  telemetryText: {
    ...typography.caption,
    fontSize: 10,
    color: palette.gray400,
  },
});
