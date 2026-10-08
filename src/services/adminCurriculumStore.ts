import { create } from 'zustand';
import { chunkCurriculumText, GeneratedChunk, RawCurriculumInput } from './curriculumChunker';
import { BoardType, StreamType } from '../types/student';

export interface AdminSubject {
  id: string; // subjectCode, e.g. 'robotics'
  code: string;
  name: string;
  nameHi?: string;
  icon: string;
  board: BoardType;
  state?: string | null;
  classLevel: number;
  stream?: StreamType;
  language: string;
  chapterCount: number;
  chunkCount: number;
  sizeMB: number;
  description: string;
  createdAt: string;
}

export interface AdminModule {
  id: string;
  code: string;
  name: string;
  subjectCode: string;
  classLevel: number;
  board: BoardType;
  state?: string | null;
  stream?: StreamType;
  sizeMB: number;
  chapterCount: number;
  isInstalled: boolean;
  version: string;
  author: string;
  description: string;
}

interface AdminCurriculumState {
  subjects: AdminSubject[];
  chunks: GeneratedChunk[];
  addSubjectWithCurriculum: (input: RawCurriculumInput) => { subject: AdminSubject; chunks: GeneratedChunk[] };
  deleteSubject: (subjectCode: string) => void;
  getSubject: (subjectCode: string) => AdminSubject | undefined;
  getSubjectsForProfile: (board: BoardType, classLevel: number, stream: StreamType, state?: string | null) => AdminSubject[];
  getChunksForSubject: (subjectCode: string) => GeneratedChunk[];
  searchAdminChunks: (query: string, subjectCode?: string) => GeneratedChunk[];
  resetToDefaults: () => void;
}

// Initial built-in sample admin subjects so admin dashboard has pre-verified data immediately available
const INITIAL_SAMPLE_INPUTS: RawCurriculumInput[] = [
  {
    board: 'cbse',
    classLevel: 10,
    language: 'en',
    subjectName: 'Robotics & Automation',
    subjectCode: 'robotics',
    subjectIcon: '🤖',
    chapterNumber: 1,
    chapterTitle: 'Sensors and Microcontrollers',
    chapterTitleHi: 'सेंसर एवं माइक्रोकंट्रोलर',
    sourcePage: 'CBSE Vocational Robotics Curriculum, Page 12',
    rawText: `## Topic: Introduction to Microcontrollers
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
    board: 'cbse',
    classLevel: 10,
    language: 'en',
    subjectName: 'Astronomy & Space Dynamics',
    subjectCode: 'astronomy',
    subjectIcon: '🚀',
    chapterNumber: 1,
    chapterTitle: 'Orbital Mechanics and Keplerian Motion',
    chapterTitleHi: 'कक्षीय यांत्रिकी एवं ग्रहों की गति',
    sourcePage: 'NCERT Astronomy Supplement, Page 4',
    rawText: `## Topic: Kepler's Laws of Planetary Motion
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
];

export const useAdminCurriculumStore = create<AdminCurriculumState>((set, get) => {
  // Generate initial sample chunks
  const initialChunks: GeneratedChunk[] = [];
  const initialSubjects: AdminSubject[] = [];

  for (const input of INITIAL_SAMPLE_INPUTS) {
    const generated = chunkCurriculumText(input);
    initialChunks.push(...generated);
    initialSubjects.push({
      id: input.subjectCode,
      code: input.subjectCode,
      name: input.subjectName,
      nameHi: input.chapterTitleHi,
      icon: input.subjectIcon || '📚',
      board: input.board as BoardType,
      state: input.state,
      classLevel: input.classLevel,
      stream: input.stream as StreamType,
      language: input.language,
      chapterCount: 1,
      chunkCount: generated.length,
      sizeMB: 28,
      description: `Admin curated curriculum for ${input.subjectName} with verified chapters.`,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    subjects: initialSubjects,
    chunks: initialChunks,

    addSubjectWithCurriculum: (input: RawCurriculumInput) => {
      const generated = chunkCurriculumText(input);
      const newSubject: AdminSubject = {
        id: input.subjectCode.toLowerCase().trim(),
        code: input.subjectCode.toLowerCase().trim(),
        name: input.subjectName.trim(),
        nameHi: input.chapterTitleHi,
        icon: input.subjectIcon || '📚',
        board: input.board.toLowerCase() as BoardType,
        state: input.state || null,
        classLevel: input.classLevel,
        stream: (input.stream ? input.stream.toLowerCase() : null) as StreamType,
        language: input.language,
        chapterCount: 1,
        chunkCount: generated.length,
        sizeMB: Math.max(15, Math.round(generated.length * 8)),
        description: `Admin uploaded curriculum for ${input.subjectName}`,
        createdAt: new Date().toISOString(),
      };

      set((state) => {
        // Replace existing subject if already added, or append
        const filteredSubjects = state.subjects.filter((s) => s.id !== newSubject.id);
        const filteredChunks = state.chunks.filter((c) => c.subjectId !== newSubject.id);

        return {
          subjects: [newSubject, ...filteredSubjects],
          chunks: [...generated, ...filteredChunks],
        };
      });

      return { subject: newSubject, chunks: generated };
    },

    deleteSubject: (subjectCode: string) => {
      set((state) => ({
        subjects: state.subjects.filter((s) => s.id !== subjectCode),
        chunks: state.chunks.filter((c) => c.subjectId !== subjectCode),
      }));
    },

    getSubject: (subjectCode: string) => {
      return get().subjects.find((s) => s.code === subjectCode || s.id === subjectCode);
    },

    getSubjectsForProfile: (board: BoardType, classLevel: number, stream: StreamType, state?: string | null) => {
      const all = get().subjects;
      return all.filter((s) => {
        if (s.classLevel !== classLevel) return false;
        if (s.board !== board && board !== 'state') return false;
        if (board === 'state' && state && s.state && s.state !== state) return false;
        if (classLevel >= 11 && stream && s.stream && s.stream !== stream) return false;
        return true;
      });
    },

    getChunksForSubject: (subjectCode: string) => {
      return get().chunks.filter((c) => c.subjectId === subjectCode);
    },

    searchAdminChunks: (query: string, subjectCode?: string) => {
      const terms = query
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 2);

      const pool = subjectCode
        ? get().chunks.filter((c) => c.subjectId === subjectCode)
        : get().chunks;

      if (terms.length === 0) return pool.slice(0, 3);

      const scored = pool.map((c) => {
        const text = `${c.topic} ${c.content} ${c.keyFactEn} ${c.analogyEn} ${c.practiceQuestionEn}`.toLowerCase();
        let matches = 0;
        for (const t of terms) {
          if (text.includes(t)) matches++;
        }
        return { chunk: c, score: matches };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored.filter((item) => item.score > 0).map((item) => item.chunk);
    },

    resetToDefaults: () => {
      set({ subjects: initialSubjects, chunks: initialChunks });
    },
  };
});
