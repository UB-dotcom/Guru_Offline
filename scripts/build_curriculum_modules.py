"""
Curriculum Module Builder for Guru Offline.
Populates standard curriculum data, chapters, examples, exercises, quizzes,
and builds an on-device inverted index / BM25 index for fast offline RAG retrieval.
"""

import json
import os
import re
import math
from collections import defaultdict, Counter

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt",
    "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt",
    "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here",
    "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im",
    "ive", "if", "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most",
    "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
    "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed",
    "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the",
    "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd",
    "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", "when",
    "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with",
    "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours",
    "yourself", "yourselves"
}

def tokenize(text):
    tokens = re.findall(r'[a-zA-Z0-9_\^\+\-\*\/\=\.]+', text.lower())
    return [t for t in tokens if len(t) > 1 and t not in STOPWORDS]

def build_bm25_index(chunks):
    """
    Builds BM25 index and inverted vocabulary for local RAG retrieval.
    """
    total_docs = len(chunks)
    doc_lengths = []
    inv_index = defaultdict(list)
    doc_term_freqs = []

    for doc_id, chunk in enumerate(chunks):
        text = f"{chunk.get('title', '')} {chunk.get('topic', '')} {chunk.get('content', '')}"
        tokens = tokenize(text)
        doc_lengths.append(len(tokens))
        tf = Counter(tokens)
        doc_term_freqs.append(tf)
        for term, count in tf.items():
            inv_index[term].append({"doc_id": doc_id, "tf": count})

    avg_dl = sum(doc_lengths) / max(1, total_docs)

    # Compute IDF
    idf = {}
    for term, postings in inv_index.items():
        n_q = len(postings)
        idf[term] = math.log((total_docs - n_q + 0.5) / (n_q + 0.5) + 1.0)

    index_data = {
        "total_docs": total_docs,
        "avg_dl": round(avg_dl, 4),
        "doc_lengths": doc_lengths,
        "idf": {k: round(v, 4) for k, v in idf.items()},
        "inverted_index": dict(inv_index)
    }
    return index_data

