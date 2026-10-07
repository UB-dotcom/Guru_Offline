import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChatBubble } from '../components/ChatBubble';
import { TutorActionButton } from '../components/TutorActionButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useTutorStore } from '../store/tutorStore';
import { useModuleStore } from '../store/moduleStore';
import { useProfileStore } from '../store/profileStore';
import { TutorActionType } from '../types/tutor';

interface TutorScreenProps {
  navigation: any;
}

export const TutorScreen: React.FC<TutorScreenProps> = ({ navigation }) => {
  const { messages, isThinking, currentContext, askGuru, clearChat } = useTutorStore();
  const { activeModuleId, modules } = useModuleStore();
  const { profile } = useProfileStore();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const activeModule = modules.find((m) => m.id === activeModuleId) || modules[0];

  const handleSend = async (textToSend?: string, actionType?: TutorActionType) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    setInputText('');
    await askGuru(query, actionType);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleAction = (actionType: TutorActionType) => {
    switch (actionType) {
      case 'explain_simpler':
        handleSend('Can you explain that more simply with an analogy?', 'explain_simpler');
        break;
      case 'give_example':
        handleSend('Can you give a worked numerical example?', 'give_example');
        break;
      case 'practice':
        navigation.navigate('Practice', { topic: 'Quadratic Equations' });
        break;
      case 'quiz':
        navigation.navigate('Quiz', { moduleId: activeModule.id });
        break;
      default:
        break;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >

      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.moduleName}>{activeModule.title}</Text>
          <View style={styles.offlineBadgeRow}>
            <Text style={styles.offlineDot}>●</Text>
            <Text style={styles.offlineStatus}>
              Class {profile.classLevel} • {profile.board.toUpperCase()}{profile.state ? ` (${profile.state.toUpperCase()})` : ''} • {profile.language === 'hi' ? 'Hindi' : profile.language === 'bilingual' ? 'Bilingual' : 'English'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={clearChat}
          accessibilityRole="button"
          accessibilityLabel="Clear chat"
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Context Pill */}
      {currentContext ? (
        <View style={styles.contextBar}>
          <Text style={styles.contextIcon}>📖</Text>
          <Text style={styles.contextText} numberOfLines={1}>
            Grounding Context: {currentContext}
          </Text>
        </View>
      ) : null}

      {/* Chat Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isThinking && (
          <View style={styles.thinkingContainer}>
            <ActivityIndicator size="small" color={palette.primary} />
            <Text style={styles.thinkingText}>Guru is inferring step-by-step...</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Suggestions Chips */}
      <View style={styles.suggestionsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsContent}>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => handleSend('Quadratic equation ko simple language mein samjhao.')}
          >
            <Text style={styles.suggestionChipText}>✨ Quadratic equation samjhao (सरल भाषा)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => handleSend('द्विघाती सूत्र x = (-b ± √D) / 2a और विविक्तकर क्या है?')}
          >
            <Text style={styles.suggestionChipText}>📐 D = b² - 4ac सूत्र</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => handleSend('Give me an easy practice question from Class 10 Math')}
          >
            <Text style={styles.suggestionChipText}>✏️ Easy question</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsContent}>
          <TutorActionButton
            label="Explain Simpler"
            actionType="explain_simpler"
            icon="💡"
            onPress={handleAction}
          />
          <TutorActionButton
            label="Give Example"
            actionType="give_example"
            icon="🔢"
            onPress={handleAction}
          />
          <TutorActionButton
            label="Practice"
            actionType="practice"
            icon="✏️"
            onPress={handleAction}
          />
          <TutorActionButton
            label="Quiz"
            actionType="quiz"
            icon="🎯"
            onPress={handleAction}
          />
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask Guru a question..."
          placeholderTextColor={palette.gray400}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={styles.micBtn}
          onPress={() => handleSend('Solve 2x + 6 = 14 step by step')}
          accessibilityRole="button"
          accessibilityLabel="Sample Voice Query"
        >
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
          accessibilityRole="button"
          accessibilityLabel="Send question"
        >
          <Text style={styles.sendIcon}>➔</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.gray50,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    backgroundColor: palette.white,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray200,
  },
  headerInfo: {
    flex: 1,
  },
  moduleName: {
    ...typography.h4,
    color: palette.gray900,
  },
  offlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  offlineDot: {
    fontSize: 8,
    color: palette.secondary,
    marginRight: 4,
  },
  offlineStatus: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800',
    color: palette.secondary,
    letterSpacing: 0.5,
  },
  clearBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  clearText: {
    ...typography.caption,
    color: palette.gray500,
    fontWeight: '600',
  },
  contextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: '#E9D5FF',
  },
  contextIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  contextText: {
    ...typography.caption,
    fontSize: 11,
    color: '#6B21A8',
    flex: 1,
    fontWeight: '600',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.base,
    paddingBottom: spacing.md,
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    padding: spacing.md,
    borderRadius: spacing.radiusBase,
    alignSelf: 'flex-start',
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  thinkingText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  actionsBar: {
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.gray200,
    paddingVertical: spacing.sm,
  },
  actionsContent: {
    paddingHorizontal: spacing.base,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderTopWidth: 1,
    borderTopColor: palette.gray200,
  },
  textInput: {
    flex: 1,
    backgroundColor: palette.gray50,
    borderWidth: 1,
    borderColor: palette.gray300,
    borderRadius: spacing.radiusFull,
    paddingHorizontal: spacing.base,
    minHeight: spacing.minTouchTarget,
    fontSize: 14,
    color: palette.gray900,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
  },
  micIcon: {
    fontSize: 20,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: palette.gray300,
  },
  sendIcon: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '900',
  },
  persistentOfflineBanner: {
    backgroundColor: '#0F172A',
    paddingVertical: 5,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  persistentOfflineText: {
    ...typography.caption,
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  suggestionsBar: {
    backgroundColor: palette.gray50,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: palette.gray200,
  },
  suggestionsContent: {
    paddingHorizontal: spacing.base,
    gap: spacing.xs,
  },
  suggestionChip: {
    backgroundColor: palette.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: spacing.radiusFull,
    borderWidth: 1,
    borderColor: palette.primary,
    marginRight: spacing.xs,
  },
  suggestionChipText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '700',
    fontSize: 11,
  },
});
