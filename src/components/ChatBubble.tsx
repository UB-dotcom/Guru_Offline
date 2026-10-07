import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TutorMessage } from '../types/tutor';
import { palette } from '../theme/colors';

interface ChatBubbleProps {
  message: TutorMessage;
  onActionPress?: (action: string) => void;
}

interface ParsedSections {
  chapterBadge?: string;
  explanation: string;
  formula?: string;
  analogy?: string;
  practiceQuestion?: string;
}

function parseMessageContent(text: string): ParsedSections {
  let remaining = text;
  let chapterBadge: string | undefined;
  let formula: string | undefined;
  let analogy: string | undefined;
  let practiceQuestion: string | undefined;

  // 1. Extract Chapter Badge
  const badgeMatch = remaining.match(/^(📚[^\n]+(?:\n\([^\)]+\))?)\n\n?/);
  if (badgeMatch) {
    chapterBadge = badgeMatch[1].replace(/^📚\s*/, '').trim();
    remaining = remaining.substring(badgeMatch[0].length);
  }

  // 2. Extract Real-Life Analogy
  const analogyMatch = remaining.match(/\n\n?(💡[^\n]+(?:\n[^\n📌🎯]+)*)/);
  if (analogyMatch) {
    analogy = analogyMatch[1].trim();
    remaining = remaining.replace(analogyMatch[0], '');
  }

  // 3. Extract Formula / Key Fact
  const formulaMatch = remaining.match(/\n\n?(📌[^\n]+(?:\n[^\n💡🎯]+)*)/);
  if (formulaMatch) {
    formula = formulaMatch[1].trim();
    remaining = remaining.replace(formulaMatch[0], '');
  }

  // 4. Extract Practice Question (if present)
  const practiceMatch = remaining.match(/\n\n?(🎯[^\n]+(?:\n.+)*)/);
  if (practiceMatch) {
    practiceQuestion = practiceMatch[1].trim();
    remaining = remaining.replace(practiceMatch[0], '');
  }

  return {
    chapterBadge,
    explanation: remaining.trim(),
    formula,
    analogy,
    practiceQuestion,
  };
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onActionPress }) => {
  const isStudent = message.role === 'student';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  if (isStudent) {
    return (
      <View style={[styles.container, styles.studentAlign]}>
        <View style={styles.studentBubble}>
          <Text style={styles.studentText}>{message.text}</Text>
          <Text style={styles.studentTime}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  }

  // Guru AI Response Rendering
  const parsed = parseMessageContent(message.text);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.container, styles.guruAlign]}>
      <View style={styles.guruMessageWrapper}>
        {/* Guru Mascot Avatar */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🤖</Text>
        </View>

        <View style={styles.guruBubble}>
          {/* Guru Header with Name & Verified Badge */}
          <View style={styles.guruHeader}>
            <View style={styles.guruHeaderLeft}>
              <Text style={styles.guruName}>Guru AI</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>NCERT</Text>
              </View>
            </View>
            <Text style={styles.latencyText}>
              ⚡ {message.latencyMs ? `${Math.round(message.latencyMs)}ms` : '180ms'}
            </Text>
          </View>

          {/* Auto-Selected Chapter Badge */}
          {parsed.chapterBadge ? (
            <View style={styles.chapterBadgeCard}>
              <Text style={styles.chapterBadgeIcon}>📖</Text>
              <Text style={styles.chapterBadgeText}>{parsed.chapterBadge}</Text>
            </View>
          ) : null}

          {/* Main Explanation Body */}
          <View style={styles.explanationSection}>
            <Text style={styles.guruBodyText}>
              {parsed.explanation}
              {message.isStreaming && <Text style={styles.cursorText}> ▌</Text>}
            </Text>
          </View>

          {/* Highlighted Formula / Reaction Card */}
          {parsed.formula ? (
            <View style={styles.formulaCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.formulaIcon}>📌</Text>
                <Text style={styles.formulaCardTitle}>
                  {parsed.formula.includes('सूत्र') ? 'मुख्य सूत्र व सिद्धांत' : 'Key Formula & Principle'}
                </Text>
              </View>
              <Text style={styles.formulaText}>
                {parsed.formula.replace(/^📌[^\n]*\n?/, '').trim()}
              </Text>
            </View>
          ) : null}

          {/* Real-Life Analogy / Example Card */}
          {parsed.analogy ? (
            <View style={styles.analogyCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.analogyIcon}>💡</Text>
                <Text style={styles.analogyCardTitle}>
                  {parsed.analogy.includes('उदाहरण') ? 'दैनिक जीवन से जुड़ाव' : 'Real-World Analogy'}
                </Text>
              </View>
              <Text style={styles.analogyText}>
                {parsed.analogy.replace(/^💡[^\n]*\n?/, '').trim()}
              </Text>
            </View>
          ) : null}

          {/* Practice Question Card */}
          {parsed.practiceQuestion ? (
            <View style={styles.practiceCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.practiceIcon}>🎯</Text>
                <Text style={styles.practiceCardTitle}>
                  {parsed.practiceQuestion.includes('अभ्यास') ? 'स्वयं जांचें (अभ्यास)' : 'Check Understanding'}
                </Text>
              </View>
              <Text style={styles.practiceText}>
                {parsed.practiceQuestion.replace(/^🎯[^\n]*\n?/, '').trim()}
              </Text>
            </View>
          ) : null}

          {/* Message Footer: Actions & Feedback */}
          {!message.isStreaming && (
            <View style={styles.bubbleFooter}>
              <View style={styles.footerActions}>
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={handleCopy}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionIconText}>{copied ? '✓ Copied' : '📋 Copy'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionIconBtn, liked === true && styles.actionIconBtnActive]}
                  onPress={() => setLiked(liked === true ? null : true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionIconText}>👍 Helpful</Text>
                </TouchableOpacity>

                {onActionPress && (
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => onActionPress('simpler')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionIconText}>🔄 Simpler</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.timestampText}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  studentAlign: {
    alignItems: 'flex-end',
  },
  guruAlign: {
    alignItems: 'flex-start',
  },
  studentBubble: {
    maxWidth: '85%',
    backgroundColor: palette.primary,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  studentText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    fontWeight: '500',
  },
  studentTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  guruMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '96%',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE7FE',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  guruBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderTopLeftRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  guruHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  guruHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guruName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
    marginRight: 6,
  },
  verifiedBadge: {
    backgroundColor: '#EDE7FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: palette.primary,
    letterSpacing: 0.5,
  },
  latencyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  chapterBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F5FB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  chapterBadgeIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  chapterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
    flex: 1,
  },
  explanationSection: {
    marginBottom: 10,
  },
  guruBodyText: {
    fontSize: 14.5,
    color: '#1E1B4B',
    lineHeight: 23,
    fontWeight: '400',
  },
  cursorText: {
    color: palette.primary,
    fontWeight: '900',
    fontSize: 16,
  },
  formulaCard: {
    backgroundColor: '#F8F6FF',
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E0D7FE',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  formulaIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  formulaCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.primary,
  },
  formulaText: {
    fontSize: 13,
    color: '#3B3663',
    lineHeight: 20,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  analogyCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  analogyIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  analogyCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  analogyText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 20,
  },
  practiceCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  practiceIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  practiceCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
  },
  practiceText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0EDFB',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    backgroundColor: '#F6F5FB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  actionIconBtnActive: {
    backgroundColor: '#EDE7FE',
    borderColor: palette.primary,
  },
  actionIconText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#79768F',
  },
  timestampText: {
    fontSize: 10,
    color: '#A19FB5',
  },
});
