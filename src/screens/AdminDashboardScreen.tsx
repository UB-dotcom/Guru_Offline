import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useAdminCurriculumStore, AdminSubject } from '../services/adminCurriculumStore';
import { chunkCurriculumText, GeneratedChunk, RawCurriculumInput } from '../services/curriculumChunker';
import { useProfileStore } from '../store/profileStore';
import { palette } from '../theme/colors';
import { BoardType, StreamType } from '../types/student';
import { aiService } from '../services/aiService';

interface AdminDashboardScreenProps {
  navigation: any;
}

type DashboardTab = 'add' | 'manage' | 'simulator';

// Preset sample curriculums for 1-tap admin ingestion & testing
const PRESET_TEMPLATES = [
  {
    name: '🤖 Robotics & Microcontrollers',
    subjectName: 'Robotics & Automation',
    subjectCode: 'robotics',
    subjectIcon: '🤖',
    chapterNumber: 1,
    chapterTitle: 'Sensors and Microcontrollers',
    chapterTitleHi: 'सेंसर एवं माइक्रोकंट्रोलर',
    board: 'cbse' as BoardType,
    classLevel: 10,
    language: 'en',
    sourcePage: 'CBSE Skill Curriculum Unit 1',
    content: `## Topic: Introduction to Microcontrollers
A microcontroller is an integrated circuit (IC) that contains a processor core, memory (RAM and flash), and programmable input/output peripherals on a single chip. It serves as the intelligent brain of any autonomous robotic system.
Formula: Clock Speed f = 1 / T | Vcc = 5V DC Standard Logic Level
Analogy: Just as the human brain coordinates sensory signals and sends commands to muscles, a microcontroller receives data from sensors and actuates robotic motors.
Practice Question: Which component serves as the central processing brain of an autonomous robot?
A) Microcontroller
B) Chassis frame
C) 9V Battery
D) Rubber wheel
Correct Answer: Option A (The microcontroller executes program logic and coordinates motor control).

## Topic: Ultrasonic Distance Sensors
Ultrasonic sensors (such as HC-SR04) measure distance to an obstacle by emitting high-frequency acoustic waves and measuring the transit time for the echo to return.
Formula: Distance = (Time of Flight × Speed of Sound 343 m/s) / 2
Analogy: Bats navigate pitch-black caves using echolocation, calculating obstacle proximity by listening to bounced sound waves.
Practice Question: What physical phenomenon do ultrasonic distance sensors utilize?
A) Echolocation via acoustic pulse reflection
B) Infrared thermal radiation
C) Magnetic induction
D) Doppler frequency modulation
Correct Answer: Option A (The sensor calculates distance from the round-trip time of a 40 kHz ultrasonic acoustic wave).

## Topic: DC Motors and Motor Drivers (H-Bridge)
Robots require high current to drive electric motors, which microcontrollers cannot supply directly from GPIO pins. Motor driver ICs (like L298N) use H-Bridge circuitry to control motor speed and bidirectional rotation.
Formula: PWM Duty Cycle % = (Ton / Tperiod) × 100
Analogy: A motor driver acts like an electronic gearbox or power relay, allowing low-power signals from the brain to safely control heavy-duty machinery.
Practice Question: Why is an H-Bridge motor driver required between an Arduino microcontroller and a DC motor?
A) Microcontroller GPIO pins cannot supply high current demanded by motors
B) To convert AC power to DC power
C) To amplify acoustic frequencies
D) To regulate battery chemistry
Correct Answer: Option A (Motor driver ICs isolate sensitive logic pins and handle high inductive current).`,
  },
  {
    name: '🚀 Astronomy & Space Dynamics',
    subjectName: 'Astronomy & Space Dynamics',
    subjectCode: 'astronomy',
    subjectIcon: '🚀',
    chapterNumber: 1,
    chapterTitle: 'Orbital Mechanics and Keplerian Motion',
    chapterTitleHi: 'कक्षीय यांत्रिकी एवं ग्रहों की गति',
    board: 'cbse' as BoardType,
    classLevel: 10,
    language: 'en',
    sourcePage: 'NCERT Astronomy Supplement, Page 4',
    content: `## Topic: Kepler's Laws of Planetary Motion
Johannes Kepler formulated three fundamental laws of planetary motion:
1. Law of Orbits: All planets move in elliptical orbits with the Sun at one focus.
2. Law of Areas: A line joining a planet and the Sun sweeps out equal areas during equal intervals of time.
3. Law of Periods: The square of the orbital period T is directly proportional to the cube of the semi-major axis r (T² ∝ r³).
Formula: Kepler's Third Law: T² / r³ = 4π² / (G × M_sun)
Analogy: Just as an ice skater spins faster when drawing their arms in, a planet accelerates to higher velocities when closest to the Sun (perihelion) to sweep equal areas.
Practice Question: According to Kepler's Second Law, when does a planet move fastest along its orbit?
A) At perihelion (closest to the Sun)
B) At aphelion (farthest from the Sun)
C) At constant velocity everywhere
D) During lunar eclipse
Correct Answer: Option A (Planets travel fastest at perihelion to sweep equal areas in equal time).

## Topic: Escape Velocity and Satellite Orbits
Escape velocity is the minimum speed needed for an unpowered object to break free from the gravitational pull of a celestial body without further propulsion.
Formula: Escape Velocity Ve = √(2GM / R) = √(2gR) (≈ 11.2 km/s for Earth)
Analogy: Throwing a ball upward gently returns it to Earth; if launched at 11.2 km/s, Earth's gravity can never pull it back down into orbit.
Practice Question: What is the approximate escape velocity from the surface of Earth?
A) 11.2 km/s
B) 3.0 × 10⁸ m/s
C) 9.8 m/s
D) 1.6 km/s
Correct Answer: Option A (11.2 kilometers per second is required to overcome Earth's gravitational binding energy).`,
  },
  {
    name: '🧠 Artificial Intelligence & Neural Nets',
    subjectName: 'Artificial Intelligence',
    subjectCode: 'artificial_intelligence',
    subjectIcon: '🧠',
    chapterNumber: 1,
    chapterTitle: 'Perceptrons and Deep Learning Foundations',
    chapterTitleHi: 'पर्सेप्ट्रॉन एवं डीप लर्निंग आधार',
    board: 'cbse' as BoardType,
    classLevel: 10,
    language: 'en',
    sourcePage: 'CBSE AI Curriculum Grade 10',
    content: `## Topic: Artificial Neural Networks & Perceptrons
An artificial neuron (Perceptron) receives weighted inputs, computes their sum, adds a bias term, and passes the result through an activation function (like ReLU or Sigmoid) to generate an output.
Formula: Output y = Activation(Σ(wi * xi) + b)
Analogy: Biological dendrites collect electrochemical signals, the cell body sums them up, and the axon fires only if the electrical potential exceeds a activation threshold.
Practice Question: What is the role of an activation function in an artificial neural network?
A) It introduces non-linearity to allow learning complex non-linear patterns
B) It stores training weights in permanent RAM
C) It increases the clock frequency of the GPU
D) It converts digital bits to analog voltages
Correct Answer: Option A (Without non-linear activations, multi-layer neural networks would collapse into simple linear regression).

## Topic: Training via Backpropagation and Gradient Descent
Neural networks learn by comparing their prediction against ground-truth labels using a loss function. Optimization algorithms like Stochastic Gradient Descent (SGD) adjust network weights in the opposite direction of the gradient to minimize error.
Formula: Weight Update: w_new = w_old - (learning_rate × ∂Loss / ∂w)
Analogy: Finding the bottom of a foggy valley by taking small steps downhill in the direction of steepest slope.
Practice Question: What hyperparameter controls the step size during Gradient Descent weight updates?
A) Learning Rate (Alpha)
B) Batch Size
C) Number of Epochs
D) Hidden Layer Width
Correct Answer: Option A (Learning rate dictates the magnitude of parameter adjustments in the negative gradient direction).`,
  },
];