def setup_class10_math(base_dir):
    mod_id = "class10_math"
    m_dir = os.path.join(base_dir, mod_id)

    metadata = {
        "module_id": mod_id,
        "name": "Class 10 Mathematics",
        "class": 10,
        "subject": "Mathematics",
        "language": "English",
        "version": "1.0",
        "size_mb": 72,
        "author": "NCERT / National Curriculum Framework",
        "topics": [
            "Real Numbers", "Polynomials", "Linear Equations", "Quadratic Equations",
            "Arithmetic Progressions", "Triangles", "Coordinate Geometry",
            "Trigonometry", "Circles", "Statistics & Probability"
        ]
    }

    curriculum = {
        "syllabus_code": "MATH-X-2026",
        "total_chapters": 10,
        "learning_objectives": [
            "Master algebraic problem solving and polynomial roots",
            "Solve quadratic equations using factorization and quadratic formula",
            "Understand arithmetic sequences and series summation",
            "Apply distance and section formulas in coordinate geometry",
            "Utilize trigonometric ratios and fundamental identities in 2D geometry",
            "Analyze statistical measures of central tendency and basic probability"
        ]
    }

    chapters = [
        {
            "chapter_id": 1,
            "title": "Real Numbers",
            "subtopics": ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Revisiting Irrational Numbers"],
            "summary": "Every composite number can be expressed as a product of primes uniquely. Proving irrationality of sqrt(2), sqrt(3), sqrt(5).",
            "formulas": [
                "Dividend = (Divisor × Quotient) + Remainder, where 0 <= r < b",
                "HCF(a, b) × LCM(a, b) = a × b"
            ],
            "text": "The Fundamental Theorem of Arithmetic states that every composite number can be factored as a product of prime numbers, and this factorization is unique apart from the order of prime factors. For any two positive integers a and b, HCF(a, b) * LCM(a, b) = a * b. A real number is irrational if it cannot be written as p/q where p and q are coprime integers and q != 0. To prove sqrt(2) is irrational, assume sqrt(2) = a/b where a and b are coprime. 2 = a^2/b^2, so a^2 = 2b^2. Thus 2 divides a^2 and 2 divides a. Let a = 2c, then 4c^2 = 2b^2 => b^2 = 2c^2. Thus 2 divides b as well, contradicting that a and b are coprime."
        },
        {
            "chapter_id": 2,
            "title": "Polynomials",
            "subtopics": ["Zeroes of a Polynomial", "Relationship between Zeroes and Coefficients", "Division Algorithm"],
            "summary": "Relationship between roots alpha, beta and coefficients of quadratic ax^2 + bx + c.",
            "formulas": [
                "Sum of zeroes: alpha + beta = -b/a",
                "Product of zeroes: alpha * beta = c/a",
                "Cubic zeroes: alpha + beta + gamma = -b/a, alpha*beta + beta*gamma + gamma*alpha = c/a, alpha*beta*gamma = -d/a"
            ],
            "text": "A polynomial p(x) of degree n has at most n real zeroes. For a quadratic polynomial ax^2 + bx + c where a != 0, if alpha and beta are zeroes: Sum of roots alpha + beta = -b / a. Product of roots alpha * beta = c / a. If zeroes are known, the polynomial can be written as k[x^2 - (alpha + beta)x + (alpha * beta)]. Graphically, the zeroes of p(x) are the x-coordinates of points where the graph y = p(x) intersects the x-axis."
        },
        {
            "chapter_id": 3,
            "title": "Pair of Linear Equations in Two Variables",
            "subtopics": ["Graphical Method", "Substitution Method", "Elimination Method", "Cross-Multiplication Method"],
            "summary": "Systems of equations a1*x + b1*y + c1 = 0 and a2*x + b2*y + c2 = 0.",
            "formulas": [
                "Unique solution: a1/a2 != b1/b2 (Intersecting lines, consistent)",
                "Infinitely many solutions: a1/a2 = b1/b2 = c1/c2 (Coincident lines, dependent consistent)",
                "No solution: a1/a2 = b1/b2 != c1/c2 (Parallel lines, inconsistent)"
            ],
            "text": "A linear equation in two variables represents a straight line in the Cartesian plane. A pair of linear equations can be solved algebraically using Substitution or Elimination. In substitution, express one variable in terms of the other and substitute into the other equation. In elimination, multiply equations by constants so coefficients of one variable match, then add or subtract."
        },
        {
            "chapter_id": 4,
            "title": "Quadratic Equations",
            "subtopics": ["Standard Form", "Solution by Factorisation", "Quadratic Formula", "Nature of Roots"],
            "summary": "Solving ax^2 + bx + c = 0, discriminant D = b^2 - 4ac, nature of roots.",
            "formulas": [
                "Standard Form: ax^2 + bx + c = 0, a != 0",
                "Discriminant: D = b^2 - 4ac",
                "Quadratic Formula: x = (-b ± sqrt(b^2 - 4ac)) / (2a)",
                "Two distinct real roots if D > 0",
                "Two equal real roots if D = 0",
                "No real roots (complex roots) if D < 0"
            ],
            "text": "A quadratic equation in variable x is an equation of the form ax^2 + bx + c = 0 where a, b, c are real numbers and a != 0. To solve by factorization, split the middle term bx into two terms whose product is a*c and sum is b. The quadratic formula derived by completing the square gives the roots directly: x = (-b +- sqrt(D)) / (2a) where D = b^2 - 4ac. When D > 0, roots are real and distinct. When D = 0, roots are real and equal (x = -b / 2a). When D < 0, there are no real roots."
        },
        {
            "chapter_id": 5,
            "title": "Arithmetic Progressions",
            "subtopics": ["nth Term of an AP", "Sum of First n Terms"],
            "summary": "Arithmetic sequences where consecutive terms differ by a constant common difference d.",
            "formulas": [
                "Common difference: d = a_{k+1} - a_k",
                "nth term: a_n = a + (n - 1)d",
                "Sum of n terms: S_n = (n / 2)[2a + (n - 1)d] or S_n = (n / 2)[a + l]"
            ],
            "text": "An Arithmetic Progression (AP) is a sequence of numbers in which each term after the first is obtained by adding a fixed number d (common difference) to the preceding term. The first term is denoted by a. The nth term is given by a_n = a + (n - 1)d. The sum of the first n terms of an AP is S_n = n/2 * (2a + (n - 1)d) or S_n = n/2 * (a + l), where l is the last term a_n. If a, b, c are in AP, then 2b = a + c."
        },
        {
            "chapter_id": 6,
            "title": "Coordinate Geometry",
            "subtopics": ["Distance Formula", "Section Formula", "Area of a Triangle"],
            "summary": "Distance between points, internal division of line segments.",
            "formulas": [
                "Distance Formula: d = sqrt((x2 - x1)^2 + (y2 - y1)^2)",
                "Distance from origin: d = sqrt(x^2 + y^2)",
                "Section Formula: P(x, y) = ((m1*x2 + m2*x1)/(m1 + m2), (m1*y2 + m2*y1)/(m1 + m2))",
                "Midpoint Formula: M = ((x1 + x2)/2, (y1 + y2)/2)"
            ],
            "text": "Coordinate geometry connects algebra and geometry using Cartesian coordinates. The distance between two points A(x1, y1) and B(x2, y2) is given by d = sqrt((x2 - x1)^2 + (y2 - y1)^2). The coordinates of point P(x, y) dividing the line segment joining A(x1, y1) and B(x2, y2) internally in ratio m1:m2 are ((m1*x2 + m2*x1)/(m1 + m2), (m1*y2 + m2*y1)/(m1 + m2)). When m1:m2 = 1:1, P is the midpoint ((x1 + x2)/2, (y1 + y2)/2)."
        },
        {
            "chapter_id": 7,
            "title": "Introduction to Trigonometry",
            "subtopics": ["Trigonometric Ratios", "Trigonometric Ratios of Specific Angles", "Trigonometric Identities"],
            "summary": "Ratios of sides in a right-angled triangle, values at 0, 30, 45, 60, 90 degrees.",
            "formulas": [
                "sin(theta) = Opposite / Hypotenuse",
                "cos(theta) = Adjacent / Hypotenuse",
                "tan(theta) = Opposite / Adjacent = sin(theta) / cos(theta)",
                "cosec(theta) = 1/sin(theta), sec(theta) = 1/cos(theta), cot(theta) = 1/tan(theta)",
                "sin^2(theta) + cos^2(theta) = 1",
                "1 + tan^2(theta) = sec^2(theta)",
                "1 + cot^2(theta) = cosec^2(theta)"
            ],
            "text": "Trigonometry studies relationships between side lengths and angles of triangles. In a right-angled triangle ABC right-angled at B: sin A = opposite side / hypotenuse, cos A = adjacent side / hypotenuse, tan A = opposite / adjacent. Specific values: sin(30) = 1/2, sin(45) = 1/sqrt(2), sin(60) = sqrt(3)/2, sin(90) = 1. cos(0) = 1, cos(30) = sqrt(3)/2, cos(45) = 1/sqrt(2), cos(60) = 1/2, cos(90) = 0. tan(45) = 1, tan(30) = 1/sqrt(3), tan(60) = sqrt(3). Fundamental identities: sin^2(A) + cos^2(A) = 1 for all 0 <= A <= 90."
        }
    ]

    examples = [
        {
            "example_id": "EX-M10-01",
            "chapter": "Quadratic Equations",
            "question": "Solve 2x^2 - 5x + 3 = 0 by factorization.",
            "step_by_step": [
                "Step 1: Identify coefficients a = 2, b = -5, c = 3.",
                "Step 2: Find two numbers whose product is a * c = 2 * 3 = 6, and whose sum is b = -5. These numbers are -2 and -3.",
                "Step 3: Split the middle term: 2x^2 - 2x - 3x + 3 = 0.",
                "Step 4: Factor by grouping: 2x(x - 1) - 3(x - 1) = 0 => (2x - 3)(x - 1) = 0.",
                "Step 5: Set each factor to zero: 2x - 3 = 0 => x = 3/2, or x - 1 = 0 => x = 1.",
                "Final answer: The roots are x = 1 and x = 3/2."
            ]
        },
        {
            "example_id": "EX-M10-02",
            "chapter": "Arithmetic Progressions",
            "question": "Find the 10th term of the AP: 2, 7, 12, ...",
            "step_by_step": [
                "Step 1: Identify first term a = 2.",
                "Step 2: Compute common difference d = 7 - 2 = 5.",
                "Step 3: Recall the nth term formula: a_n = a + (n - 1)d.",
                "Step 4: For n = 10, a_10 = 2 + (10 - 1) * 5 = 2 + (9 * 5) = 2 + 45 = 47.",
                "Final answer: The 10th term is 47."
            ]
        },
        {
            "example_id": "EX-M10-03",
            "chapter": "Coordinate Geometry",
            "question": "Find the distance between the points P(1, 7) and Q(4, 2).",
            "step_by_step": [
                "Step 1: Identify coordinates: x1 = 1, y1 = 7 and x2 = 4, y2 = 2.",
                "Step 2: Use distance formula d = sqrt((x2 - x1)^2 + (y2 - y1)^2).",
                "Step 3: Substitute values: d = sqrt((4 - 1)^2 + (2 - 7)^2) = sqrt(3^2 + (-5)^2).",
                "Step 4: Simplify: d = sqrt(9 + 25) = sqrt(34).",
                "Final answer: The distance is sqrt(34) units (approx 5.83 units)."
            ]
        }
    ]

    exercises = [
        {
            "exercise_id": "PRACTICE-M10-01",
            "topic": "Quadratic Equations",
            "question": "What is the discriminant of the equation 3x^2 - 4x + 1 = 0?",
            "options": ["A) 4", "B) 8", "C) -4", "D) 16"],
            "correct_option": "A",
            "explanation": "Discriminant D = b^2 - 4ac. Here a = 3, b = -4, c = 1. D = (-4)^2 - 4*(3)*(1) = 16 - 12 = 4. Since D > 0, the equation has two distinct real roots."
        },
        {
            "exercise_id": "PRACTICE-M10-02",
            "topic": "Arithmetic Progressions",
            "question": "In an AP where a = 5, d = 3, what is the 15th term?",
            "options": ["A) 45", "B) 47", "C) 50", "D) 42"],
            "correct_option": "B",
            "explanation": "Formula: a_n = a + (n - 1)d. a_15 = 5 + (15 - 1)*3 = 5 + 14*3 = 5 + 42 = 47."
        },
        {
            "exercise_id": "PRACTICE-M10-03",
            "topic": "Trigonometry",
            "question": "If sin(theta) = 3/5, what is the value of cos(theta)?",
            "options": ["A) 4/5", "B) 5/4", "C) 3/4", "D) 1/5"],
            "correct_option": "A",
            "explanation": "Using identity sin^2(theta) + cos^2(theta) = 1: cos^2(theta) = 1 - (3/5)^2 = 1 - 9/25 = 16/25. Therefore cos(theta) = sqrt(16/25) = 4/5."
        }
    ]

    quizzes = [
        {
            "quiz_id": "QUIZ-M10-01",
            "title": "Class 10 Math Foundation Quiz",
            "questions": [
                {
                    "q_id": 1,
                    "topic": "Quadratic Equations",
                    "question": "If the discriminant of ax^2 + bx + c = 0 is 0, what can be said about the roots?",
                    "options": ["A) Real and distinct", "B) Real and equal", "C) No real roots", "D) Imaginary and unequal"],
                    "correct": "B",
                    "explanation": "When D = b^2 - 4ac = 0, both roots are equal to -b / (2a)."
                },
                {
                    "q_id": 2,
                    "topic": "Arithmetic Progressions",
                    "question": "What is the common difference of the AP: -5, -1, 3, 7, ...?",
                    "options": ["A) -4", "B) 4", "C) 2", "D) -2"],
                    "correct": "B",
                    "explanation": "d = a2 - a1 = -1 - (-5) = -1 + 5 = 4."
                },
                {
                    "q_id": 3,
                    "topic": "Real Numbers",
                    "question": "If HCF(306, 657) = 9, what is LCM(306, 657)?",
                    "options": ["A) 22338", "B) 22330", "C) 18450", "D) 25120"],
                    "correct": "A",
                    "explanation": "LCM = (a * b) / HCF = (306 * 657) / 9 = 34 * 657 = 22,338."
                },
                {
                    "q_id": 4,
                    "topic": "Trigonometry",
                    "question": "What is the value of (sin^2 30° + cos^2 30°)?",
                    "options": ["A) 0", "B) 1/2", "C) 1", "D) 2"],
                    "correct": "C",
                    "explanation": "By fundamental identity, sin^2(theta) + cos^2(theta) = 1 for any angle theta."
                },
                {
                    "q_id": 5,
                    "topic": "Coordinate Geometry",
                    "question": "What is the midpoint of the line segment joining (2, 4) and (6, 8)?",
                    "options": ["A) (4, 6)", "B) (3, 5)", "C) (8, 12)", "D) (4, 4)"],
                    "correct": "A",
                    "explanation": "Midpoint = ((x1+x2)/2, (y1+y2)/2) = ((2+6)/2, (4+8)/2) = (4, 6)."
                }
            ]
        }
    ]

    # Save files
    with open(os.path.join(m_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
    with open(os.path.join(m_dir, "curriculum", "syllabus.json"), "w") as f:
        json.dump(curriculum, f, indent=2)
    for ch in chapters:
        fname = f"ch{ch['chapter_id']:02d}_{ch['title'].lower().replace(' ', '_')}.json"
        with open(os.path.join(m_dir, "chapters", fname), "w") as f:
            json.dump(ch, f, indent=2)
    with open(os.path.join(m_dir, "examples", "worked_examples.json"), "w") as f:
        json.dump(examples, f, indent=2)
    with open(os.path.join(m_dir, "exercises", "practice_exercises.json"), "w") as f:
        json.dump(exercises, f, indent=2)
    with open(os.path.join(m_dir, "quizzes", "quizzes.json"), "w") as f:
        json.dump(quizzes, f, indent=2)

    # Build RAG chunks & index
    chunks = []
    for ch in chapters:
        chunks.append({
            "chunk_id": f"math10_ch_{ch['chapter_id']}",
            "type": "chapter",
            "topic": ch["title"],
            "title": ch["title"],
            "content": f"{ch['title']}: {ch['summary']}. Formulas: {' '.join(ch['formulas'])}. {ch['text']}"
        })
    for ex in examples:
        chunks.append({
            "chunk_id": ex["example_id"],
            "type": "example",
            "topic": ex["chapter"],
            "title": f"Example: {ex['question']}",
            "content": f"Example on {ex['chapter']}: {ex['question']} Steps: {' '.join(ex['step_by_step'])}"
        })

    index_data = build_bm25_index(chunks)
    with open(os.path.join(m_dir, "embeddings", "index", "index.json"), "w") as f:
        json.dump(index_data, f, indent=2)
    with open(os.path.join(m_dir, "embeddings", "index", "chunks.json"), "w") as f:
        json.dump(chunks, f, indent=2)

    print("Class 10 Math module built successfully.")

def setup_class10_science(base_dir):
    mod_id = "class10_science"
    m_dir = os.path.join(base_dir, mod_id)

    metadata = {
        "module_id": mod_id,
        "name": "Class 10 Science",
        "class": 10,
        "subject": "Science",
        "language": "English",
        "version": "1.0",
        "size_mb": 81,
        "author": "NCERT / Science Curriculum Board",
        "topics": [
            "Chemical Reactions & Equations", "Acids, Bases & Salts", "Metals & Non-metals",
            "Life Processes", "Control & Coordination", "Light - Reflection & Refraction",
            "Electricity", "Force & Newton's Laws"
        ]
    }

    curriculum = {
        "syllabus_code": "SCI-X-2026",
        "total_chapters": 8,
        "learning_objectives": [
            "Balance chemical equations and classify chemical transformations",
            "Understand pH indicators, acid-base neutralization and common salts",
            "Explain human organ systems: digestion, respiration, circulation, and excretion",
            "Apply laws of reflection, refraction, and optical mirror/lens equations",
            "Calculate current, resistance, voltage using Ohm's Law and Joule's Law",
            "Comprehend Newton's Three Laws of Motion, force momentum, and inertia"
        ]
    }

    chapters = [
        {
            "chapter_id": 1,
            "title": "Chemical Reactions and Equations",
            "subtopics": ["Chemical Equations", "Balancing Equations", "Types of Chemical Reactions", "Corrosion and Rancidity"],
            "summary": "Chemical changes represented by balanced equations obeying conservation of mass.",
            "formulas": [
                "Combination: A + B -> AB",
                "Decomposition: AB -> A + B (thermal, electrolytic, photolytic)",
                "Displacement: A + BC -> AC + B",
                "Double Displacement: AB + CD -> AD + CB"
            ],
            "text": "A chemical reaction involves breaking old chemical bonds and forming new bonds to produce new substances. According to the law of conservation of mass, matter can neither be created nor destroyed in a chemical reaction. Therefore, the total number of atoms of each element remains identical on both reactant and product sides. Types of reactions: 1) Combination reaction: two or more substances combine to form a single product, e.g. CaO + H2O -> Ca(OH)2. 2) Decomposition reaction: a single reactant breaks down into simpler products, e.g. 2FeSO4 -> Fe2O3 + SO2 + SO3. 3) Displacement reaction: a more reactive element displaces a less reactive element from its salt solution, e.g. Fe + CuSO4 -> FeSO4 + Cu. 4) Double displacement: exchange of ions occurs, e.g. Na2SO4 + BaCl2 -> BaSO4(white ppt) + 2NaCl. 5) Redox reaction: Oxidation is gain of oxygen or loss of hydrogen/electrons; Reduction is gain of hydrogen/electrons or loss of oxygen."
        },
        {
            "chapter_id": 2,
            "title": "Acids, Bases and Salts",
            "subtopics": ["Indicators", "Chemical Properties of Acids and Bases", "pH Scale", "Common Salts"],
            "summary": "Acids produce H+(aq) ions, bases produce OH-(aq) ions. Neutralization reaction.",
            "formulas": [
                "Acid + Metal -> Salt + Hydrogen gas (H2)",
                "Acid + Base -> Salt + Water (Neutralization: H+ + OH- -> H2O)",
                "pH = -log[H+]; pH < 7 is acidic, pH = 7 neutral, pH > 7 basic",
                "Bleaching powder: CaOCl2; Baking soda: NaHCO3; Plaster of Paris: CaSO4.1/2H2O"
            ],
            "text": "Acids are substances that taste sour and turn blue litmus red. In aqueous solution, acids release H+ or hydronium (H3O+) ions. Bases are bitter, soapy to touch, and turn red litmus blue; they release OH- ions. The pH scale measures hydrogen ion concentration from 0 (strongly acidic) to 14 (strongly basic). Neutral water has pH 7. In our digestive system, stomach releases hydrochloric acid (HCl) with pH 1.2 to 2 to activate pepsin. Antacids like Magnesium Hydroxide (Milk of Magnesia) neutralize excess stomach acid. When Plaster of Paris CaSO4.1/2H2O reacts with water, it hardens into Gypsum CaSO4.2H2O."
        },
        {
            "chapter_id": 3,
            "title": "Life Processes",
            "subtopics": ["Autotrophic and Heterotrophic Nutrition", "Respiration", "Transportation in Humans and Plants", "Excretion"],
            "summary": "Basic metabolic functions essential to maintain life in organisms.",
            "formulas": [
                "Photosynthesis: 6CO2 + 12H2O + Sunlight + Chlorophyll -> C6H12O6 + 6O2 + 6H2O",
                "Aerobic respiration: Glucose + 6O2 -> 6CO2 + 6H2O + 38 ATP",
                "Anaerobic respiration in muscle: Glucose -> Lactic acid + 2 ATP (causes cramps)"
            ],
            "text": "Life processes are essential processes that sustain living organisms: nutrition, respiration, transport, and excretion. In autotrophic nutrition (green plants), chlorophyll traps solar energy to convert water and carbon dioxide into glucose, releasing oxygen. Respiration breaks down glucose to release ATP energy: aerobic respiration takes place in mitochondria producing CO2, H2O, and 36-38 ATP; anaerobic respiration in yeast produces ethanol and CO2. Human circulatory system consists of a four-chambered heart, blood (RBCs, WBCs, platelets, plasma), and blood vessels (arteries carry oxygenated blood under high pressure away from heart; veins carry deoxygenated blood back). Excretion in humans is carried out by kidneys containing millions of nephron filtering units."
        },
        {
            "chapter_id": 4,
            "title": "Light - Reflection and Refraction",
            "subtopics": ["Laws of Reflection", "Spherical Mirrors", "Refraction through Glass Slab", "Lenses", "Power of Lens"],
            "summary": "Behavior of light rays, mirror formula, lens formula, and magnification.",
            "formulas": [
                "Laws of Reflection: Angle of incidence (i) = Angle of reflection (r)",
                "Mirror Formula: 1/f = 1/v + 1/u (f = focal length, v = image distance, u = object distance)",
                "Mirror Magnification: m = -v/u = h'/h",
                "Snell's Law: sin(i) / sin(r) = constant = n21 (Refractive index)",
                "Lens Formula: 1/f = 1/v - 1/u",
                "Lens Magnification: m = v/u = h'/h",
                "Power of Lens: P = 1 / f(in metres), measured in Dioptres (D)"
            ],
            "text": "Light travels in straight lines in a homogeneous medium. Reflection is the bouncing back of light from a smooth surface. Concave mirrors form real, inverted images for most positions, but form virtual, erect, magnified images when an object is between pole P and focus F (used by dentists and shaving mirrors). Convex mirrors always form virtual, erect, and diminished images with a wide field of view (used as rear-view mirrors). Refraction is the bending of light when it passes obliquely from one transparent medium to another due to change in speed. Convex lenses converge light; concave lenses diverge light. A convex lens of focal length +0.5 m has power P = 1/0.5 = +2 D."
        },
        {
            "chapter_id": 5,
            "title": "Electricity",
            "subtopics": ["Electric Current", "Electric Potential", "Ohm's Law", "Resistance in Series and Parallel", "Heating Effect of Current"],
            "summary": "Flow of charge, potential difference, resistance, series and parallel circuits, Joule's law.",
            "formulas": [
                "Current: I = Q / t (Amperes, A = Coulombs/second)",
                "Potential difference: V = W / Q (Volts, V = Joules/Coulomb)",
                "Ohm's Law: V = I * R (where R is constant electrical resistance in Ohms, Omega)",
                "Resistance formula: R = rho * (l / A) (rho = resistivity in Ohm-meter)",
                "Series: R_total = R1 + R2 + R3",
                "Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3",
                "Joule's Heating: H = I^2 * R * t",
                "Electric Power: P = V * I = I^2 * R = V^2 / R (Watts)"
            ],
            "text": "Electric current is the rate of flow of electric charges through a conductor. Ohm's Law states that the current flowing through a conductor is directly proportional to the potential difference across its ends, provided temperature remains constant: V = I*R. Resistance depends on length l (R proportional to l), cross-sectional area A (R inversely proportional to A), and nature of material (resistivity rho). In series circuits, current is identical through all components, while total resistance is the algebraic sum. In parallel circuits, voltage is identical across each branch, and equivalent resistance is lower than the smallest branch resistance. Joule's heating effect H = I^2*R*t is used in electric irons, heaters, and safety fuses."
        },
        {
            "chapter_id": 6,
            "title": "Force and Newton's Laws of Motion",
            "subtopics": ["Inertia", "Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Conservation of Momentum"],
            "summary": "The fundamental principles governing force, mass, acceleration, and interaction.",
            "formulas": [
                "Momentum: p = m * v (kg m/s)",
                "Newton's Second Law: Force = rate of change of momentum = d(mv)/dt = m * a",
                "Formula: F = m * a (Newton, N = kg m/s^2)",
                "Newton's Third Law: F_AB = - F_BA (Action and reaction are equal and opposite)",
                "Law of Conservation of Momentum: m1*u1 + m2*u2 = m1*v1 + m2*v2"
            ],
            "text": "Newton's Laws of Motion form the cornerstone of classical physics. 1) First Law (Law of Inertia): An object remains in a state of rest or of uniform motion in a straight line unless acted upon by an unbalanced external force. Inertia is the natural tendency of an object to resist changes in its state of motion; mass is a quantitative measure of inertia. 2) Second Law of Motion: The rate of change of momentum of an object is directly proportional to the applied unbalanced force and occurs in the direction of the force. Since momentum p = m*v, F = d(mv)/dt = m*(v - u)/t = m*a. Hence Force = Mass × Acceleration (F = m*a). One Newton is the force that produces an acceleration of 1 m/s^2 on a 1 kg body. For example, a cricket fielder pulls their hands backwards while catching a fast ball to increase impact time, reducing acceleration and thereby reducing the impact force. 3) Third Law of Motion: To every action, there is always an equal and opposite reaction. When object A exerts a force on object B, object B simultaneously exerts an equal magnitude force in the opposite direction on object A."
        }
    ]

    examples = [
        {
            "example_id": "EX-S10-01",
            "chapter": "Force and Newton's Laws of Motion",
            "question": "Explain Newton's second law with formula and an example.",
            "step_by_step": [
                "Step 1: Statement — Newton's Second Law states that the rate of change of momentum of an object is directly proportional to the applied unbalanced force and takes place in the direction of force.",
                "Step 2: Mathematical Derivation — Momentum p = m * v. Initial momentum = m*u, Final momentum = m*v. Change in momentum = m(v - u). Rate of change = m(v - u)/t = m*a (since acceleration a = (v - u)/t). Therefore, Force F = m * a.",
                "Step 3: Units — Force is measured in Newtons (N), where 1 N = 1 kg * 1 m/s^2.",
                "Step 4: Real-life Example — A cricket fielder pulls his hands backward while catching a fast ball. By pulling his hands back, he increases the time interval t over which velocity becomes zero. As t increases, acceleration a decreases, and hence the stopping force F = m*a exerted on his hands is greatly reduced, preventing injury.",
                "Final answer: F = m*a. Force equals mass times acceleration."
            ]
        },
        {
            "example_id": "EX-S10-02",
            "chapter": "Electricity",
            "question": "A 10 ohm resistor and a 20 ohm resistor are connected in parallel to a 6V battery. Find the equivalent resistance and total current.",
            "step_by_step": [
                "Step 1: Identify given values: R1 = 10 ohms, R2 = 20 ohms, V = 6 Volts.",
                "Step 2: Formula for parallel resistors: 1 / R_eq = 1 / R1 + 1 / R2 = 1/10 + 1/20.",
                "Step 3: Common denominator is 20: 1 / R_eq = (2 + 1) / 20 = 3 / 20.",
                "Step 4: Invert to find R_eq: R_eq = 20 / 3 ohms = 6.67 ohms.",
                "Step 5: Calculate total current using Ohm's Law: I = V / R_eq = 6 / (20/3) = 6 * 3 / 20 = 18 / 20 = 0.9 Amperes.",
                "Final answer: Equivalent resistance is 6.67 ohms, and total current drawn is 0.9 A."
            ]
        }
    ]

    exercises = [
        {
            "exercise_id": "PRACTICE-S10-01",
            "topic": "Force and Newton's Laws",
            "question": "A force of 50 N acts on a body of mass 10 kg. What is the acceleration produced?",
            "options": ["A) 5 m/s^2", "B) 0.2 m/s^2", "C) 500 m/s^2", "D) 25 m/s^2"],
            "correct_option": "A",
            "explanation": "According to Newton's Second Law, F = m * a. Therefore, a = F / m = 50 N / 10 kg = 5 m/s^2."
        },
        {
            "exercise_id": "PRACTICE-S10-02",
            "topic": "Chemical Reactions",
            "question": "What type of reaction is: 2H2 + O2 -> 2H2O?",
            "options": ["A) Decomposition", "B) Combination", "C) Displacement", "D) Neutralization"],
            "correct_option": "B",
            "explanation": "Two distinct substances (hydrogen and oxygen) combine to form a single substance (water), which is the definition of a combination reaction."
        },
        {
            "exercise_id": "PRACTICE-S10-03",
            "topic": "Electricity",
            "question": "If potential difference is 12 V and resistance is 4 ohms, what is current?",
            "options": ["A) 48 A", "B) 3 A", "C) 0.33 A", "D) 8 A"],
            "correct_option": "B",
            "explanation": "Ohm's Law: V = I * R => I = V / R = 12 V / 4 ohms = 3 A."
        }
    ]

    quizzes = [
        {
            "quiz_id": "QUIZ-S10-01",
            "title": "Class 10 Science Mastery Quiz",
            "questions": [
                {
                    "q_id": 1,
                    "topic": "Force and Newton's Laws",
                    "question": "Which law of Newton provides the quantitative definition of force (F = ma)?",
                    "options": ["A) First Law", "B) Second Law", "C) Third Law", "D) Law of Gravitation"],
                    "correct": "B",
                    "explanation": "Newton's Second Law states that force equals rate of change of momentum (F = m * a)."
                },
                {
                    "q_id": 2,
                    "topic": "Light",
                    "question": "What type of mirror is used as a rear-view mirror in vehicles?",
                    "options": ["A) Concave mirror", "B) Plane mirror", "C) Convex mirror", "D) Cylindrical mirror"],
                    "correct": "C",
                    "explanation": "Convex mirrors produce virtual, erect, and diminished images, providing a much wider field of view."
                },
                {
                    "q_id": 3,
                    "topic": "Acids and Bases",
                    "question": "What is the pH value of pure neutral water at 25 degrees Celsius?",
                    "options": ["A) 0", "B) 7", "C) 14", "D) 1"],
                    "correct": "B",
                    "explanation": "Neutral substances have pH = 7. Below 7 is acidic and above 7 is alkaline/basic."
                },
                {
                    "q_id": 4,
                    "topic": "Life Processes",
                    "question": "Where does the aerobic breakdown of pyruvate into carbon dioxide, water, and energy take place?",
                    "options": ["A) Cytoplasm", "B) Mitochondria", "C) Chloroplast", "D) Nucleus"],
                    "correct": "B",
                    "explanation": "The aerobic phase of cellular respiration occurs within the mitochondria."
                },
                {
                    "q_id": 5,
                    "topic": "Electricity",
                    "question": "The commercial unit of electric energy is kilowatt-hour (kWh). 1 kWh is equal to how many Joules?",
                    "options": ["A) 3.6 × 10^5 J", "B) 3.6 × 10^6 J", "C) 1000 J", "D) 3600 J"],
                    "correct": "B",
                    "explanation": "1 kWh = 1000 W × 3600 seconds = 3,600,000 J = 3.6 × 10^6 Joules."
                }
            ]
        }
    ]

    # Save files
    with open(os.path.join(m_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
    with open(os.path.join(m_dir, "curriculum", "syllabus.json"), "w") as f:
        json.dump(curriculum, f, indent=2)
    for ch in chapters:
        fname = f"ch{ch['chapter_id']:02d}_{ch['title'].lower().replace(' ', '_').replace('-', '_')}.json"
        with open(os.path.join(m_dir, "chapters", fname), "w") as f:
            json.dump(ch, f, indent=2)
    with open(os.path.join(m_dir, "examples", "worked_examples.json"), "w") as f:
        json.dump(examples, f, indent=2)
    with open(os.path.join(m_dir, "exercises", "practice_exercises.json"), "w") as f:
        json.dump(exercises, f, indent=2)
    with open(os.path.join(m_dir, "quizzes", "quizzes.json"), "w") as f:
        json.dump(quizzes, f, indent=2)

    chunks = []
    for ch in chapters:
        chunks.append({
            "chunk_id": f"sci10_ch_{ch['chapter_id']}",
            "type": "chapter",
            "topic": ch["title"],
            "title": ch["title"],
            "content": f"{ch['title']}: {ch['summary']}. Formulas: {' '.join(ch['formulas'])}. {ch['text']}"
        })
    for ex in examples:
        chunks.append({
            "chunk_id": ex["example_id"],
            "type": "example",
            "topic": ex["chapter"],
            "title": f"Example: {ex['question']}",
            "content": f"Example on {ex['chapter']}: {ex['question']} Steps: {' '.join(ex['step_by_step'])}"
        })

    index_data = build_bm25_index(chunks)
    with open(os.path.join(m_dir, "embeddings", "index", "index.json"), "w") as f:
        json.dump(index_data, f, indent=2)
    with open(os.path.join(m_dir, "embeddings", "index", "chunks.json"), "w") as f:
        json.dump(chunks, f, indent=2)

    print("Class 10 Science module built successfully.")

def setup_class5_math(base_dir):
    mod_id = "class5_math"
    m_dir = os.path.join(base_dir, mod_id)

    metadata = {
        "module_id": mod_id,
        "name": "Class 5 Mathematics",
        "class": 5,
        "subject": "Mathematics",
        "language": "English",
        "version": "1.0",
        "size_mb": 45,
        "author": "Primary Education Curriculum Board",
        "topics": [
            "Large Numbers & Place Value", "Fractions and Decimals",
            "Shapes and Angles", "Perimeter and Area", "Speed, Distance and Time"
        ]
    }

    curriculum = {
        "syllabus_code": "MATH-V-2026",
        "total_chapters": 5,
        "learning_objectives": [
            "Understand place value up to 7 digits (lakhs and crores)",
            "Compare and calculate fractions and decimals",
            "Classify acute, right, obtuse, and reflex angles",
            "Compute perimeters and areas of rectangles and squares",
            "Solve basic real-world speed, distance, and time word problems"
        ]
    }

    chapters = [
        {
            "chapter_id": 1,
            "title": "Large Numbers and Place Value",
            "subtopics": ["Indian Place Value System", "Comparing Numbers", "Rounding Off"],
            "summary": "Numbers up to 10 lakhs and 1 crore. Ones, tens, hundreds, thousands, lakhs.",
            "formulas": ["1 Lakh = 100,000", "1 Crore = 100 Lakhs = 10,000,000"],
            "text": "In the Indian place value system, numbers are partitioned using periods: Ones period (ones, tens, hundreds), Thousands period (thousands, ten thousands), Lakhs period (lakhs, ten lakhs), and Crores period. Commas separate the periods: for example, 25,48,930 is 25 lakh 48 thousand 930."
        },
        {
            "chapter_id": 2,
            "title": "Fractions and Decimals",
            "subtopics": ["Proper, Improper, Mixed Fractions", "Addition of Fractions", "Decimals in Everyday Life"],
            "summary": "Parts of a whole. Adding and subtracting like and unlike fractions.",
            "formulas": ["Fraction = Numerator / Denominator", "Equivalent fraction: a/b = (a*k)/(b*k)"],
            "text": "A fraction represents part of a whole. In fraction a/b, a is numerator and b is denominator. If numerator < denominator, it is a proper fraction (like 3/4). If numerator >= denominator, it is improper (like 7/4). Decimals are fractions whose denominator is a power of 10 (like 0.5 = 5/10 = 1/2)."
        },
        {
            "chapter_id": 3,
            "title": "Shapes and Angles",
            "subtopics": ["Types of Angles", "Degree Measurement", "2D and 3D Shapes"],
            "summary": "Right angles (90 deg), acute (< 90 deg), obtuse (> 90 deg), straight (180 deg).",
            "formulas": ["Right angle = 90 degrees", "Straight line = 180 degrees"],
            "text": "An angle is formed when two rays meet at a common vertex. A right angle is exactly 90 degrees (like corner of a page). An acute angle is less than 90 degrees. An obtuse angle is between 90 and 180 degrees. A straight angle equals 180 degrees."
        },
        {
            "chapter_id": 4,
            "title": "Perimeter and Area",
            "subtopics": ["Perimeter of Rectangle and Square", "Area of Rectangle and Square"],
            "summary": "Perimeter is distance around boundary. Area is surface enclosed.",
            "formulas": [
                "Perimeter of Rectangle = 2 × (Length + Breadth)",
                "Perimeter of Square = 4 × Side",
                "Area of Rectangle = Length × Breadth",
                "Area of Square = Side × Side"
            ],
            "text": "Perimeter is the total boundary distance around a closed figure. For a rectangle with length L and breadth B, Perimeter = 2*(L + B). For a square of side S, Perimeter = 4*S. Area is the region enclosed within the boundary. Area of rectangle = Length * Breadth. Area of square = Side * Side. Area is measured in square units (e.g. sq cm, sq m)."
        },
        {
            "chapter_id": 5,
            "title": "Speed, Distance and Time",
            "subtopics": ["Concept of Speed", "Formula and Units", "Word Problems"],
            "summary": "Relationship between distance traveled, time taken, and rate of speed.",
            "formulas": [
                "Speed = Distance / Time",
                "Distance = Speed × Time",
                "Time = Distance / Speed"
            ],
            "text": "Speed is the distance covered per unit of time. If a vehicle covers 100 kilometres in 2 hours, its speed is 100 / 2 = 50 km/h. To find distance when speed and time are known: Distance = Speed * Time. To find time: Time = Distance / Speed."
        }
    ]

    examples = [
        {
            "example_id": "EX-M5-01",
            "chapter": "Speed, Distance and Time",
            "question": "A car travels at 20 m/s for 5 seconds. What distance does it travel?",
            "step_by_step": [
                "Step 1: Identify given information — Speed = 20 m/s, Time = 5 seconds.",
                "Step 2: Recall the formula — Distance = Speed × Time.",
                "Step 3: Multiply values — Distance = 20 × 5 = 100 meters.",
                "Final answer: The car travels 100 meters."
            ]
        },
        {
            "example_id": "EX-M5-02",
            "chapter": "Perimeter and Area",
            "question": "Find the perimeter and area of a rectangle with length 8 cm and breadth 5 cm.",
            "step_by_step": [
                "Step 1: Note length L = 8 cm, breadth B = 5 cm.",
                "Step 2: Perimeter = 2 × (L + B) = 2 × (8 + 5) = 2 × 13 = 26 cm.",
                "Step 3: Area = L × B = 8 × 5 = 40 sq cm.",
                "Final answer: Perimeter is 26 cm, Area is 40 sq cm."
            ]
        }
    ]

    exercises = [
        {
            "exercise_id": "PRACTICE-M5-01",
            "topic": "Speed, Distance and Time",
            "question": "A train travels at 60 km/h for 3 hours. How far did it go?",
            "options": ["A) 120 km", "B) 180 km", "C) 20 km", "D) 200 km"],
            "correct_option": "B",
            "explanation": "Distance = Speed × Time = 60 km/h × 3 h = 180 km."
        },
        {
            "exercise_id": "PRACTICE-M5-02",
            "topic": "Perimeter and Area",
            "question": "A square garden has a side of 6 metres. What is its perimeter?",
            "options": ["A) 24 metres", "B) 36 sq metres", "C) 12 metres", "D) 18 metres"],
            "correct_option": "A",
            "explanation": "Perimeter of square = 4 × Side = 4 × 6 = 24 metres."
        }
    ]

    quizzes = [
        {
            "quiz_id": "QUIZ-M5-01",
            "title": "Class 5 Mathematics Quiz",
            "questions": [
                {
                    "q_id": 1,
                    "topic": "Shapes and Angles",
                    "question": "What is an angle of 90 degrees called?",
                    "options": ["A) Acute angle", "B) Right angle", "C) Obtuse angle", "D) Straight angle"],
                    "correct": "B",
                    "explanation": "An angle measuring exactly 90 degrees is a right angle."
                },
                {
                    "q_id": 2,
                    "topic": "Speed Distance Time",
                    "question": "If you walk 12 km in 3 hours, what is your walking speed?",
                    "options": ["A) 3 km/h", "B) 4 km/h", "C) 36 km/h", "D) 6 km/h"],
                    "correct": "B",
                    "explanation": "Speed = Distance / Time = 12 km / 3 h = 4 km/h."
                },
                {
                    "q_id": 3,
                    "topic": "Perimeter and Area",
                    "question": "What is the area of a rectangle with length 10 m and breadth 4 m?",
                    "options": ["A) 28 m", "B) 40 sq m", "C) 14 sq m", "D) 20 sq m"],
                    "correct": "B",
                    "explanation": "Area = Length × Breadth = 10 × 4 = 40 sq m."
                },
                {
                    "q_id": 4,
                    "topic": "Fractions",
                    "question": "What is 1/4 + 2/4?",
                    "options": ["A) 3/8", "B) 3/4", "C) 2/4", "D) 1/2"],
                    "correct": "B",
                    "explanation": "With common denominators, add numerators: (1 + 2)/4 = 3/4."
                },
                {
                    "q_id": 5,
                    "topic": "Large Numbers",
                    "question": "How many thousands are there in 1 Lakh?",
                    "options": ["A) 10", "B) 100", "C) 1000", "D) 50"],
                    "correct": "B",
                    "explanation": "1 Lakh = 100,000 = 100 × 1000 = 100 thousands."
                }
            ]
        }
    ]

    with open(os.path.join(m_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
    with open(os.path.join(m_dir, "curriculum", "syllabus.json"), "w") as f:
        json.dump(curriculum, f, indent=2)
    for ch in chapters:
        fname = f"ch{ch['chapter_id']:02d}_{ch['title'].lower().replace(' ', '_').replace(',', '')}.json"
        with open(os.path.join(m_dir, "chapters", fname), "w") as f:
            json.dump(ch, f, indent=2)
    with open(os.path.join(m_dir, "examples", "worked_examples.json"), "w") as f:
        json.dump(examples, f, indent=2)
    with open(os.path.join(m_dir, "exercises", "practice_exercises.json"), "w") as f:
        json.dump(exercises, f, indent=2)
    with open(os.path.join(m_dir, "quizzes", "quizzes.json"), "w") as f:
        json.dump(quizzes, f, indent=2)

    chunks = []
    for ch in chapters:
        chunks.append({
            "chunk_id": f"math5_ch_{ch['chapter_id']}",
            "type": "chapter",
            "topic": ch["title"],
            "title": ch["title"],
            "content": f"{ch['title']}: {ch['summary']}. Formulas: {' '.join(ch['formulas'])}. {ch['text']}"
        })
    for ex in examples:
        chunks.append({
            "chunk_id": ex["example_id"],
            "type": "example",
            "topic": ex["chapter"],
            "title": f"Example: {ex['question']}",
            "content": f"Example on {ex['chapter']}: {ex['question']} Steps: {' '.join(ex['step_by_step'])}"
        })

    index_data = build_bm25_index(chunks)
    with open(os.path.join(m_dir, "embeddings", "index", "index.json"), "w") as f:
        json.dump(index_data, f, indent=2)
    with open(os.path.join(m_dir, "embeddings", "index", "chunks.json"), "w") as f:
        json.dump(chunks, f, indent=2)

    print("Class 5 Math module built successfully.")

def setup_bca_cs(base_dir):
    mod_id = "bca_cs"
    m_dir = os.path.join(base_dir, mod_id)

    metadata = {
        "module_id": mod_id,
        "name": "BCA / CS Programming",
        "class": "Undergraduate",
        "subject": "Computer Science",
        "language": "English",
        "version": "1.0",
        "size_mb": 65,
        "author": "University Computer Science Board",
        "topics": [
            "Python Programming Basics", "Functions & Recursion",
            "Object-Oriented Programming (OOP)", "Data Structures: Stacks & Queues",
            "Searching and Sorting Algorithms"
        ]
    }

    curriculum = {
        "syllabus_code": "CS-BCA-2026",
        "total_chapters": 5,
        "learning_objectives": [
            "Write modular code using Python loops, functions, and control flow",
            "Apply recursion and understand call stack execution",
            "Implement OOP concepts: classes, inheritance, encapsulation, polymorphism",
            "Design Stack (LIFO) and Queue (FIFO) data structures",
            "Analyze time and space complexity of sorting (Bubble, Merge) and search algorithms"
        ]
    }

    chapters = [
        {
            "chapter_id": 1,
            "title": "Python Programming Fundamentals",
            "subtopics": ["Variables and Data Types", "Control Flow", "Loops"],
            "summary": "Core syntax, dynamic typing, if-else conditionals, for and while loops.",
            "formulas": ["Time complexity: O(1) constant, O(n) linear loop"],
            "text": "Python is a high-level interpreted programming language. Fundamental data types include int, float, str, bool, list, dict, set, tuple. Control flow structures allow decision making using if, elif, and else statements. Loops allow repetitive execution: 'for item in iterable' iterates over sequences, while 'while condition' executes as long as the boolean expression evaluates to True."
        },
        {
            "chapter_id": 2,
            "title": "Object-Oriented Programming (OOP)",
            "subtopics": ["Classes and Objects", "Encapsulation", "Inheritance", "Polymorphism"],
            "summary": "The 4 pillars of OOP: Abstraction, Encapsulation, Inheritance, Polymorphism.",
            "formulas": ["class Child(Parent): inheritance syntax"],
            "text": "Object-Oriented Programming organizes code into reusable blueprints called classes and instances called objects. Encapsulation bundles data and methods together and restricts direct access to internal state using private variables (_var, __var). Inheritance allows a child class to inherit attributes and methods from a parent class. Polymorphism allows methods in different classes to share the same name but provide customized behavior."
        },
        {
            "chapter_id": 3,
            "title": "Data Structures: Stacks and Queues",
            "subtopics": ["LIFO Principle", "FIFO Principle", "Array Implementation"],
            "summary": "Stacks operate on Last-In First-Out (push, pop). Queues operate on First-In First-Out (enqueue, dequeue).",
            "formulas": ["Stack: push O(1), pop O(1)", "Queue: enqueue O(1), dequeue O(1)"],
            "text": "A Stack is a linear data structure following Last-In-First-Out (LIFO). Elements are added (push) and removed (pop) from the top. Real-world uses: function call stack, undo operations, parenthesis matching. A Queue is a linear data structure following First-In-First-Out (FIFO). Elements are added at rear (enqueue) and removed from front (dequeue). Real-world uses: CPU scheduling, printer task queues."
        },
        {
            "chapter_id": 4,
            "title": "Searching and Sorting Algorithms",
            "subtopics": ["Linear Search", "Binary Search", "Bubble Sort", "Merge Sort"],
            "summary": "Algorithms for finding and organizing elements in arrays.",
            "formulas": [
                "Binary Search: O(log n) time, requires sorted array",
                "Linear Search: O(n) time",
                "Bubble Sort: O(n^2) time",
                "Merge Sort: O(n log n) time, divide and conquer"
            ],
            "text": "Searching algorithms locate a target key in a collection. Linear search scans every element in O(n) time. Binary search divides sorted array in half repeatedly in O(log n) time. Bubble sort repeatedly steps through list, swapping adjacent elements that are out of order with O(n^2) worst case. Merge sort uses divide-and-conquer: recursively divides array into two halves, sorts each half, and merges them in O(n log n) time."
        }
    ]

    examples = [
        {
            "example_id": "EX-CS-01",
            "chapter": "Searching and Sorting Algorithms",
            "question": "How does Binary Search work on a sorted array [2, 5, 8, 12, 16, 23, 38] to find target 16?",
            "step_by_step": [
                "Step 1: Set low = 0, high = 6 (length 7). Array is sorted.",
                "Step 2: Find midpoint: mid = (low + high) // 2 = (0 + 6) // 2 = 3. Value at arr[3] is 12.",
                "Step 3: Compare target 16 with 12. Since 16 > 12, target must be in the right half. Set low = mid + 1 = 4.",
                "Step 4: New mid = (4 + 6) // 2 = 5. Value at arr[5] is 23.",
                "Step 5: Compare 16 with 23. Since 16 < 23, target must be in left half. Set high = mid - 1 = 4.",
                "Step 6: New mid = (4 + 4) // 2 = 4. Value at arr[4] is 16. Match found!",
                "Final answer: Target 16 found at index 4 in 3 iterations."
            ]
        }
    ]

    exercises = [
        {
            "exercise_id": "PRACTICE-CS-01",
            "topic": "Data Structures",
            "question": "Which data structure follows the LIFO (Last In First Out) principle?",
            "options": ["A) Queue", "B) Stack", "C) Linked List", "D) Tree"],
            "correct_option": "B",
            "explanation": "A Stack follows Last In First Out (LIFO), where the most recently added element is removed first."
        }
    ]

    quizzes = [
        {
            "quiz_id": "QUIZ-CS-01",
            "title": "BCA Computer Science Assessment",
            "questions": [
                {
                    "q_id": 1,
                    "topic": "Algorithms",
                    "question": "What is the worst-case time complexity of Binary Search?",
                    "options": ["A) O(1)", "B) O(n)", "C) O(log n)", "D) O(n^2)"],
                    "correct": "C",
                    "explanation": "Binary search divides the search interval in half with each comparison, yielding O(log n) time complexity."
                },
                {
                    "q_id": 2,
                    "topic": "OOP",
                    "question": "Which OOP principle involves hiding internal implementation details and exposing only necessary interfaces?",
                    "options": ["A) Encapsulation", "B) Inheritance", "C) Recursion", "D) Iteration"],
                    "correct": "A",
                    "explanation": "Encapsulation bundles data with code and restricts unauthorized external access."
                },
                {
                    "q_id": 3,
                    "topic": "Data Structures",
                    "question": "In a Queue, the insertion operation at the rear is called:",
                    "options": ["A) Pop", "B) Enqueue", "C) Dequeue", "D) Peek"],
                    "correct": "B",
                    "explanation": "Enqueue adds an element to the rear of the queue; Dequeue removes from front."
                },
                {
                    "q_id": 4,
                    "topic": "Algorithms",
                    "question": "Which sorting algorithm operates on the divide-and-conquer paradigm with O(n log n) average time complexity?",
                    "options": ["A) Bubble Sort", "B) Selection Sort", "C) Merge Sort", "D) Insertion Sort"],
                    "correct": "C",
                    "explanation": "Merge Sort recursively divides the list into halves, sorts them, and merges them in O(n log n)."
                },
                {
                    "q_id": 5,
                    "topic": "Python",
                    "question": "What is the output of len([1, 2, 3, [4, 5]]) in Python?",
                    "options": ["A) 5", "B) 4", "C) 3", "D) Error"],
                    "correct": "B",
                    "explanation": "The list contains 4 elements: three integers (1, 2, 3) and one nested list ([4, 5])."
                }
            ]
        }
    ]

    with open(os.path.join(m_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
    with open(os.path.join(m_dir, "curriculum", "syllabus.json"), "w") as f:
        json.dump(curriculum, f, indent=2)
    for ch in chapters:
        fname = f"ch{ch['chapter_id']:02d}_{ch['title'].lower().replace(' ', '_').replace(':', '')}.json"
        with open(os.path.join(m_dir, "chapters", fname), "w") as f:
            json.dump(ch, f, indent=2)
    with open(os.path.join(m_dir, "examples", "worked_examples.json"), "w") as f:
        json.dump(examples, f, indent=2)
    with open(os.path.join(m_dir, "exercises", "practice_exercises.json"), "w") as f:
        json.dump(exercises, f, indent=2)
    with open(os.path.join(m_dir, "quizzes", "quizzes.json"), "w") as f:
        json.dump(quizzes, f, indent=2)

    chunks = []
    for ch in chapters:
        chunks.append({
            "chunk_id": f"cs_ch_{ch['chapter_id']}",
            "type": "chapter",
            "topic": ch["title"],
            "title": ch["title"],
            "content": f"{ch['title']}: {ch['summary']}. Formulas: {' '.join(ch['formulas'])}. {ch['text']}"
        })
    for ex in examples:
        chunks.append({
            "chunk_id": ex["example_id"],
            "type": "example",
            "topic": ex["chapter"],
            "title": f"Example: {ex['question']}",
            "content": f"Example on {ex['chapter']}: {ex['question']} Steps: {' '.join(ex['step_by_step'])}"
        })

    index_data = build_bm25_index(chunks)
    with open(os.path.join(m_dir, "embeddings", "index", "index.json"), "w") as f:
        json.dump(index_data, f, indent=2)
    with open(os.path.join(m_dir, "embeddings", "index", "chunks.json"), "w") as f:
        json.dump(chunks, f, indent=2)

    print("BCA Computer Science module built successfully.")

if __name__ == "__main__":
    base = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "modules")
    print(f"Building curriculum modules in {base}...")
    setup_class10_math(base)
    setup_class10_science(base)
    setup_class5_math(base)
    setup_bca_cs(base)
    print("All curriculum modules and RAG indices created successfully!")
