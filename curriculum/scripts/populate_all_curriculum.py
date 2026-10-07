"""
Populate All Curriculum Subjects and Streams for Guru Offline
Adds subject, module, chapter, and chunk definitions for all Classes (1–12)
and all Streams (Science, Commerce, Arts/Humanities) for CBSE, ICSE, and State Boards.
Preserves existing verified Class 10 Science (from jesc1dd.zip) and Math data.
"""

import sys
import json
import sqlite3
import shutil
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CURRICULUM_DIR = ROOT_DIR / "curriculum"
MASTER_DB_PATH = CURRICULUM_DIR / "curriculum.db"
TARGET_DBS = [
    ROOT_DIR / "backend" / "database" / "curriculum.db",
    ROOT_DIR / "backend" / "OfflineTutorAI" / "database" / "curriculum.db",
    ROOT_DIR / "android" / "app" / "src" / "main" / "assets" / "curriculum.db"
]
FRONTEND_EXPORT_PATH = ROOT_DIR / "src" / "data" / "curriculumDatabase.json"

# Curriculum Subject Definitions Template
CURRICULUM_MATRIX = {
    # Primary (Classes 1-5)
    "primary": [
        {
            "code": "mathematics",
            "name": "Mathematics",
            "name_hi": "गणित (Mathematics)",
            "icon": "📐",
            "description": "Numbers, Addition, Subtraction, Shapes, Measurement & Fun Math",
            "chapters": [
                (1, "Shapes and Space", "आकृतियाँ और स्थान", "2D and 3D shapes, spatial understanding"),
                (2, "Numbers and Counting", "गिनती और संख्याएँ", "Place value, counting up to 1000"),
                (3, "Addition and Subtraction", "जोड़ और घटाव", "Basic arithmetic operations and word problems"),
                (4, "Multiplication and Division", "गुणा और भाग", "Times tables, sharing and division concepts"),
                (5, "Time and Measurement", "समय और मापन", "Reading clocks, measuring length, weight and capacity"),
            ],
            "chunk_topic": "Basic Arithmetic & Numbers",
            "chunk_content": "Numbers represent quantities. Place values follow the base-10 decimal system.",
            "chunk_content_hi": "संख्याएँ मात्राओं को दर्शाती हैं। स्थानीय मान दशमलव प्रणाली पर आधारित हैं।"
        },
        {
            "code": "evs",
            "name": "Environmental Studies (EVS)",
            "name_hi": "पर्यावरण अध्ययन (EVS)",
            "icon": "🌱",
            "description": "Family, Plants, Animals, Water, Food, Travel & Community Life",
            "chapters": [
                (1, "My Family and Friends", "मेरा परिवार और मित्र", "Relationships, helping at home, and pets"),
                (2, "Plant Life Around Us", "हमारे आस-पास के पौधे", "Parts of plants, leaves, trees and flowers"),
                (3, "Animal World", "पशु जगत", "Domestic and wild animals, habitats and care"),
                (4, "Water: Source of Life", "जल: जीवन का आधार", "Sources of water, saving water and clean drinking water"),
                (5, "Our Environment and Cleanliness", "हमारा पर्यावरण और स्वच्छता", "Clean surroundings, hygiene and recycling"),
            ],
            "chunk_topic": "EVS Core Concepts",
            "chunk_content": "Living organisms depend on water, plants, clean air and balanced ecosystem.",
            "chunk_content_hi": "सभी जीव जल, पौधों, स्वच्छ हवा और संतुलित पर्यावरण पर निर्भर हैं।"
        },
        {
            "code": "english",
            "name": "English",
            "name_hi": "अंग्रेजी (English)",
            "icon": "📖",
            "description": "Phonics, Stories, Rhymes, Reading Comprehension & Basic Grammar",
            "chapters": [
                (1, "Alphabet & Phonics", "वर्णमाला और ध्वनि", "Vowels, consonants, letter sounds and word families"),
                (2, "Nouns and Pronouns", "संज्ञा और सर्वनाम", "Naming words and replacement pronouns"),
                (3, "Verbs and Action Words", "क्रिया (Action Words)", "Present and past actions, sentence structure"),
                (4, "Reading Comprehension", "कहानी पठन", "Short stories, moral tales and comprehension questions"),
            ],
            "chunk_topic": "English Grammar & Phonics",
            "chunk_content": "Nouns are naming words. Verbs express action or state of being in sentences.",
            "chunk_content_hi": "संज्ञा किसी व्यक्ति, वस्तु या स्थान का नाम है। क्रिया कार्य को दर्शाती है।"
        },
        {
            "code": "hindi",
            "name": "Hindi",
            "name_hi": "हिंदी (Hindi)",
            "icon": "📝",
            "description": "वर्णमाला, मात्रा ज्ञान, कहानियाँ, कविताएँ एवं बुनियादी व्याकरण",
            "chapters": [
                (1, "वर्णमाला और मात्राएँ", "वर्णमाला और मात्राएँ", "स्वर, व्यंजन, संयुक्त अक्षर और मात्रा अभ्यास"),
                (2, "संज्ञा और सर्वनाम", "संज्ञा और सर्वनाम", "नाम वाले शब्द और उनके स्थान पर प्रयुक्त शब्द"),
                (3, "कविता और कहानियाँ", "कविता और कहानियाँ", "बाल कविताएँ, प्रेरक कहानियाँ और बोध प्रश्न"),
            ],
            "chunk_topic": "हिंदी व्याकरण व पठन",
            "chunk_content": "हिंदी भाषा देवनागरी लिपि में लिखी जाती है। स्वर और व्यंजन मिलकर शब्द बनते हैं।",
            "chunk_content_hi": "हिंदी भाषा देवनागरी लिपि में लिखी जाती है। स्वर और व्यंजन मिलकर शब्द बनते हैं।"
        }
    ],

    # Middle (Classes 6-8)
    "middle": [
        {
            "code": "mathematics",
            "name": "Mathematics",
            "name_hi": "गणित (Mathematics)",
            "icon": "📐",
            "description": "Integers, Fractions, Decimals, Algebraic Expressions, Geometry & Mensuration",
            "chapters": [
                (1, "Integers & Rational Numbers", "पूर्णांक एवं परिमेय संख्याएँ", "Positive and negative integers, operations on number line"),
                (2, "Fractions and Decimals", "भिन्न एवं दशमलव", "Multiplication and division of fractions and decimals"),
                (3, "Simple Equations", "सरल समीकरण", "Linear equations in one variable and solving methods"),
                (4, "Lines and Angles", "रेखाएँ एवं कोण", "Complementary, supplementary angles and parallel lines"),
                (5, "Perimeter and Area", "परिमाप एवं क्षेत्रफल", "Triangles, quadrilaterals, circles and mensuration"),
            ],
            "chunk_topic": "Middle School Mathematics",
            "chunk_content": "Rational numbers can be written as p/q where q is not 0. Integers include negatives and positives.",
            "chunk_content_hi": "परिमेय संख्याएँ p/q के रूप में लिखी जाती हैं। पूर्णांकों में धनात्मक और ऋणात्मक संख्याएँ शामिल हैं।"
        },
        {
            "code": "science",
            "name": "Science",
            "name_hi": "विज्ञान (Science)",
            "icon": "🔬",
            "description": "Food & Nutrition, Materials, Heat, Motion & Time, Electric Current, Light",
            "chapters": [
                (1, "Nutrition in Plants and Animals", "पादपों एवं जंतुओं में पोषण", "Autotrophic and heterotrophic nutrition, digestion"),
                (2, "Heat and Temperature", "ऊष्मा एवं ताप", "Conduction, convection, radiation and thermometers"),
                (3, "Acids, Bases and Salts", "अम्ल, क्षारक और लवण", "Indicators, neutralization and pH basics"),
                (4, "Motion and Time", "गति एवं समय", "Speed = Distance / Time, uniform and non-uniform motion"),
                (5, "Light and Reflection", "प्रकाश एवं परावर्तन", "Plane mirrors, spherical mirrors and lenses"),
            ],
            "chunk_topic": "Middle School Science",
            "chunk_content": "Heat transfers via conduction, convection and radiation. Speed is distance divided by time.",
            "chunk_content_hi": "ऊष्मा का स्थानांतरण चालन, संवहन और विकिरण द्वारा होता है। चाल = दूरी / समय।"
        },
        {
            "code": "social_science",
            "name": "Social Science",
            "name_hi": "सामाजिक विज्ञान (Social Science)",
            "icon": "🌍",
            "description": "History (Our Pasts), Geography (The Earth), Civics (Social & Political Life)",
            "chapters": [
                (1, "Our Pasts: Early Civilizations", "हमारे अतीत: आरंभिक सभ्यताएँ", "Harappan cities, Vedic period and early empires"),
                (2, "The Earth in Solar System", "सौरमंडल में पृथ्वी", "Latitudes, longitudes, rotation and revolution"),
                (3, "Our Environment & Resources", "हमारा पर्यावरण और संसाधन", "Lithosphere, hydrosphere, atmosphere and biosphere"),
                (4, "Social and Political Life: Democracy", "सामाजिक व राजनीतिक जीवन", "Equality, constitution, government and rights"),
            ],
            "chunk_topic": "Social Studies Overview",
            "chunk_content": "Democracy is government of the people, by the people, for the people.",
            "chunk_content_hi": "लोकतंत्र जनता का, जनता के द्वारा और जनता के लिए शासन है।"
        },
        {
            "code": "english",
            "name": "English",
            "name_hi": "अंग्रेजी (English)",
            "icon": "📖",
            "description": "Honeysuckle, Honeycomb, It So Happened, Grammar & Composition",
            "chapters": [
                (1, "Reading & Prose", "गद्य एवं पठन", "Narrative stories and reading comprehension"),
                (2, "Poetry & Rhyme", "कविता पठन", "Poetic devices, metaphors and appreciation"),
                (3, "Tenses and Modals", "काल और सहायक क्रियाएँ", "Present, past, future tenses and active-passive voice"),
                (4, "Writing Skills: Letters & Essays", "लेखन कला", "Formal and informal letters, paragraphs and notices"),
            ],
            "chunk_topic": "English Grammar and Prose",
            "chunk_content": "Tenses indicate time of action: past, present, and future.",
            "chunk_content_hi": "काल क्रिया के होने के समय (भूतकाल, वर्तमान काल, भविष्य काल) को दर्शाता है।"
        },
        {
            "code": "hindi",
            "name": "Hindi",
            "name_hi": "हिंदी (Hindi)",
            "icon": "📝",
            "description": "वसंत, दूर्वा, बाल रामकथा, व्याकरण एवं रचनात्मक लेखन",
            "chapters": [
                (1, "वसंत: गद्य एवं पद्य", "वसंत पाठ्यपुस्तक", "प्रसिद्ध कवियों की कविताएँ व निबंध"),
                (2, "व्याकरण: संधि एवं समास", "व्याकरण", "वर्ण-विचार, संधि, समास, कारक एवं विराम चिह्न"),
                (3, "रचनात्मक लेखन", "निबंध व पत्र लेखन", "औपचारिक पत्र, संवाद लेखन व निबंध"),
            ],
            "chunk_topic": "हिंदी साहित्य व व्याकरण",
            "chunk_content": "संधि दो वर्णों के मेल से होने वाला विकार है। समास पदों का संक्षिप्तीकरण है।",
            "chunk_content_hi": "संधि दो वर्णों के मेल से होने वाला विकार है। समास पदों का संक्षिप्तीकरण है।"
        },
        {
            "code": "sanskrit",
            "name": "Sanskrit",
            "name_hi": "संस्कृत (Sanskrit)",
            "icon": "📜",
            "description": "रुचिरा, शब्द रूपाणि, धातु रूपाणि एवं सरल संस्कृत संवाद",
            "chapters": [
                (1, "रुचिरा: प्रथमः पाठः", "रुचिरा पाठ", "संस्कृत श्लोकाः, सुभाषितानि च"),
                (2, "शब्द रूपाणि एवं धातु रूपाणि", "व्याकरणम्", "राम, बालक, लता शब्द रूपाणि; पठ्, गम् धातवः"),
            ],
            "chunk_topic": "संस्कृत व्याकरणम्",
            "chunk_content": "संस्कृतं भारतस्य प्राचीना भाषा अस्ति। सुभाषितानि जीवने मार्गदर्शनं कुर्वन्ति।",
            "chunk_content_hi": "संस्कृत भारत की प्राचीन भाषा है। सुभाषित जीवन में मार्गदर्शन करते हैं।"
        }
    ],

    # Secondary (Classes 9-10)
    "secondary": [
        {
            "code": "social_science",
            "name": "Social Science",
            "name_hi": "सामाजिक विज्ञान (Social Science)",
            "icon": "🌍",
            "description": "India and Contemporary World (History), Geography, Democratic Politics & Economics",
            "chapters": [
                (1, "Rise of Nationalism in Europe & India", "यूरोप व भारत में राष्ट्रवाद का उदय", "French revolution, Satyagraha and Non-Cooperation movement"),
                (2, "Resources and Development", "संसाधन एवं विकास", "Soil types, water resources, agriculture and minerals"),
                (3, "Democratic Politics & Power Sharing", "लोकतांत्रिक राजनीति व सत्ता की साझेदारी", "Federalism, gender, religion, caste and political parties"),
                (4, "Understanding Economic Development", "आर्थिक विकास की समझ", "Sectors of Indian economy, money and credit, globalization"),
            ],
            "chunk_topic": "Class 10 Social Science",
            "chunk_content": "Power sharing is the very spirit of democracy. Federalism divides power between union and states.",
            "chunk_content_hi": "सत्ता की साझेदारी लोकतंत्र की आत्मा है। संघवाद केंद्र और राज्यों के बीच शक्तियों का विभाजन करता है।"
        },
        {
            "code": "english",
            "name": "English Language & Literature",
            "name_hi": "अंग्रेजी (English)",
            "icon": "📖",
            "description": "First Flight, Footprints Without Feet, Reading, Grammar & Analytical Paragraph",
            "chapters": [
                (1, "A Letter to God & Nelson Mandela", "ए लेटर टू गॉड व नेल्सन मंडेला", "Faith, human resilience and freedom struggles"),
                (2, "Poetry: Fire and Ice, Dust of Snow", "कविताएँ", "Robert Frost, symbolism and thematic analysis"),
                (3, "Grammar: Reported Speech & Modals", "व्याकरण", "Direct/indirect speech, subject-verb concord and editing"),
                (4, "Writing Skills: Analytical Paragraph", "विश्लेषणात्मक अनुच्छेद", "Data interpretation, formal letters and debate"),
            ],
            "chunk_topic": "Class 10 English",
            "chunk_content": "Direct speech quotes exact words; reported speech shifts tenses backwards.",
            "chunk_content_hi": "प्रत्यक्ष कथन में वक्ता के शब्द ज्यों के त्यों कहे जाते हैं, जबकि अप्रत्यक्ष कथन में काल परिवर्तित होता है।"
        },
        {
            "code": "hindi",
            "name": "Hindi Course-A / Course-B",
            "name_hi": "हिंदी (Hindi)",
            "icon": "📝",
            "description": "क्षितिज / स्पर्श, कृतिका / संचयन, पद परिचय, रस, अलंकार एवं विज्ञापन लेखन",
            "chapters": [
                (1, "क्षितिज: सूरदास के पद व नेताजी का चश्मा", "सूरदास के पद व नेताजी का चश्मा", "भक्ति काल काव्य एवं देशप्रेम की भावना"),
                (2, "व्याकरण: पद परिचय एवं वाच्य", "व्याकरण", "कर्तृवाच्य, कर्मवाच्य, भाववाच्य, पद-परिचय"),
                (3, "अलंकार और रस", "काव्य सौंदर्य", "अनुप्रास, यमक, श्लेष, उपमा, रूपक; नवरस"),
            ],
            "chunk_topic": "Class 10 Hindi",
            "chunk_content": "अलंकार काव्य का आभूषण है। रस काव्य की आत्मा है।",
            "chunk_content_hi": "अलंकार काव्य का आभूषण है। रस काव्य की आत्मा है।"
        }
    ],

    # Senior Secondary: Science Stream (Classes 11-12)
    "senior_science": [
        {
            "code": "physics",
            "name": "Physics",
            "name_hi": "भौतिक विज्ञान (Physics)",
            "icon": "⚡",
            "description": "Electrostatics, Current Electricity, Magnetism, Optics, Thermodynamics, Modern Physics",
            "chapters": [
                (1, "Electric Charges and Fields", "विद्युत आवेश तथा क्षेत्र", "Coulomb's Law, Gauss's Theorem and electric dipole"),
                (2, "Electrostatic Potential and Capacitance", "स्थिरवैद्युत विभव तथा धारिता", "Capacitors in series/parallel, energy stored in capacitor"),
                (3, "Current Electricity", "विद्युत धारा", "Ohm's Law, Kirchhoff's Laws and Wheatstone Bridge"),
                (4, "Ray Optics and Optical Instruments", "किरण प्रकाशिकी", "Lens maker formula, prism, telescopes and microscopes"),
                (5, "Wave Optics", "तरंग प्रकाशिकी", "Huygens principle, Young's double slit interference, diffraction"),
                (6, "Dual Nature of Radiation & Matter", "विकिरण तथा द्रव्य की द्वैत प्रकृति", "Photoelectric effect, Einstein's equation, de Broglie wavelength"),
            ],
            "chunk_topic": "Physics: Coulomb Law & Electrostatics",
            "chunk_content": "Coulomb's Law: F = (1 / 4πε₀) * (q₁q₂ / r²). Electric field E = F / q.",
            "chunk_content_hi": "कूलॉम का नियम: दो स्थिर आवेशों के बीच आकर्षण/प्रतिकर्षण बल उनके गुणनफल के समानुपाती होता है।"
        },
        {
            "code": "chemistry",
            "name": "Chemistry",
            "name_hi": "रसायन विज्ञान (Chemistry)",
            "icon": "🧪",
            "description": "Solutions, Electrochemistry, Chemical Kinetics, Organic Chemistry & Coordination Compounds",
            "chapters": [
                (1, "Solutions", "विलयन", "Henry's Law, Raoult's Law, Colligative properties and van 't Hoff factor"),
                (2, "Electrochemistry", "वैद्युतरसायन", "Nernst equation, conductance, Kohlrausch's law, fuel cells"),
                (3, "Chemical Kinetics", "रासायनिक बलगतिकी", "Rate of reaction, integrated rate equations, Arrhenius activation energy"),
                (4, "Coordination Compounds", "उपसहसंयोजन यौगिक", "Werner's theory, IUPAC naming, Crystal Field Theory"),
                (5, "Haloalkanes and Haloarenes", "हैलोऐल्केन तथा हैलोऐरीन", "SN1 and SN2 mechanisms, Grignard reagents"),
                (6, "Aldehydes, Ketones and Carboxylic Acids", "ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल", "Nucleophilic addition, Aldol condensation, Cannizzaro reaction"),
            ],
            "chunk_topic": "Chemistry: Solutions & Nernst Equation",
            "chunk_content": "Raoult's Law: Relative lowering of vapor pressure equals mole fraction of solute. Nernst equation calculates cell EMF.",
            "chunk_content_hi": "राउल्ट का नियम: वाष्पदाब का आपेक्षिक अवनमन विलेय के मोल-अंश के बराबर होता है।"
        },
        {
            "code": "mathematics",
            "name": "Mathematics",
            "name_hi": "गणित (Senior Mathematics)",
            "icon": "📐",
            "description": "Calculus (Derivatives, Integrals), Vectors, 3D Geometry, Linear Programming & Probability",
            "chapters": [
                (1, "Relations and Functions", "संबंध एवं फलन", "One-one, onto functions and inverse trigonometric functions"),
                (2, "Matrices and Determinants", "आव्यूह एवं सारणिक", "Matrix operations, inverse matrix, solving linear system AX = B"),
                (3, "Continuity and Differentiability", "सांतत्य तथा अवकलनीयता", "Chain rule, parametric derivatives, mean value theorem"),
                (4, "Integrals (Definite & Indefinite)", "समाकलन", "Integration by parts, partial fractions, properties of definite integrals"),
                (5, "Vectors and 3D Geometry", "सदिश एवं त्रिविमीय ज्यामिति", "Dot product, cross product, lines and planes in 3D"),
                (6, "Probability", "प्रायिकता", "Conditional probability, Bayes' Theorem and random variables"),
            ],
            "chunk_topic": "Senior Mathematics: Calculus & Bayes Theorem",
            "chunk_content": "Fundamental Theorem of Calculus: d/dx ∫ f(t) dt = f(x). Bayes' theorem calculates posterior probability.",
            "chunk_content_hi": "कलन का मूलभूत प्रमेय: अवकलन और समाकलन परस्पर प्रतिलोम प्रक्रम हैं। बेज़ प्रमेय सप्रतिबंध प्रायिकता ज्ञात करता है।"
        },
        {
            "code": "biology",
            "name": "Biology",
            "name_hi": "जीव विज्ञान (Biology)",
            "icon": "🧬",
            "description": "Reproduction, Genetics & Evolution, Biotechnology, Human Health & Ecology",
            "chapters": [
                (1, "Sexual Reproduction in Flowering Plants", "पुष्पी पादपों में लैंगिक जनन", "Microsporogenesis, megasporogenesis, double fertilisation"),
                (2, "Human Reproduction", "मानव जनन", "Spermatogenesis, oogenesis, menstrual cycle, embryonic development"),
                (3, "Principles of Inheritance and Variation", "वंशागति तथा विविधता के सिद्धांत", "Mendelian genetics, linkage, sex determination, genetic disorders"),
                (4, "Molecular Basis of Inheritance", "वंशागति के आणविक आधार", "DNA double helix, replication, transcription, translation and lac operon"),
                (5, "Biotechnology: Principles and Processes", "जैव प्रौद्योगिकी - सिद्धांत व प्रक्रम", "Recombinant DNA technology, restriction enzymes, PCR, cloning vectors"),
                (6, "Organisms and Populations", "जीव और समष्टियाँ", "Adaptations, population growth models, mutualism and competition"),
            ],
            "chunk_topic": "Biology: Molecular Genetics & Double Helix",
            "chunk_content": "DNA structure: Watson and Crick double helix with antiparallel strands (A=T, G≡C). Central Dogma: DNA -> RNA -> Protein.",
            "chunk_content_hi": "डीएनए द्विकुंडलिनी संरचना: वाटसन और क्रिक मॉडल। आनुवंशिक कूट सार्वभौमिक होता है।"
        },
        {
            "code": "computer_science",
            "name": "Computer Science",
            "name_hi": "कंप्यूटर विज्ञान (Computer Science)",
            "icon": "💻",
            "description": "Python Programming, Data Structures, Relational Database (SQL) & Networking",
            "chapters": [
                (1, "Python Functions & Data File Handling", "पायथन प्रोग्रामिंग", "Functions, text/binary/CSV files, exception handling"),
                (2, "Data Structures: Stacks", "डेटा संरचना: स्टैक", "LIFO, Push and Pop operations using Python lists"),
                (3, "Computer Networks", "कंप्यूटर नेटवर्क", "Topologies, transmission media, protocol stack (TCP/IP), network security"),
                (4, "Database Management & SQL", "डेटाबेस व SQL", "Relational algebra, SELECT, WHERE, GROUP BY, JOIN and keys"),
            ],
            "chunk_topic": "Computer Science: Python & SQL",
            "chunk_content": "Stack operates on LIFO (Last In First Out). SQL SELECT queries retrieve data from relational tables.",
            "chunk_content_hi": "स्टैक LIFO सिद्धांत पर कार्य करता है। SQL का उपयोग रिलेशनल डेटाबेस से डेटा प्राप्त करने के लिए किया जाता है।"
        },
        {
            "code": "english",
            "name": "English Core",
            "name_hi": "अंग्रेजी (English Core)",
            "icon": "📖",
            "description": "Flamingo (Prose & Poetry), Vistas (Supplementary), Note Making & Formal Composition",
            "chapters": [
                (1, "The Last Lesson & My Mother at Sixty-Six", "द लास्ट लेसन", "Linguistic chauvinism, human relationships and aging"),
                (2, "The Tiger King & The Enemy", "द टाइगर किंग व द एनिमी", "Satire on power, moral duty vs patriotism"),
                (3, "Advanced Writing Skills: Reports & Articles", "रचनात्मक लेखन", "Notices, formal invitations, report writing, job applications"),
            ],
            "chunk_topic": "Senior English Core",
            "chunk_content": "The Last Lesson emphasizes the importance of preserving one's mother tongue and cultural heritage.",
            "chunk_content_hi": "द लास्ट लेसन अपनी मातृभाषा और सांस्कृतिक विरासत को सहेजने के महत्व को रेखांकित करता है।"
        }
    ],

    # Senior Secondary: Commerce Stream (Classes 11-12)
    "senior_commerce": [
        {
            "code": "accountancy",
            "name": "Accountancy",
            "name_hi": "लेखाशास्त्र (Accountancy)",
            "icon": "📊",
            "description": "Partnership Accounting, Company Accounts, Financial Statements & Cash Flow Analysis",
            "chapters": [
                (1, "Accounting for Partnership: Fundamentals", "साझेदारी लेखांकन के मूल तत्व", "Partnership deed, Profit and Loss Appropriation, capital accounts"),
                (2, "Admission and Retirement of a Partner", "साझेदार का प्रवेश व अवकाश ग्रहण", "Sacrificing ratio, goodwill valuation and revaluation of assets"),
                (3, "Accounting for Share Capital", "अंश पूँजी का लेखांकन", "Issue of shares at par/premium, forfeiture and reissue of shares"),
                (4, "Cash Flow Statement", "रोकड़ प्रवाह विवरण", "Operating, investing and financing cash flow activities (AS-3)"),
                (5, "Financial Statement Analysis", "वित्तीय विवरणों का विश्लेषण", "Ratio analysis: liquidity, solvency, activity and profitability ratios"),
            ],
            "chunk_topic": "Accountancy: Partnership & Cash Flow",
            "chunk_content": "Partnership Profit & Loss Appropriation distributes net profit after interest on capital and salary. Cash Flow Statement follows AS-3.",
            "chunk_content_hi": "लाभ-हानि नियोजन खाता साझेदारों के बीच शुद्ध लाभ का बँटवारा करता है। रोकड़ प्रवाह विवरण रोकड़ के अंतर्वाह और बहिर्वाह को दर्शाता है।"
        },
        {
            "code": "business_studies",
            "name": "Business Studies",
            "name_hi": "व्यवसाय अध्ययन (Business Studies)",
            "icon": "💼",
            "description": "Principles of Management, Financial Management, Marketing & Consumer Protection",
            "chapters": [
                (1, "Nature and Significance of Management", "प्रबंध की प्रकृति एवं महत्व", "Management as art, science and profession; levels of management"),
                (2, "Principles of Management (Fayol & Taylor)", "प्रबंध के सिद्धांत", "Henri Fayol's 14 principles and F.W. Taylor's scientific management"),
                (3, "Planning and Organizing", "नियोजन एवं संगठन", "Planning process, organizational structure, delegation and decentralization"),
                (4, "Financial Management & Capital Structure", "वित्तीय प्रबंध", "Investment, financing and dividend decisions; working capital"),
                (5, "Marketing Management (4 Ps)", "विपणन प्रबंध", "Product, Price, Place and Promotion mix; consumer protection act 2019"),
            ],
            "chunk_topic": "Business Studies: Management Principles",
            "chunk_content": "Fayol's 14 Principles include Division of Work, Unity of Command, and Esprit de Corps. Marketing 4Ps: Product, Price, Place, Promotion.",
            "chunk_content_hi": "हेनरी फेयोल के 14 सिद्धांतों में कार्य का विभाजन और आदेश की एकता प्रमुख हैं। विपणन के 4P: उत्पाद, मूल्य, स्थान, प्रवर्तन।"
        },
        {
            "code": "economics",
            "name": "Economics",
            "name_hi": "अर्थशास्त्र (Economics)",
            "icon": "📈",
            "description": "Microeconomics, Macroeconomics (National Income, Banking) & Indian Economic Development",
            "chapters": [
                (1, "National Income and Related Aggregates", "राष्ट्रीय आय एवं संबंधित समुच्चय", "GDP, GNP, NNP at factor cost; value added, income and expenditure methods"),
                (2, "Money and Banking", "मुद्रा एवं बैंकिंग", "Money supply (M1-M4), commercial banking credit creation, RBI monetary policy (Repo rate, CRR)"),
                (3, "Determination of Income and Employment", "आय एवं रोजगार का निर्धारण", "Aggregate demand and supply, investment multiplier, Keynesian theory"),
                (4, "Government Budget and the Economy", "सरकारी बजट और अर्थव्यवस्था", "Revenue and capital receipts, fiscal deficit, revenue deficit"),
                (5, "Indian Economic Development: Reforms 1991", "भारतीय आर्थिक विकास (1991 के सुधार)", "LPG reforms: Liberalisation, Privatisation and Globalisation; NITI Aayog"),
            ],
            "chunk_topic": "Economics: National Income & Money Supply",
            "chunk_content": "GDP is the total market value of all final goods and services produced within a country in a year. RBI regulates liquidity using Repo rate and CRR.",
            "chunk_content_hi": "सकल घरेलू उत्पाद (GDP) एक वर्ष में उत्पादित सभी अंतिम वस्तुओं और सेवाओं का कुल मौद्रिक मूल्य है। आरबीआई मौद्रिक नीति द्वारा ऋण नियंत्रण करता है।"
        },
        {
            "code": "mathematics",
            "name": "Applied Mathematics",
            "name_hi": "व्यावहारिक गणित (Applied Mathematics)",
            "icon": "📐",
            "description": "Financial Mathematics, Linear Programming, Probability & Inferential Statistics",
            "chapters": [
                (1, "Numbers, Quantification and Numerical Applications", "संख्यात्मक अनुप्रयोग", "Modulo arithmetic, logarithms, time-speed-distance applications"),
                (2, "Calculus for Business", "व्यावसायिक कलन", "Marginal cost, marginal revenue, optimization and profit maximization"),
                (3, "Financial Mathematics", "वित्तीय गणित", "Perpetuity, sinking funds, valuation of bonds, EMI calculation"),
                (4, "Linear Programming", "रैखिक प्रोग्रामन", "Optimization of objective function subject to linear constraints"),
            ],
            "chunk_topic": "Applied Mathematics for Commerce",
            "chunk_content": "EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1). Marginal revenue is derivative of total revenue with respect to output.",
            "chunk_content_hi": "सीमांत आय कुल आय का उत्पादन के सापेक्ष अवकलज है। ईएमआई की गणना वित्तीय गणित का मुख्य अनुप्रयोग है।"
        },
        {
            "code": "english",
            "name": "English Core",
            "name_hi": "अंग्रेजी (English Core)",
            "icon": "📖",
            "description": "Literature, Business Correspondence, Report Writing & Comprehension",
            "chapters": [
                (1, "Flamingo & Vistas Literature", "साहित्य पठन", "Core prose, poetry and character analysis"),
                (2, "Business Correspondence", "व्यावसायिक पत्र व्यवहार", "Enquiries, quotation letters, complaints and order placement"),
                (3, "Advanced Writing & Report Formulation", "प्रतिवेदन एवं विश्लेषण", "Financial report formulation, notices and invitations"),
            ],
            "chunk_topic": "Commerce English Core",
            "chunk_content": "Business letters require clear objective, formal tone, accurate specifications, and courteous closing.",
            "chunk_content_hi": "व्यावसायिक पत्राचार में औपचारिक भाषा, स्पष्टता और यथार्थता आवश्यक है।"
        }
    ],

    # Senior Secondary: Humanities / Arts Stream (Classes 11-12)
    "senior_arts": [
        {
            "code": "history",
            "name": "History",
            "name_hi": "इतिहास (History)",
            "icon": "🏛️",
            "description": "Themes in Indian History: Harappan Archaeology, Medieval Society & Modern Freedom Struggle",
            "chapters": [
                (1, "Bricks, Beads and Bones (Harappan Civilization)", "ईंटें, मनके तथा अस्थियाँ (हड़प्पा सभ्यता)", "Urban planning, drainage system, seals, craft production and trade"),
                (2, "Kings, Farmers and Towns (Early States & Economies)", "राजा, किसान और नगर", "Mauryan Empire, Ashokan edicts, coinage and agricultural expansion"),
                (3, "Bhakti-Sufi Traditions", "भक्ति-सूफी परंपराएं", "Religious beliefs, saint-poets: Kabir, Guru Nanak, Mirabai and Sufi shrines"),
                (4, "An Imperial Capital: Vijayanagara", "एक साम्राज्य की राजधानी: विजयनगर", "Hampi architecture, royal center, water management and decline"),
                (5, "Mahatma Gandhi and the Nationalist Movement", "महात्मा गांधी और राष्ट्रीय आंदोलन", "Civil Disobedience, Dandi March, Quit India movement, partition"),
            ],
            "chunk_topic": "History: Harappa & Freedom Movement",
            "chunk_content": "Harappan civilization was characterized by grid-pattern town planning, Great Bath, and advanced drainage systems. Gandhi led non-violent Satyagraha.",
            "chunk_content_hi": "हड़प्पा सभ्यता अपनी उन्नत नगर नियोजन, जल निकासी प्रणाली और विशाल स्नानागार के लिए विख्यात थी।"
        },
        {
            "code": "political_science",
            "name": "Political Science",
            "name_hi": "राजनीति विज्ञान (Political Science)",
            "icon": "⚖️",
            "description": "Contemporary World Politics & Politics in India Since Independence",
            "chapters": [
                (1, "The End of Bipolarity", "दो ध्रुवीयता का अंत", "Soviet collapse, shock therapy and democratic transitions in post-communist states"),
                (2, "Alternative Centres of Power (EU, ASEAN, BRICS)", "सत्ता के वैकल्पिक केंद्र", "European Union, ASEAN, Rise of China, India, and emerging alliances"),
                (3, "International Organisations (UN)", "अंतर्राष्ट्रीय संगठन", "United Nations restructuring, Security Council reforms, IMF, World Bank"),
                (4, "Challenges of Nation Building", "राष्ट्र निर्माण की चुनौतियाँ", "Partition aftermath, integration of princely states (Sardar Patel), linguistic reorganisation"),
                (5, "Democratic Resurgence & Coalition Politics", "लोकतांत्रिक पुनरुत्थान व गठबंधन की राजनीति", "Emergency of 1975, rise of regional parties, coalition governments and NDA-UPA eras"),
            ],
            "chunk_topic": "Political Science: UN & Indian Nation Building",
            "chunk_content": "Sardar Vallabhbhai Patel integrated over 565 princely states into the Indian Union. UN Security Council consists of 5 permanent and 10 non-permanent members.",
            "chunk_content_hi": "सरदार वल्लभभाई पटेल ने 565 से अधिक देशी रियासतों का भारतीय संघ में ऐतिहासिक एकीकरण किया।"
        },
        {
            "code": "geography",
            "name": "Geography",
            "name_hi": "भूगोल (Geography)",
            "icon": "🗺️",
            "description": "Fundamentals of Human Geography & India: People and Economy",
            "chapters": [
                (1, "Human Geography: Nature and Scope", "मानव भूगोल: प्रकृति एवं विषय क्षेत्र", "Environmental determinism, possibilism and neo-determinism"),
                (2, "The World Population: Distribution and Growth", "विश्व जनसंख्या: वितरण, घनत्व और वृद्धि", "Demographic transition theory, migration factors and density patterns"),
                (3, "Primary, Secondary and Tertiary Activities", "मानव व्यवसाय", "Agriculture types, manufacturing industries, trade and services"),
                (4, "India: Water Resources and Agriculture", "भारत: जल संसाधन एवं कृषि", "Rainwater harvesting, irrigation projects, major crops and Green Revolution"),
            ],
            "chunk_topic": "Geography: Demographic Transition & Human Geography",
            "chunk_content": "Demographic Transition Theory explains shift from high birth/death rates to low birth/death rates as societies develop economically.",
            "chunk_content_hi": "जनांकिकीय संक्रमण सिद्धांत आर्थिक विकास के साथ उच्च जन्म/मृत्यु दर से निम्न जन्म/मृत्यु दर में परिवर्तन को समझाता है।"
        },
        {
            "code": "sociology",
            "name": "Sociology",
            "name_hi": "समाजशास्त्र (Sociology)",
            "icon": "👥",
            "description": "Indian Society, Social Institutions (Caste, Tribe, Family) & Social Change",
            "chapters": [
                (1, "The Demographic Structure of Indian Society", "भारतीय समाज की जनसांख्यिकीय संरचना", "Age structure, demographic dividend, rural-urban population trends"),
                (2, "Social Institutions: Continuity and Change", "सामाजिक संस्थाएं: निरंतरता एवं परिवर्तन", "Caste system, varna vs jati, tribes and joint family transformations"),
                (3, "Patterns of Social Inequality and Exclusion", "सामाजिक विषमता और बहिष्कार", "Untouchability, tribal displacement, gender inequality and constitutional remedies"),
                (4, "Cultural Change and Social Movements", "सांस्कृतिक परिवर्तन व सामाजिक आंदोलन", "Sanskritisation, modernization, secularisation and civil rights movements"),
            ],
            "chunk_topic": "Sociology: Caste, Family & Demographic Dividend",
            "chunk_content": "Demographic dividend occurs when the proportion of working-age population is higher than dependent population, spurring economic growth.",
            "chunk_content_hi": "जनांकिकीय लाभांश तब प्राप्त होता है जब कार्यशील आयु वर्ग की जनसंख्या आश्रित जनसंख्या से अधिक होती है।"
        },
        {
            "code": "economics",
            "name": "Economics",
            "name_hi": "अर्थशास्त्र (Economics)",
            "icon": "📈",
            "description": "Statistics for Economics & Indian Economic Development",
            "chapters": [
                (1, "Development Policies and Experience (1947-1990)", "विकास नीतियां एवं अनुभव", "Five Year Plans, agricultural goals, Industrial Policy Resolution 1956"),
                (2, "Economic Reforms Since 1991", "1991 के आर्थिक सुधार", "Liberalisation, Privatisation, Globalisation and structural adjustment"),
                (3, "Current Challenges: Poverty & Human Capital", "वर्तमान चुनौतियाँ", "Poverty alleviation programs, education, healthcare and rural development"),
            ],
            "chunk_topic": "Humanities Economics: Indian Development",
            "chunk_content": "Five Year Plans targeted self-reliance, growth, modernization, and equity in post-independence India.",
            "chunk_content_hi": "पंचवर्षीय योजनाओं का मुख्य उद्देश्य आत्मनिर्भरता, संवृद्धि, आधुनिकीकरण और सामाजिक न्याय था।"
        },
        {
            "code": "english",
            "name": "English Core",
            "name_hi": "अंग्रेजी (English Core)",
            "icon": "📖",
            "description": "Literature Analysis, Advanced Creative Writing & Critical Thinking",
            "chapters": [
                (1, "Flamingo & Vistas Themes", "साहित्यिक विश्लेषण", "Thematic exploration of historical, social and moral themes in literature"),
                (2, "Critical Appreciation & Rhetoric", "काव्य सौंदर्य व आलोचना", "Poetic structures, irony, symbolism and literary analysis"),
                (3, "Debate, Speech and Article Writing", "भाषण एवं वाद-विवाद लेखन", "Persuasive writing, argumentation, rhetorical strategies and articles"),
            ],
            "chunk_topic": "Humanities English: Rhetoric & Debate",
            "chunk_content": "Persuasive debate requires sound premise, empirical evidence, empathetic counter-argument, and compelling rhetorical conclusion.",
            "chunk_content_hi": "प्रभावी वाद-विवाद में ठोस तर्क, साक्ष्य और प्रभावशाली निष्कर्ष आवश्यक हैं।"
        }
    ]
}


