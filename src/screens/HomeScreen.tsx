import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { OfflineBanner } from '../components/OfflineBanner';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useProfileStore } from '../store/profileStore';
import { useModuleStore } from '../store/moduleStore';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { profile, setActiveSubject } = useProfileStore();
  const { modules, setActiveModule } = useModuleStore();

  const isHindi = profile.language === 'hi';
  const selectedSubjects = profile.selectedSubjects && profile.selectedSubjects.length > 0
    ? profile.selectedSubjects
    : ['mathematics', 'science'];

  // Current active subject (defaults to activeSubjectId or first selected subject)
  const currentActiveSub = profile.activeSubjectId && selectedSubjects.includes(profile.activeSubjectId)
    ? profile.activeSubjectId
    : selectedSubjects[0];

  const handleContinueLearning = (moduleId: string, chapterId: string = 'ch04') => {
    setActiveModule(moduleId);
    navigation.navigate('Reader', {
      moduleId,
      chapterId,
    });
  };

  const handleOpenModule = (moduleId: string) => {
    setActiveModule(moduleId);
    navigation.navigate('ModulesTab', {
      screen: 'ModuleDetails',
      params: { moduleId },
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (isHindi) {
      if (hour < 12) return 'शुभ प्रभात 👋';
      if (hour < 17) return 'शुभ दोपहर 👋';
      return 'शुभ संध्या 👋';
    }
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  const langLabel =
    profile.language === 'hi'
      ? 'Hindi'
      : profile.language === 'bilingual'
      ? 'Bilingual / Hinglish'
      : 'English';

  const boardLabel = profile.board.toUpperCase();
  const stateLabel = profile.state ? ` (${profile.state.toUpperCase()})` : '';

  // Subject metadata helper
  const getSubjectMeta = (code: string) => {
    switch (code.toLowerCase()) {
      case 'mathematics':
        return { emoji: '📐', name: isHindi ? 'गणित (Mathematics)' : 'Mathematics', desc: `Class ${profile.classLevel} NCERT` };
      case 'science':
        return { emoji: '🔬', name: isHindi ? 'विज्ञान (Science)' : 'Science', desc: '13 Chapters Ready' };
      case 'physics':
        return { emoji: '⚡', name: isHindi ? 'भौतिकी (Physics)' : 'Physics', desc: 'Mechanics & Electro' };
      case 'chemistry':
        return { emoji: '🧪', name: isHindi ? 'रसायन (Chemistry)' : 'Chemistry', desc: 'Organic & Inorganic' };
      case 'biology':
        return { emoji: '🧬', name: isHindi ? 'जीव विज्ञान (Biology)' : 'Biology', desc: 'Genetics & Physiology' };
      case 'computer_science':
        return { emoji: '💻', name: isHindi ? 'कंप्यूटर (CS)' : 'Computer Science', desc: 'Python & SQL' };
      case 'social_science':
        return { emoji: '🌍', name: isHindi ? 'सामाजिक विज्ञान' : 'Social Science', desc: 'History, Civics, Geo' };
      case 'english':
        return { emoji: '📖', name: isHindi ? 'अंग्रेज़ी (English)' : 'English', desc: 'Literature & Grammar' };
      case 'hindi':
        return { emoji: '🇮🇳', name: isHindi ? 'हिंदी (Hindi)' : 'Hindi', desc: 'साहित्य व व्याकरण' };
      case 'evs':
        return { emoji: '🌱', name: isHindi ? 'पर्यावरण (EVS)' : 'EVS', desc: 'Our Environment' };
      case 'accountancy':
        return { emoji: '📑', name: isHindi ? 'लेखाशास्त्र' : 'Accountancy', desc: 'Financial Accounts' };
      case 'business_studies':
        return { emoji: '🏢', name: isHindi ? 'व्यवसाय अध्ययन' : 'Business Studies', desc: 'Management & Finance' };
      case 'economics':
        return { emoji: '📈', name: isHindi ? 'अर्थशास्त्र' : 'Economics', desc: 'Micro & Macro Economics' };
      case 'history':
        return { emoji: '🏛️', name: isHindi ? 'इतिहास (History)' : 'History', desc: 'Themes in World History' };
      case 'political_science':
        return { emoji: '⚖️', name: isHindi ? 'राजनीति विज्ञान' : 'Political Science', desc: 'Constitution & Politics' };
      case 'geography':
        return { emoji: '🗺️', name: isHindi ? 'भूगोल (Geography)' : 'Geography', desc: 'Physical & Human Geo' };
      case 'sociology':
        return { emoji: '👥', name: isHindi ? 'समाजशास्त्र' : 'Sociology', desc: 'Indian Society' };
      default:
        return { emoji: '📚', name: code.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()), desc: 'Offline Ready' };
    }
  };

  // Dynamic active chapter data
  const getActiveChapterDetails = (subCode: string) => {
    switch (subCode.toLowerCase()) {
      case 'mathematics':
        return {
          badge: isHindi ? 'गणित • अध्याय 4' : 'MATHEMATICS • CHAPTER 4',
          badgeColor: '#EFF6FF',
          badgeTextColor: palette.primary,
          progress: '65%',
          percentNum: 65,
          title: isHindi ? 'द्विघात समीकरण (Quadratic Equations)' : 'Quadratic Equations',
          desc: isHindi ? 'मानक रूप, विविक्तकर D=b²-4ac व श्रीधराचार्य सूत्र' : 'Standard Form, Quadratic Formula & Discriminant Analysis',
          moduleId: 'class10_math',
          chapterId: 'ch04',
          askPrompt: isHindi ? 'द्विघात समीकरण को सरल भाषा में समझाएं।' : 'Explain quadratic equations step by step in simple terms.',
          cardBg: palette.white,
          borderColor: palette.gray200,
        };
      case 'science':
        return {
          badge: isHindi ? 'विज्ञान • अध्याय 1' : 'SCIENCE • CHAPTER 1',
          badgeColor: '#DCFCE7',
          badgeTextColor: '#166534',
          progress: '40%',
          percentNum: 40,
          title: isHindi ? 'रासायनिक अभिक्रियाएं एवं समीकरण' : 'Chemical Reactions & Equations',
          desc: isHindi ? 'संयोजन, वियोजन, विस्थापन व रेडॉक्स अभिक्रियाएं' : 'Types of reactions, balancing equations & redox',
          moduleId: 'class10_science',
          chapterId: 'ch01',
          askPrompt: isHindi ? 'रासायनिक अभिक्रिया और समीकरण संतुलन को समझाएं।' : 'Explain chemical reactions and balancing equations step by step.',
          cardBg: '#F0FDF4',
          borderColor: '#BBF7D0',
        };
      case 'physics':
        return {
          badge: isHindi ? 'भौतिकी • अध्याय 1' : 'PHYSICS • CHAPTER 1',
          badgeColor: '#FEF3C7',
          badgeTextColor: '#B45309',
          progress: '30%',
          percentNum: 30,
          title: isHindi ? 'वैद्युत आवेश तथा क्षेत्र (Electric Charges)' : 'Electric Charges and Fields',
          desc: isHindi ? 'कूलॉम का नियम, विद्युत क्षेत्र रेखाएं व गाउस का प्रमेय' : "Coulomb's Law, Electric Field Lines & Gauss's Theorem",
          moduleId: `class${profile.classLevel}_physics`,
          chapterId: 'ch01',
          askPrompt: isHindi ? 'कूलॉम का नियम और विद्युत क्षेत्र को समझाएं।' : "Explain Coulomb's Law and electric field step by step.",
          cardBg: '#FFFBEB',
          borderColor: '#FDE68A',
        };
      case 'chemistry':
        return {
          badge: isHindi ? 'रसायन • अध्याय 1' : 'CHEMISTRY • CHAPTER 1',
          badgeColor: '#EDE9FE',
          badgeTextColor: '#6D28D9',
          progress: '25%',
          percentNum: 25,
          title: isHindi ? 'विलयन एवं रासायनिक आबंधन (Solutions)' : 'Solutions and Chemical Bonding',
          desc: isHindi ? 'मोलरता, राउल्ट का नियम व सहसंयोजी आबंधन' : "Molarity, Raoult's Law & Covalent Bonding",
          moduleId: `class${profile.classLevel}_chemistry`,
          chapterId: 'ch01',
          askPrompt: isHindi ? 'विलयन और राउल्ट के नियम को समझाएं।' : "Explain solutions and Raoult's Law step by step.",
          cardBg: '#FAF5FF',
          borderColor: '#E9D5FF',
        };
      case 'biology':
        return {
          badge: isHindi ? 'जीव विज्ञान • अध्याय 1' : 'BIOLOGY • CHAPTER 1',
          badgeColor: '#ECFDF5',
          badgeTextColor: '#047857',
          progress: '35%',
          percentNum: 35,
          title: isHindi ? 'आनुवंशिकी एवं मेंडल के नियम' : 'Genetics and Heredity',
          desc: isHindi ? 'मेंडल के एकसंकर संकरण, F₂ अनुपात 3:1 व डीएनए' : "Mendel's Laws, Monohybrid Cross 3:1 Ratio & DNA",
          moduleId: `class${profile.classLevel}_biology`,
          chapterId: 'ch01',
          askPrompt: isHindi ? 'मेंडल के आनुवंशिकी नियमों को समझाएं।' : "Explain Mendel's laws of heredity step by step.",
          cardBg: '#F0FDF4',
          borderColor: '#BBF7D0',
        };
      case 'english':
        return {
          badge: isHindi ? 'अंग्रेज़ी • अध्याय 1' : 'ENGLISH • CHAPTER 1',
          badgeColor: '#EFF6FF',
          badgeTextColor: palette.primary,
          progress: '50%',
          percentNum: 50,
          title: 'A Letter to God & Grammar Mastery',
          desc: isHindi ? 'पठन बोध, व्याकरण, शब्दावली व उत्तर लेखन' : 'Reading comprehension, Active-Passive Voice & Vocabulary',
          moduleId: `class${profile.classLevel}_english`,
          chapterId: 'ch01',
          askPrompt: isHindi ? 'A Letter to God पाठ का सार और व्याकरण नियम समझाएं।' : 'Explain the theme of A Letter to God and key grammar rules.',
          cardBg: palette.white,
          borderColor: palette.gray200,
        };
      default:
        const meta = getSubjectMeta(subCode);
        return {
          badge: `${meta.name.toUpperCase()} • CHAPTER 1`,
          badgeColor: '#EFF6FF',
          badgeTextColor: palette.primary,
          progress: '20%',
          percentNum: 20,
          title: `${meta.name} — Core Concepts`,
          desc: isHindi ? 'कक्षा के महत्वपूर्ण सिद्धांत व अभ्यास' : 'Core curriculum principles and key exercises',
          moduleId: `class${profile.classLevel}_${subCode}`,
          chapterId: 'ch01',
          askPrompt: isHindi ? `${meta.name} के मुख्य सिद्धांतों को सरल हिंदी में समझाएं।` : `Explain the core concepts of ${meta.name} step by step.`,
          cardBg: palette.white,
          borderColor: palette.gray200,
        };
    }
  };

  const activeChapter = getActiveChapterDetails(currentActiveSub);
  const activeMeta = getSubjectMeta(currentActiveSub);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header: Avatar, Greeting, Notification Bell */}
        <View style={styles.topHeaderRow}>
          <View style={styles.userProfileCol}>
            <View style={styles.userAvatar}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.avatarLogoImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.userNameBlock}>
              <Text style={styles.greetingTitle}>
                {getGreeting()}, {profile.name || 'Student'} 👋
              </Text>
              <Text style={styles.greetingSub}>
                {isHindi ? 'अपनी पढ़ाई जारी रखने के लिए तैयार हैं?' : 'Ready to continue your learning journey?'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.75}
          >
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Board & Class Pill Badge */}
        <View style={styles.curriculumContextRow}>
          <TouchableOpacity
            style={styles.curriculumPill}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.8}
          >
            <Text style={styles.curriculumPillText}>
              Class {profile.classLevel} • {boardLabel}{stateLabel} • {langLabel}
              {profile.stream ? ` • ${profile.stream.toUpperCase()}` : ''}
            </Text>
            <Text style={styles.curriculumPillEdit}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* STREAK & XP ROW (Screen 1 Top Card) */}
        <View style={styles.streakXpCard}>
          {/* Left: Streak */}
          <View style={styles.streakLeftCol}>
            <View style={styles.streakHeaderRow}>
              <View style={styles.flameIconBadge}>
                <Text style={styles.flameEmoji}>🔥</Text>
              </View>
              <View style={styles.streakTextCol}>
                <Text style={styles.streakTitle}>12 Day Streak</Text>
                <Text style={styles.streakSub}>{isHindi ? 'लगातार अध्ययन! 🔥' : "You're on fire! 🔥"}</Text>
              </View>
            </View>

            {/* Weekday Dots: M T W T F S S */}
            <View style={styles.weekdayRow}>
              {[
                { day: 'M', active: true },
                { day: 'T', active: true },
                { day: 'W', active: true },
                { day: 'T', active: true },
                { day: 'F', active: true },
                { day: 'S', active: true },
                { day: 'S', active: false },
              ].map((item, index) => (
                <View key={index} style={styles.dayDotCol}>
                  <View style={[styles.dayDot, item.active ? styles.dayDotActive : styles.dayDotInactive]} />
                  <Text style={[styles.dayLabel, item.active && styles.dayLabelActive]}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.cardVerticalDivider} />

          {/* Right: XP Ring */}
          <View style={styles.xpRightCol}>
            <View style={styles.xpRingCircle}>
              <Text style={styles.xpRingSparkle}>✨</Text>
            </View>
            <Text style={styles.xpScoreText}>240 XP</Text>
            <Text style={styles.xpTodaySub}>+40 today</Text>
          </View>
        </View>

        {/* CONTINUE LEARNING SECTION (Hero Purple Card) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>{isHindi ? 'अध्ययन जारी रखें' : 'Continue Learning'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ModulesTab')}>
            <Text style={styles.viewAllText}>{isHindi ? 'सभी देखें ›' : 'View All ›'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroContinueCard}>
          <View style={styles.heroCardContent}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{activeChapter.badge}</Text>
              </View>
            </View>

            <Text style={styles.heroTopicTitle} numberOfLines={2}>
              {activeChapter.title}
            </Text>

            <View style={styles.heroLessonsRow}>
              <Text style={styles.heroProgressPercent}>{activeChapter.progress} complete</Text>
              <Text style={styles.heroLessonsCount}>12/16 Lessons</Text>
            </View>

            {/* White Progress Bar */}
            <View style={styles.heroProgressTrack}>
              <View style={[styles.heroProgressFill, { width: activeChapter.progress as any }]} />
            </View>

            {/* Pill Action Button */}
            <TouchableOpacity
              style={styles.heroContinueBtn}
              onPress={() => handleContinueLearning(activeChapter.moduleId, activeChapter.chapterId)}
              activeOpacity={0.85}
            >
              <Text style={styles.heroContinueBtnText}>
                {isHindi ? 'पाठ जारी रखें ›' : 'Continue Lessons ›'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Decorative 3D Book Graphic */}
          <View style={styles.heroCardGraphic}>
            <Text style={styles.heroGraphicEmoji}>📚</Text>
          </View>
        </View>

        {/* ASK GURU AI ANYTHING (Lumina AI Prompts Card) */}
        <View style={styles.askGuruContainer}>
          <View style={styles.askGuruHeaderRow}>
            <View style={styles.askGuruTitleGroup}>
              <View style={styles.askGuruHeaderLeft}>
                <Text style={styles.askGuruHeading}>
                  {isHindi ? 'गुरु AI से कुछ भी पूछें' : 'Ask Guru AI Anything'}
                </Text>
                <View style={styles.betaBadge}>
                  <Text style={styles.betaBadgeText}>OFFLINE</Text>
                </View>
              </View>
              <Text style={styles.askGuruSubtext}>
                {isHindi
                  ? 'किसी भी विषय को समझें, मुख्य बिंदु जानें या तुरंत क्विज़ बनाएं!'
                  : 'Explain a topic, get summaries, or create practice quizzes!'}
              </Text>
            </View>
            <View style={styles.askGuruMascotIcon}>
              <Text style={styles.mascotEmoji}>🤖</Text>
            </View>
          </View>

          {/* Quick Action Prompt Chips */}
          <View style={styles.chipsRow}>
            <TouchableOpacity
              style={styles.promptChip}
              onPress={() =>
                navigation.navigate('TutorTab', {
                  initialPrompt: isHindi ? 'सरल भाषा में समझाएं' : 'Explain in simple terms with an everyday analogy',
                })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>💬</Text>
              <Text style={styles.chipText}>{isHindi ? 'सरल भाषा' : 'Explain Simply'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.promptChip}
              onPress={() =>
                navigation.navigate('TutorTab', {
                  initialPrompt: isHindi ? 'इस अध्याय का मुख्य सार बताएं' : 'Summarise this lesson key points',
                })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>📝</Text>
              <Text style={styles.chipText}>{isHindi ? 'पाठ सार' : 'Summarise Lesson'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.promptChip}
              onPress={() => navigation.navigate('Quiz', { quizId: `quiz_${currentActiveSub}_ch01` })}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>💡</Text>
              <Text style={styles.chipText}>{isHindi ? 'क्विज़' : 'Generate Quiz'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.promptArrowBtn}
              onPress={() =>
                navigation.navigate('TutorTab', {
                  initialPrompt: activeChapter.askPrompt,
                })
              }
              activeOpacity={0.8}
            >
              <Text style={styles.promptArrowText}>➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MY SUBJECTS CAROUSEL */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            {isHindi ? `मेरे विषय (${selectedSubjects.length})` : `My Subjects (${selectedSubjects.length})`}
          </Text>
          <Text style={styles.subSubtitleText}>
            {isHindi ? 'अध्ययन के लिए विषय बदलें' : 'Tap to switch active subject'}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectCarouselContainer}
        >
          {selectedSubjects.map((subCode) => {
            const meta = getSubjectMeta(subCode);
            const isSelected = currentActiveSub === subCode;
            return (
              <TouchableOpacity
                key={subCode}
                style={[
                  styles.subjectPillCard,
                  isSelected && styles.selectedSubjectPillCard,
                ]}
                onPress={() => setActiveSubject(subCode)}
                activeOpacity={0.75}
              >
                <View style={styles.subjectPillTop}>
                  <Text style={styles.subjectPillEmoji}>{meta.emoji}</Text>
                  <View style={[styles.pillBadge, isSelected ? styles.pillBadgeActive : styles.pillBadgeInactive]}>
                    <Text style={[styles.pillBadgeText, isSelected && { color: palette.white }]}>
                      {isSelected ? (isHindi ? 'सक्रिय' : 'Active') : '✓ Offline'}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[styles.subjectPillTitle, isSelected && styles.selectedSubjectPillTitle]}
                  numberOfLines={1}
                >
                  {meta.name}
                </Text>
                <Text
                  style={[styles.subjectPillDesc, isSelected && styles.selectedSubjectPillDesc]}
                  numberOfLines={1}
                >
                  {meta.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F5FB',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userProfileCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EDE7FE',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  avatarLogoImage: {
    width: '100%',
    height: '100%',
  },
  userNameBlock: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  greetingSub: {
    fontSize: 12,
    color: '#79768F',
    marginTop: 1,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  notifIcon: {
    fontSize: 18,
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: palette.primary,
  },
  curriculumContextRow: {
    marginBottom: 14,
  },
  curriculumPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EDE7FE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  curriculumPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.primary,
    marginRight: 6,
  },
  curriculumPillEdit: {
    fontSize: 11,
  },
  streakXpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 18,
  },
  streakLeftCol: {
    flex: 1,
  },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flameIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  flameEmoji: {
    fontSize: 16,
  },
  streakTextCol: {},
  streakTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  streakSub: {
    fontSize: 11,
    color: '#FF7A45',
    fontWeight: '600',
  },
  weekdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 4,
  },
  dayDotCol: {
    alignItems: 'center',
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 3,
  },
  dayDotActive: {
    backgroundColor: palette.primary,
  },
  dayDotInactive: {
    backgroundColor: '#E5E2F5',
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A19FB5',
  },
  dayLabelActive: {
    color: palette.primary,
  },
  cardVerticalDivider: {
    width: 1,
    height: 52,
    backgroundColor: '#F0EDFB',
    marginHorizontal: 12,
  },
  xpRightCol: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  xpRingCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: palette.primary,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  xpRingSparkle: {
    fontSize: 14,
  },
  xpScoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  xpTodaySub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
  },
  heroContinueCard: {
    backgroundColor: palette.primary,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
    marginBottom: 18,
  },
  heroCardContent: {
    flex: 1,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroTopicTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  heroLessonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingRight: 10,
  },
  heroProgressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroLessonsCount: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  heroProgressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
    marginRight: 10,
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  heroContinueBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroContinueBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.primary,
  },
  heroCardGraphic: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  heroGraphicEmoji: {
    fontSize: 34,
  },
  askGuruContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 18,
  },
  askGuruHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  askGuruTitleGroup: {
    flex: 1,
  },
  askGuruHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  askGuruHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  betaBadge: {
    backgroundColor: '#EDE7FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  betaBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: palette.primary,
  },
  askGuruSubtext: {
    fontSize: 11,
    color: '#79768F',
    marginTop: 2,
  },
  askGuruMascotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  mascotEmoji: {
    fontSize: 22,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F5FB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  chipIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  promptArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  promptArrowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  subSubtitleText: {
    fontSize: 11,
    color: '#79768F',
  },
  subjectCarouselContainer: {
    paddingVertical: 4,
    gap: 10,
  },
  subjectPillCard: {
    width: 148,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#EDE9FE',
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedSubjectPillCard: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  subjectPillTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectPillEmoji: {
    fontSize: 22,
  },
  pillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  pillBadgeInactive: {
    backgroundColor: '#ECFDF5',
  },
  pillBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  subjectPillTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  selectedSubjectPillTitle: {
    color: '#FFFFFF',
  },
  subjectPillDesc: {
    fontSize: 10,
    color: '#79768F',
    marginTop: 2,
  },
  selectedSubjectPillDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