const AVAILABLE_ICONS = ['🤖', '🚀', '🧠', '🧬', '⚡', '💻', '🧪', '🛰️', '📐', '🌍', '🌱', '📈'];
const BOARDS: BoardType[] = ['cbse', 'icse', 'state'];
const CLASSES = [6, 7, 8, 9, 10, 11, 12];

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  const { subjects, chunks, addSubjectWithCurriculum, deleteSubject, resetToDefaults } =
    useAdminCurriculumStore();
  const { profile, setSelectedSubjects, setActiveSubject } = useProfileStore();

  const [activeTab, setActiveTab] = useState<DashboardTab>('add');

  // Form states for Ingest tab
  const [board, setBoard] = useState<BoardType>('cbse');
  const [classLevel, setClassLevel] = useState<number>(10);
  const [stream, setStream] = useState<StreamType>('science');
  const [language, setLanguage] = useState<'en' | 'hi' | 'bilingual'>('en');
  const [subjectName, setSubjectName] = useState<string>('Robotics & Automation');
  const [subjectCode, setSubjectCode] = useState<string>('robotics');
  const [subjectIcon, setSubjectIcon] = useState<string>('🤖');
  const [chapterNumber, setChapterNumber] = useState<string>('1');
  const [chapterTitle, setChapterTitle] = useState<string>('Sensors and Microcontrollers');
  const [chapterTitleHi, setChapterTitleHi] = useState<string>('सेंसर एवं माइक्रोकंट्रोलर');
  const [sourcePage, setSourcePage] = useState<string>('CBSE Curriculum Doc');
  const [rawText, setRawText] = useState<string>(PRESET_TEMPLATES[0].content);

  // Live preview chunks
  const [previewChunks, setPreviewChunks] = useState<GeneratedChunk[]>([]);
  const [showChunkModal, setShowChunkModal] = useState<boolean>(false);
  const [inspectingSubject, setInspectingSubject] = useState<AdminSubject | null>(null);

  // RAG Simulator states
  const [simQuery, setSimQuery] = useState<string>('How does an ultrasonic distance sensor work?');
  const [simResults, setSimResults] = useState<GeneratedChunk[]>([]);
  const [simAiAnswer, setSimAiAnswer] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Load a preset template into form
  const handleLoadTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setSubjectName(tpl.subjectName);
    setSubjectCode(tpl.subjectCode);
    setSubjectIcon(tpl.subjectIcon);
    setChapterNumber(String(tpl.chapterNumber));
    setChapterTitle(tpl.chapterTitle);
    setChapterTitleHi(tpl.chapterTitleHi);
    setBoard(tpl.board);
    setClassLevel(tpl.classLevel);
    setSourcePage(tpl.sourcePage);
    setRawText(tpl.content);
    setPreviewChunks([]);
    Alert.alert('Template Loaded', `Loaded "${tpl.name}". You can now review, edit or generate chunks.`);
  };

  // Preview generated chunks before saving
  const handlePreviewChunks = () => {
    if (!rawText.trim()) {
      Alert.alert('Empty Content', 'Please provide curriculum markdown or notes text to chunk.');
      return;
    }
    const input: RawCurriculumInput = {
      board,
      classLevel,
      stream: classLevel >= 11 ? stream : undefined,
      language,
      subjectName,
      subjectCode: subjectCode || subjectName.toLowerCase().replace(/\s+/g, '_'),
      subjectIcon,
      chapterNumber: parseInt(chapterNumber, 10) || 1,
      chapterTitle,
      chapterTitleHi,
      sourcePage,
      rawText,
    };
    const generated = chunkCurriculumText(input);
    setPreviewChunks(generated);
    Alert.alert('Chunks Generated', `Generated ${generated.length} retrieval-optimized chunks with formulas, analogies, and practice checks.`);
  };

  // Commit and save to SQLite / Zustand store
  const handleSaveToDatabase = () => {
    if (!subjectName.trim() || !rawText.trim()) {
      Alert.alert('Validation Error', 'Subject Name and Curriculum Content are required.');
      return;
    }

    const effectiveCode = (subjectCode || subjectName.toLowerCase().replace(/\s+/g, '_')).trim().toLowerCase();

    const input: RawCurriculumInput = {
      board,
      classLevel,
      stream: classLevel >= 11 ? stream : undefined,
      language,
      subjectName: subjectName.trim(),
      subjectCode: effectiveCode,
      subjectIcon,
      chapterNumber: parseInt(chapterNumber, 10) || 1,
      chapterTitle: chapterTitle.trim(),
      chapterTitleHi: chapterTitleHi.trim(),
      sourcePage: sourcePage.trim(),
      rawText,
    };

    const { subject, chunks: createdChunks } = addSubjectWithCurriculum(input);

    // Auto-add to student's profile selected subjects if not present
    if (!profile.selectedSubjects.includes(effectiveCode)) {
      setSelectedSubjects([...profile.selectedSubjects, effectiveCode]);
    }

    Alert.alert(
      '✅ Curriculum Saved to SQLite',
      `Subject "${subject.name}" (${createdChunks.length} chunks) is now indexed in local SQLite FTS5 database.\n\nIt is immediately available to the student for reading, practice, and Guru AI queries.`,
      [
        {
          text: 'Set as Active & Open Home',
          onPress: () => {
            setActiveSubject(effectiveCode);
            navigation.navigate('MainTabs', { screen: 'HomeTab' });
          },
        },
        {
          text: 'Manage Subjects',
          onPress: () => setActiveTab('manage'),
        },
        {
          text: 'OK',
        },
      ]
    );
  };

  // Run RAG query simulation
  const handleRunSimulator = async () => {
    if (!simQuery.trim()) return;
    setIsSimulating(true);
    setSimAiAnswer(null);

    try {
      const searchTerms = simQuery.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
      const matched = chunks.filter((c) => {
        const text = `${c.topic} ${c.content} ${c.keyFactEn} ${c.analogyEn} ${c.practiceQuestionEn}`.toLowerCase();
        return searchTerms.some((t) => text.includes(t));
      });
      setSimResults(matched.length > 0 ? matched.slice(0, 3) : chunks.slice(0, 2));

      // Query aiService directly
      const response = await aiService.ask(
        simQuery,
        subjectCode,
        'ask_followup',
        {
          language,
          classLevel,
          board,
          selectedSubjects: [subjectCode],
        }
      );
      setSimAiAnswer(response.answer);
    } catch (e: any) {
      setSimAiAnswer(`Error simulating answer: ${e?.message || 'Unknown error'}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Curriculum Admin Studio</Text>
            <Text style={styles.headerSubtitle}>Offline SQLite & Local RAG Knowledge Engine</Text>
          </View>
        </View>

        {/* Status badges */}
        <View style={styles.badgeRow}>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>● SQLite FTS5 ACTIVE</Text>
          </View>
          <View style={styles.engineBadge}>
            <Text style={styles.engineBadgeText}>⚡ {chunks.length} Total Chunks</Text>
          </View>
          <View style={styles.subjectsBadge}>
            <Text style={styles.subjectsBadgeText}>📚 {subjects.length} Admin Subjects</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'add' && styles.tabItemActive]}
            onPress={() => setActiveTab('add')}
          >
            <Text style={[styles.tabText, activeTab === 'add' && styles.tabTextActive]}>
              ➕ Ingest Curriculum
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'manage' && styles.tabItemActive]}
            onPress={() => setActiveTab('manage')}
          >
            <Text style={[styles.tabText, activeTab === 'manage' && styles.tabTextActive]}>
              📚 Manage ({subjects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'simulator' && styles.tabItemActive]}
            onPress={() => setActiveTab('simulator')}
          >
            <Text style={[styles.tabText, activeTab === 'simulator' && styles.tabTextActive]}>
              🧪 RAG Simulator
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ========================================================== */}
        {/* TAB 1: INGEST CURRICULUM */}
        {/* ========================================================== */}
        {activeTab === 'add' && (
          <View style={styles.tabContent}>
            {/* Quick Template Presets */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick Load Verified Template</Text>
              <Text style={styles.cardDesc}>
                Populate verified curriculum syllabus and notes with one tap to test ingestion:
              </Text>
              <View style={styles.presetRow}>
                {PRESET_TEMPLATES.map((tpl, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.presetBtn}
                    onPress={() => handleLoadTemplate(tpl)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.presetBtnText}>{tpl.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Target Profile Settings */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>1. Target Student Cohort</Text>

              <Text style={styles.inputLabel}>Education Board</Text>
              <View style={styles.chipRow}>
                {BOARDS.map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.chip, board === b && styles.chipActive]}
                    onPress={() => setBoard(b)}
                  >
                    <Text style={[styles.chipText, board === b && styles.chipTextActive]}>
                      {b.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Grade / Class</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScrollChips}>
                {CLASSES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, classLevel === c && styles.chipActive]}
                    onPress={() => setClassLevel(c)}
                  >
                    <Text style={[styles.chipText, classLevel === c && styles.chipTextActive]}>
                      Class {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {classLevel >= 11 && (
                <>
                  <Text style={styles.inputLabel}>Academic Stream</Text>
                  <View style={styles.chipRow}>
                    {(['science', 'commerce', 'arts'] as const).map((st) => (
                      <TouchableOpacity
                        key={st}
                        style={[styles.chip, stream === st && styles.chipActive]}
                        onPress={() => setStream(st)}
                      >
                        <Text style={[styles.chipText, stream === st && styles.chipTextActive]}>
                          {st.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.inputLabel}>Language Medium</Text>
              <View style={styles.chipRow}>
                {(['en', 'hi', 'bilingual'] as const).map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.chip, language === l && styles.chipActive]}
                    onPress={() => setLanguage(l)}
                  >
                    <Text style={[styles.chipText, language === l && styles.chipTextActive]}>
                      {l === 'en' ? 'English' : l === 'hi' ? 'Hindi (हिंदी)' : 'Bilingual'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Subject & Chapter Metadata */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>2. Subject & Chapter Specification</Text>

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Subject Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={subjectName}
                    onChangeText={(text) => {
                      setSubjectName(text);
                      setSubjectCode(text.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                    }}
                    placeholder="e.g. Robotics & Automation"
                    placeholderTextColor={palette.gray400}
                  />
                </View>

                <View style={{ width: 110 }}>
                  <Text style={styles.inputLabel}>Subject Code</Text>
                  <TextInput
                    style={styles.textInput}
                    value={subjectCode}
                    onChangeText={setSubjectCode}
                    placeholder="robotics"
                    placeholderTextColor={palette.gray400}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Subject Icon / Emoji</Text>
              <View style={styles.iconChipRow}>
                {AVAILABLE_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconChip, subjectIcon === icon && styles.iconChipActive]}
                    onPress={() => setSubjectIcon(icon)}
                  >
                    <Text style={styles.iconChipText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.formRow}>
                <View style={{ width: 80, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Chapter #</Text>
                  <TextInput
                    style={styles.textInput}
                    value={chapterNumber}
                    onChangeText={setChapterNumber}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Chapter Title (English)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={chapterTitle}
                    onChangeText={setChapterTitle}
                    placeholder="Sensors and Microcontrollers"
                    placeholderTextColor={palette.gray400}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Chapter Title (Hindi Translation)</Text>
              <TextInput
                style={styles.textInput}
                value={chapterTitleHi}
                onChangeText={setChapterTitleHi}
                placeholder="सेंसर एवं माइक्रोकंट्रोलर"
                placeholderTextColor={palette.gray400}
              />

              <Text style={styles.inputLabel}>Source Reference / Accreditation</Text>
              <TextInput
                style={styles.textInput}
                value={sourcePage}
                onChangeText={setSourcePage}
                placeholder="e.g. CBSE Vocational Skill Module 1"
                placeholderTextColor={palette.gray400}
              />
            </View>

            {/* Curriculum File / Markdown Input */}
            <View style={styles.card}>
              <View style={styles.cardHeaderFlex}>
                <Text style={styles.cardTitle}>3. Curriculum Notes / Textbook Text</Text>
                <Text style={styles.charCountText}>{rawText.length} chars</Text>
              </View>
              <Text style={styles.cardDesc}>
                Paste notes, syllabus topics, or textbook text. The parser automatically structures chunks by "## Topic:", formulas, analogies, and practice checks:
              </Text>

              <TextInput
                style={styles.textAreaInput}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                value={rawText}
                onChangeText={setRawText}
                placeholder="## Topic: Title\nExplanation of the concept...\nFormula: ...\nAnalogy: ...\nPractice Question: ..."
                placeholderTextColor={palette.gray400}
              />

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.previewBtn}
                  onPress={handlePreviewChunks}
                  activeOpacity={0.8}
                >
                  <Text style={styles.previewBtnText}>⚡ Parse & Preview Chunks</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveToDatabase}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveBtnText}>💾 Commit to SQLite</Text>
                </TouchableOpacity>
              </View>

              {/* Preview List */}
              {previewChunks.length > 0 && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewHeading}>
                    Preview Generated Chunks ({previewChunks.length})
                  </Text>
                  {previewChunks.map((c, idx) => (
                    <View key={idx} style={styles.previewChunkCard}>
                      <View style={styles.chunkCardTop}>
                        <Text style={styles.chunkIndexBadge}>Chunk #{idx + 1}</Text>
                        <Text style={styles.chunkTopicTitle}>{c.topic}</Text>
                      </View>
                      <Text style={styles.chunkContent}>{c.content}</Text>
                      {c.keyFactEn ? (
                        <View style={styles.chunkFormulaBox}>
                          <Text style={styles.chunkFormulaText}>📐 Formula: {c.keyFactEn}</Text>
                        </View>
                      ) : null}
                      {c.analogyEn ? (
                        <View style={styles.chunkAnalogyBox}>
                          <Text style={styles.chunkAnalogyText}>💡 Analogy: {c.analogyEn}</Text>
                        </View>
                      ) : null}
                      {c.practiceQuestionEn ? (
                        <View style={styles.chunkQuizBox}>
                          <Text style={styles.chunkQuizText}>❓ {c.practiceQuestionEn}</Text>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* ========================================================== */}
        {/* TAB 2: MANAGE SUBJECTS */}
        {/* ========================================================== */}
        {activeTab === 'manage' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <View style={styles.cardHeaderFlex}>
                <Text style={styles.cardTitle}>SQLite Curriculum Catalog</Text>
                <TouchableOpacity onPress={resetToDefaults}>
                  <Text style={styles.resetLink}>Reset Defaults</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardDesc}>
                These subjects are indexed in the device's local database and fully accessible to the student.
              </Text>
            </View>

            {subjects.map((sub) => {
              const subChunks = chunks.filter((c) => c.subjectId === sub.code);
              const isActive = profile.activeSubjectId === sub.code;

              return (
                <View key={sub.id} style={styles.subjectCard}>
                  <View style={styles.subCardTop}>
                    <Text style={styles.subIcon}>{sub.icon}</Text>
                    <View style={styles.subTitleCol}>
                      <Text style={styles.subName}>{sub.name}</Text>
                      <Text style={styles.subCodeText}>
                        Code: {sub.code} • Class {sub.classLevel} • {sub.board.toUpperCase()}
                      </Text>
                    </View>
                    {isActive ? (
                      <View style={styles.currentActiveBadge}>
                        <Text style={styles.currentActiveText}>Active</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.subDesc}>{sub.description}</Text>

                  <View style={styles.subStatsRow}>
                    <Text style={styles.subStatItem}>📊 {subChunks.length} Chunks</Text>
                    <Text style={styles.subStatItem}>💾 {sub.sizeMB} MB</Text>
                    <Text style={styles.subStatItem}>
                      🌐 {sub.language === 'en' ? 'English' : 'Hindi'}
                    </Text>
                  </View>

                  <View style={styles.subActionRow}>
                    <TouchableOpacity
                      style={styles.inspectBtn}
                      onPress={() => {
                        setInspectingSubject(sub);
                        setShowChunkModal(true);
                      }}
                    >
                      <Text style={styles.inspectBtnText}>🔍 Inspect Chunks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.makeActiveBtn}
                      onPress={() => {
                        if (!profile.selectedSubjects.includes(sub.code)) {
                          setSelectedSubjects([...profile.selectedSubjects, sub.code]);
                        }
                        setActiveSubject(sub.code);
                        Alert.alert('Active Subject Set', `"${sub.name}" is now the active learning subject.`);
                      }}
                    >
                      <Text style={styles.makeActiveBtnText}>⭐ Set Active</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => {
                        Alert.alert(
                          'Delete Subject',
                          `Remove "${sub.name}" and all associated ${subChunks.length} chunks from SQLite?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => deleteSubject(sub.code),
                            },
                          ]
                        );
                      }}
                    >
                      <Text style={styles.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ========================================================== */}
        {/* TAB 3: RAG & AI SIMULATOR */}
        {/* ========================================================== */}
        {activeTab === 'simulator' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Test Offline RAG & Guru AI Engine</Text>
              <Text style={styles.cardDesc}>
                Simulate a student query against the local SQLite database to verify chunk retrieval and pedagogical structured response generation:
              </Text>

              {/* Preset queries */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScrollChips}>
                {[
                  'How does an ultrasonic distance sensor work?',
                  'What is escape velocity from Earth?',
                  'Why is an H-Bridge motor driver needed?',
                  'What are Kepler\'s three laws of planetary motion?',
                  'What is a Perceptron activation function?',
                ].map((q, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.chip, simQuery === q && styles.chipActive]}
                    onPress={() => setSimQuery(q)}
                  >
                    <Text style={[styles.chipText, simQuery === q && styles.chipTextActive]}>
                      {q}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Student Query</Text>
              <TextInput
                style={styles.textInput}
                value={simQuery}
                onChangeText={setSimQuery}
                placeholder="Ask any question about custom subjects..."
                placeholderTextColor={palette.gray400}
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleRunSimulator}
                disabled={isSimulating}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>
                  {isSimulating ? '⏳ Retrieving & Generating...' : '🚀 Test Retrieval & AI Response'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Retrieval Results */}
            {simResults.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  Top Matched SQLite Chunks ({simResults.length})
                </Text>
                {simResults.map((r, i) => (
                  <View key={i} style={styles.simResultCard}>
                    <View style={styles.chunkCardTop}>
                      <Text style={styles.simBadge}>Rank #{i + 1} • BM25 Match</Text>
                      <Text style={styles.chunkTopicTitle}>{r.topic}</Text>
                    </View>
                    <Text style={styles.simChunkSubject}>
                      Subject: {r.subjectName} • Chapter: {r.chapterTitle}
                    </Text>
                    <Text style={styles.chunkContent}>{r.content}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Generated AI Answer */}
            {simAiAnswer && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Guru AI Pedagogical Response</Text>
                <View style={styles.aiAnswerBox}>
                  <Text style={styles.aiAnswerText}>{simAiAnswer}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Inspect Chunks Modal */}
      <Modal visible={showChunkModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {inspectingSubject?.icon} {inspectingSubject?.name} — Chunks
              </Text>
              <TouchableOpacity onPress={() => setShowChunkModal(false)}>
                <Text style={styles.modalCloseText}>✕ Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {inspectingSubject &&
                chunks
                  .filter((c) => c.subjectId === inspectingSubject.code)
                  .map((chunk, idx) => (
                    <View key={idx} style={styles.modalChunkCard}>
                      <Text style={styles.modalChunkTopic}>
                        {idx + 1}. {chunk.topic}
                      </Text>
                      <Text style={styles.modalChunkText}>{chunk.content}</Text>
                      {chunk.keyFactEn ? (
                        <Text style={styles.modalFormula}>📐 {chunk.keyFactEn}</Text>
                      ) : null}
                      {chunk.analogyEn ? (
                        <Text style={styles.modalAnalogy}>💡 {chunk.analogyEn}</Text>
                      ) : null}
                      {chunk.practiceQuestionEn ? (
                        <Text style={styles.modalQuiz}>❓ {chunk.practiceQuestionEn}</Text>
                      ) : null}
                    </View>
                  ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F5FB',
  },
  header: {
    backgroundColor: palette.white,
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray200,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.gray800,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.gray900,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  activeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  engineBadge: {
    backgroundColor: '#EDE7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  engineBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.primary,
  },
  subjectsBadge: {
    backgroundColor: palette.gray100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  subjectsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.gray700,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: palette.gray100,
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabItemActive: {
    backgroundColor: palette.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.gray500,
  },
  tabTextActive: {
    fontWeight: '800',
    color: palette.primary,
  },
  scrollContent: {
    padding: 16,
  },
  tabContent: {
    gap: 16,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.gray200,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.gray900,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: palette.gray600,
    marginBottom: 12,
    lineHeight: 17,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8B4FE',
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B21A8',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.gray700,
    marginTop: 10,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hScrollChips: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  chip: {
    backgroundColor: palette.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.gray700,
  },
  chipTextActive: {
    color: palette.white,
    fontWeight: '700',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: palette.gray50,
    borderWidth: 1,
    borderColor: palette.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: palette.gray900,
  },
  iconChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  iconChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  iconChipActive: {
    backgroundColor: '#EDE7FF',
    borderColor: palette.primary,
    borderWidth: 2,
  },
  iconChipText: {
    fontSize: 18,
  },
  charCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.gray400,
  },
  textAreaInput: {
    backgroundColor: palette.gray50,
    borderWidth: 1,
    borderColor: palette.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: palette.gray900,
    minHeight: 180,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  previewBtn: {
    flex: 1,
    backgroundColor: palette.gray100,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.gray300,
  },
  previewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.gray800,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.white,
  },
  previewSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: palette.gray200,
    paddingTop: 12,
    gap: 10,
  },
  previewHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: palette.gray900,
    marginBottom: 4,
  },
  previewChunkCard: {
    backgroundColor: palette.gray50,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: palette.gray200,
    gap: 6,
  },
  chunkCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chunkIndexBadge: {
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: '#EDE7FF',
    color: palette.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  chunkTopicTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.gray900,
    flex: 1,
  },
  chunkContent: {
    fontSize: 12,
    color: palette.gray700,
    lineHeight: 17,
  },
  chunkFormulaBox: {
    backgroundColor: '#EFF6FF',
    padding: 6,
    borderRadius: 6,
  },
  chunkFormulaText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  chunkAnalogyBox: {
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: 6,
  },
  chunkAnalogyText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
  },
  chunkQuizBox: {
    backgroundColor: '#ECFDF5',
    padding: 6,
    borderRadius: 6,
  },
  chunkQuizText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
  },
  resetLink: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.danger,
  },
  subjectCard: {
    backgroundColor: palette.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.gray200,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  subCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  subTitleCol: {
    flex: 1,
  },
  subName: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.gray900,
  },
  subCodeText: {
    fontSize: 11,
    color: palette.gray500,
    fontWeight: '600',
  },
  currentActiveBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentActiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  subDesc: {
    fontSize: 12,
    color: palette.gray600,
    lineHeight: 16,
  },
  subStatsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: palette.gray100,
  },
  subStatItem: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.gray600,
  },
  subActionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inspectBtn: {
    flex: 1,
    backgroundColor: palette.gray100,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.gray700,
  },
  makeActiveBtn: {
    flex: 1,
    backgroundColor: '#EDE7FF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.primary,
  },
  makeActiveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 14,
  },
  simResultCard: {
    backgroundColor: palette.gray50,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginBottom: 8,
    gap: 4,
  },
  simBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: palette.secondaryDark,
    backgroundColor: palette.secondarySurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  simChunkSubject: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.primary,
  },
  aiAnswerBox: {
    backgroundColor: '#F3E8FF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8B4FE',
  },
  aiAnswerText: {
    fontSize: 13,
    color: palette.gray900,
    lineHeight: 20,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: palette.white,
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray200,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.gray900,
    flex: 1,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.primary,
  },
  modalChunkCard: {
    backgroundColor: palette.gray50,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: palette.gray200,
    gap: 6,
  },
  modalChunkTopic: {
    fontSize: 13,
    fontWeight: '800',
    color: palette.gray900,
  },
  modalChunkText: {
    fontSize: 12,
    color: palette.gray700,
    lineHeight: 18,
  },
  modalFormula: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '700',
    backgroundColor: '#EFF6FF',
    padding: 6,
    borderRadius: 6,
  },
  modalAnalogy: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '700',
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: 6,
  },
  modalQuiz: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700',
    backgroundColor: '#ECFDF5',
    padding: 6,
    borderRadius: 6,
  },
});