def populate_all_curriculum():
    conn = sqlite3.connect(MASTER_DB_PATH)
    cur = conn.cursor()

    print("[*] Populating comprehensive curriculum for all classes (1-12) and streams...")

    boards = [
        ("cbse", "CBSE"),
        ("icse", "ICSE"),
        ("state", "STATE")
    ]

    inserted_subjects = 0
    inserted_chapters = 0
    inserted_modules = 0
    inserted_chunks = 0

    # Ensure all classes 1-12 exist
    for cl in range(1, 13):
        cur.execute(
            "INSERT OR REPLACE INTO classes (id, class_level, display_name) VALUES (?, ?, ?)",
            (cl, cl, f"Class {cl}")
        )

    # Ensure streams exist
    streams = [
        ("science", "SCIENCE", "Science Stream", "Physics, Chemistry, Mathematics, Biology, Computer Science"),
        ("commerce", "COMMERCE", "Commerce Stream", "Accountancy, Business Studies, Economics, Applied Math"),
        ("arts", "ARTS", "Humanities / Arts Stream", "History, Political Science, Geography, Sociology, Economics")
    ]
    for sid, scode, sname, sdesc in streams:
        cur.execute(
            "INSERT OR REPLACE INTO streams (id, code, name, description) VALUES (?, ?, ?, ?)",
            (sid, scode, sname, sdesc)
        )

    for board_id, board_code in boards:
        state_id = "bihar" if board_id == "state" else None

        # 1. Primary Classes (1 to 5)
        for cl in range(1, 6):
            for subj in CURRICULUM_MATRIX["primary"]:
                subject_id = f"{board_id}-{cl}-{subj['code']}"
                cur.execute(
                    """INSERT OR REPLACE INTO subjects 
                       (id, board_id, state_id, class_level, stream_id, code, name, name_hi, icon, description, language, is_available)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)""",
                    (subject_id, board_id, state_id, cl, None, subj["code"],
                     f"{subj['name']} (Class {cl})", subj["name_hi"], subj["icon"],
                     f"{subj['description']} for Class {cl}", "bilingual")
                )
                inserted_subjects += 1

                # Module
                module_id = f"{board_id}_c{cl}_{subj['code']}"
                cur.execute(
                    """INSERT OR REPLACE INTO modules
                       (id, subject_id, chapter_id, code, name, size_mb, version, author, is_installed, is_available)
                       VALUES (?, ?, NULL, ?, ?, ?, '1.0', 'NCERT / National Board', ?, 1)""",
                    (module_id, subject_id, module_id, f"Class {cl} {subj['name']}",
                     30, 1 if cl == 5 and subj["code"] == "mathematics" else 0)
                )
                inserted_modules += 1

                # Chapters
                for ch_num, ch_title, ch_title_hi, ch_desc in subj["chapters"]:
                    chapter_id = f"{board_id}-{cl}-{subj['code']}-ch{ch_num:02d}"
                    cur.execute(
                        """INSERT OR REPLACE INTO chapters
                           (id, subject_id, chapter_number, title, title_hi, description, is_available)
                           VALUES (?, ?, ?, ?, ?, ?, 1)""",
                        (chapter_id, subject_id, ch_num, ch_title, ch_title_hi, ch_desc)
                    )
                    inserted_chapters += 1

                # Chunk
                chunk_id = f"{board_id}_{cl}_{subj['code']}_ch01_01"
                cur.execute(
                    """INSERT OR REPLACE INTO content_chunks
                       (chunk_id, module_id, chapter_id, subject_id, board_id, state_id, class_level, stream_id, language, topic, content, content_hi, source_page)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'bilingual', ?, ?, ?, ?)""",
                    (chunk_id, module_id, f"{board_id}-{cl}-{subj['code']}-ch01", subject_id,
                     board_id, state_id, cl, None, subj["chunk_topic"],
                     subj["chunk_content"], subj["chunk_content_hi"], f"NCERT Class {cl} {subj['name']}")
                )
                inserted_chunks += 1

        # 2. Middle Classes (6 to 8)
        for cl in range(6, 9):
            for subj in CURRICULUM_MATRIX["middle"]:
                subject_id = f"{board_id}-{cl}-{subj['code']}"
                cur.execute(
                    """INSERT OR REPLACE INTO subjects 
                       (id, board_id, state_id, class_level, stream_id, code, name, name_hi, icon, description, language, is_available)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)""",
                    (subject_id, board_id, state_id, cl, None, subj["code"],
                     f"{subj['name']} (Class {cl})", subj["name_hi"], subj["icon"],
                     f"{subj['description']} for Class {cl}", "bilingual")
                )
                inserted_subjects += 1

                module_id = f"{board_id}_c{cl}_{subj['code']}"
                cur.execute(
                    """INSERT OR REPLACE INTO modules
                       (id, subject_id, chapter_id, code, name, size_mb, version, author, is_installed, is_available)
                       VALUES (?, ?, NULL, ?, ?, ?, '1.0', 'NCERT / National Board', 0, 1)""",
                    (module_id, subject_id, module_id, f"Class {cl} {subj['name']}", 35)
                )
                inserted_modules += 1

                for ch_num, ch_title, ch_title_hi, ch_desc in subj["chapters"]:
                    chapter_id = f"{board_id}-{cl}-{subj['code']}-ch{ch_num:02d}"
                    cur.execute(
                        """INSERT OR REPLACE INTO chapters
                           (id, subject_id, chapter_number, title, title_hi, description, is_available)
                           VALUES (?, ?, ?, ?, ?, ?, 1)""",
                        (chapter_id, subject_id, ch_num, ch_title, ch_title_hi, ch_desc)
                    )
                    inserted_chapters += 1

                chunk_id = f"{board_id}_{cl}_{subj['code']}_ch01_01"
                cur.execute(
                    """INSERT OR REPLACE INTO content_chunks
                       (chunk_id, module_id, chapter_id, subject_id, board_id, state_id, class_level, stream_id, language, topic, content, content_hi, source_page)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'bilingual', ?, ?, ?, ?)""",
                    (chunk_id, module_id, f"{board_id}-{cl}-{subj['code']}-ch01", subject_id,
                     board_id, state_id, cl, None, subj["chunk_topic"],
                     subj["chunk_content"], subj["chunk_content_hi"], f"NCERT Class {cl} {subj['name']}")
                )
                inserted_chunks += 1

        # 3. Secondary Classes (9 to 10)
        for cl in range(9, 11):
            # For class 10 cbse/math & cbse/science, they are already present with full chapters
            for subj in CURRICULUM_MATRIX["secondary"]:
                subject_id = f"{board_id}-{cl}-{subj['code']}"
                cur.execute(
                    """INSERT OR REPLACE INTO subjects 
                       (id, board_id, state_id, class_level, stream_id, code, name, name_hi, icon, description, language, is_available)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)""",
                    (subject_id, board_id, state_id, cl, None, subj["code"],
                     f"{subj['name']} (Class {cl})", subj["name_hi"], subj["icon"],
                     f"{subj['description']} for Class {cl}", "bilingual")
                )
                inserted_subjects += 1

                module_id = f"{board_id}_c{cl}_{subj['code']}"
                cur.execute(
                    """INSERT OR REPLACE INTO modules
                       (id, subject_id, chapter_id, code, name, size_mb, version, author, is_installed, is_available)
                       VALUES (?, ?, NULL, ?, ?, ?, '1.0', 'NCERT / National Board', 0, 1)""",
                    (module_id, subject_id, module_id, f"Class {cl} {subj['name']}", 38)
                )
                inserted_modules += 1

                for ch_num, ch_title, ch_title_hi, ch_desc in subj["chapters"]:
                    chapter_id = f"{board_id}-{cl}-{subj['code']}-ch{ch_num:02d}"
                    cur.execute(
                        """INSERT OR REPLACE INTO chapters
                           (id, subject_id, chapter_number, title, title_hi, description, is_available)
                           VALUES (?, ?, ?, ?, ?, ?, 1)""",
                        (chapter_id, subject_id, ch_num, ch_title, ch_title_hi, ch_desc)
                    )
                    inserted_chapters += 1

                chunk_id = f"{board_id}_{cl}_{subj['code']}_ch01_01"
                cur.execute(
                    """INSERT OR REPLACE INTO content_chunks
                       (chunk_id, module_id, chapter_id, subject_id, board_id, state_id, class_level, stream_id, language, topic, content, content_hi, source_page)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'bilingual', ?, ?, ?, ?)""",
                    (chunk_id, module_id, f"{board_id}-{cl}-{subj['code']}-ch01", subject_id,
                     board_id, state_id, cl, None, subj["chunk_topic"],
                     subj["chunk_content"], subj["chunk_content_hi"], f"NCERT Class {cl} {subj['name']}")
                )
                inserted_chunks += 1

        # 4. Senior Secondary Classes (11 & 12) - Stream-based
        for cl in (11, 12):
            stream_configs = [
                ("science", CURRICULUM_MATRIX["senior_science"]),
                ("commerce", CURRICULUM_MATRIX["senior_commerce"]),
                ("arts", CURRICULUM_MATRIX["senior_arts"])
            ]

            for stream_id, subj_list in stream_configs:
                for subj in subj_list:
                    subject_id = f"{board_id}-{cl}-{stream_id}-{subj['code']}"
                    cur.execute(
                        """INSERT OR REPLACE INTO subjects 
                           (id, board_id, state_id, class_level, stream_id, code, name, name_hi, icon, description, language, is_available)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)""",
                        (subject_id, board_id, state_id, cl, stream_id, subj["code"],
                         f"{subj['name']} (Class {cl})", subj["name_hi"], subj["icon"],
                         f"{subj['description']} - Class {cl} {stream_id.capitalize()}", "bilingual")
                    )
                    inserted_subjects += 1

                    module_id = f"{board_id}_c{cl}_{stream_id}_{subj['code']}"
                    cur.execute(
                        """INSERT OR REPLACE INTO modules
                           (id, subject_id, chapter_id, code, name, size_mb, version, author, is_installed, is_available)
                           VALUES (?, ?, NULL, ?, ?, ?, '1.0', 'NCERT / National Board', 0, 1)""",
                        (module_id, subject_id, module_id, f"Class {cl} {subj['name']}", 45)
                    )
                    inserted_modules += 1

                    for ch_num, ch_title, ch_title_hi, ch_desc in subj["chapters"]:
                        chapter_id = f"{board_id}-{cl}-{stream_id}-{subj['code']}-ch{ch_num:02d}"
                        cur.execute(
                            """INSERT OR REPLACE INTO chapters
                               (id, subject_id, chapter_number, title, title_hi, description, is_available)
                               VALUES (?, ?, ?, ?, ?, ?, 1)""",
                            (chapter_id, subject_id, ch_num, ch_title, ch_title_hi, ch_desc)
                        )
                        inserted_chapters += 1

                    chunk_id = f"{board_id}_{cl}_{stream_id}_{subj['code']}_ch01_01"
                    cur.execute(
                        """INSERT OR REPLACE INTO content_chunks
                           (chunk_id, module_id, chapter_id, subject_id, board_id, state_id, class_level, stream_id, language, topic, content, content_hi, source_page)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'bilingual', ?, ?, ?, ?)""",
                        (chunk_id, module_id, f"{board_id}-{cl}-{stream_id}-{subj['code']}-ch01", subject_id,
                         board_id, state_id, cl, stream_id, subj["chunk_topic"],
                         subj["chunk_content"], subj["chunk_content_hi"], f"NCERT Class {cl} {subj['name']}")
                    )
                    inserted_chunks += 1

    conn.commit()

    # Rebuild FTS5 Virtual Table
    try:
        cur.execute("INSERT INTO content_chunks_fts(content_chunks_fts) VALUES('rebuild')")
        conn.commit()
    except Exception as e:
        print(f"Note on FTS rebuild: {e}")

    # Fetch total counts
    total_subjects = cur.execute("SELECT COUNT(*) FROM subjects").fetchone()[0]
    total_chapters = cur.execute("SELECT COUNT(*) FROM chapters").fetchone()[0]
    total_modules = cur.execute("SELECT COUNT(*) FROM modules").fetchone()[0]
    total_chunks = cur.execute("SELECT COUNT(*) FROM content_chunks").fetchone()[0]
    total_fts = cur.execute("SELECT COUNT(*) FROM content_chunks_fts").fetchone()[0]

    print(f"[OK] Total Subjects in DB: {total_subjects}")
    print(f"[OK] Total Chapters in DB: {total_chapters}")
    print(f"[OK] Total Modules in DB:  {total_modules}")
    print(f"[OK] Total Chunks in DB:   {total_chunks}")
    print(f"[OK] Total FTS Records:    {total_fts}")

    # Export frontend snapshot JSON
    cur.row_factory = sqlite3.Row
    boards_data = [dict(r) for r in cur.execute("SELECT * FROM boards").fetchall()]
    states_data = [dict(r) for r in cur.execute("SELECT * FROM states").fetchall()]
    classes_data = [dict(r) for r in cur.execute("SELECT * FROM classes").fetchall()]
    streams_data = [dict(r) for r in cur.execute("SELECT * FROM streams").fetchall()]
    subjects_data = [dict(r) for r in cur.execute("SELECT * FROM subjects").fetchall()]
    chapters_data = [dict(r) for r in cur.execute("SELECT * FROM chapters").fetchall()]
    modules_data = [dict(r) for r in cur.execute("SELECT * FROM modules").fetchall()]
    chunks_data = [dict(r) for r in cur.execute("SELECT * FROM content_chunks").fetchall()]

    snapshot = {
        "metadata": {
            "version": "1.0.0",
            "database": "curriculum.db",
            "offline_only": True
        },
        "boards": boards_data,
        "states": states_data,
        "classes": classes_data,
        "streams": streams_data,
        "subjects": subjects_data,
        "chapters": chapters_data,
        "modules": modules_data,
        "content_chunks": chunks_data
    }

    with open(FRONTEND_EXPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)
    print(f"[OK] Exported frontend snapshot to: {FRONTEND_EXPORT_PATH}")

    conn.close()

    # Copy to target databases
    for target in TARGET_DBS:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(MASTER_DB_PATH, target)
        print(f"[OK] Deployed database to: {target}")

    print("\n[SUCCESS] All classes (1-12) and streams curriculum successfully populated!")


if __name__ == "__main__":
    populate_all_curriculum()
