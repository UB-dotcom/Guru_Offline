"""
Benchmark Dataset Generator for Guru Offline.
Creates a comprehensive 100-question curriculum evaluation dataset.
"""

import json
import os

QUESTIONS = [
    # --- Class 10 Mathematics (30 questions) ---
    {"id": "Q001", "module_id": "class10_math", "question": "Solve 2x + 5 = 15 step by step", "category": "Algebra", "expected_keywords": ["step", "subtract", "divide", "5"]},
    {"id": "Q002", "module_id": "class10_math", "question": "What is the quadratic formula?", "category": "Quadratic Equations", "expected_keywords": ["-b", "b^2 - 4ac", "2a"]},
    {"id": "Q003", "module_id": "class10_math", "question": "Explain the nature of roots using the discriminant D", "category": "Quadratic Equations", "expected_keywords": ["discriminant", "d > 0", "d = 0", "real"]},
    {"id": "Q004", "module_id": "class10_math", "question": "What is the formula for the nth term of an AP?", "category": "Arithmetic Progressions", "expected_keywords": ["a_n", "a + (n - 1)d", "common difference"]},
    {"id": "Q005", "module_id": "class10_math", "question": "How do you find the sum of first n terms of an AP?", "category": "Arithmetic Progressions", "expected_keywords": ["s_n", "n/2", "2a + (n - 1)d"]},
    {"id": "Q006", "module_id": "class10_math", "question": "State the distance formula in coordinate geometry", "category": "Coordinate Geometry", "expected_keywords": ["sqrt", "(x2 - x1)^2", "(y2 - y1)^2"]},
    {"id": "Q007", "module_id": "class10_math", "question": "Explain the section formula for internal division", "category": "Coordinate Geometry", "expected_keywords": ["m1", "m2", "ratio"]},
    {"id": "Q008", "module_id": "class10_math", "question": "State the fundamental identity of trigonometry relating sin and cos", "category": "Trigonometry", "expected_keywords": ["sin^2", "cos^2", "1"]},
    {"id": "Q009", "module_id": "class10_math", "question": "What is the value of tan 45 degrees?", "category": "Trigonometry", "expected_keywords": ["1", "ratio"]},
    {"id": "Q010", "module_id": "class10_math", "question": "State the Fundamental Theorem of Arithmetic", "category": "Real Numbers", "expected_keywords": ["composite", "prime", "factor", "unique"]},
    {"id": "Q011", "module_id": "class10_math", "question": "Why is square root of 2 an irrational number?", "category": "Real Numbers", "expected_keywords": ["coprime", "contradiction", "irrational"]},
    {"id": "Q012", "module_id": "class10_math", "question": "What is the relationship between HCF and LCM of two numbers?", "category": "Real Numbers", "expected_keywords": ["hcf", "lcm", "product", "a * b"]},
    {"id": "Q013", "module_id": "class10_math", "question": "Explain the relationship between zeroes and coefficients of quadratic ax^2 + bx + c", "category": "Polynomials", "expected_keywords": ["-b/a", "c/a", "alpha", "beta"]},
    {"id": "Q014", "module_id": "class10_math", "question": "When does a pair of linear equations have no solution?", "category": "Linear Equations", "expected_keywords": ["parallel", "inconsistent", "a1/a2"]},
    {"id": "Q015", "module_id": "class10_math", "question": "When does a pair of linear equations have infinitely many solutions?", "category": "Linear Equations", "expected_keywords": ["coincident", "dependent", "c1/c2"]},
    {"id": "Q016", "module_id": "class10_math", "question": "Solve 3x - 9 = 0", "category": "Algebra", "expected_keywords": ["3", "step", "x = 3"]},
    {"id": "Q017", "module_id": "class10_math", "question": "Find the roots of x^2 - 5x + 6 = 0", "category": "Quadratic Equations", "expected_keywords": ["factor", "2", "3", "roots"]},
    {"id": "Q018", "module_id": "class10_math", "question": "What is the common difference of 3, 7, 11, 15?", "category": "Arithmetic Progressions", "expected_keywords": ["4", "difference"]},
    {"id": "Q019", "module_id": "class10_math", "question": "Calculate distance between origin (0,0) and point (3,4)", "category": "Coordinate Geometry", "expected_keywords": ["5", "sqrt", "3^2 + 4^2"]},
    {"id": "Q020", "module_id": "class10_math", "question": "What is sin 30 degrees?", "category": "Trigonometry", "expected_keywords": ["1/2", "0.5"]},
    {"id": "Q021", "module_id": "class10_math", "question": "What is cos 60 degrees?", "category": "Trigonometry", "expected_keywords": ["1/2", "0.5"]},
    {"id": "Q022", "module_id": "class10_math", "question": "State the identity relating 1 + tan^2(theta)", "category": "Trigonometry", "expected_keywords": ["sec^2", "identity"]},
    {"id": "Q023", "module_id": "class10_math", "question": "Find midpoint of line segment joining (2, 4) and (6, 8)", "category": "Coordinate Geometry", "expected_keywords": ["4", "6", "midpoint"]},
    {"id": "Q024", "module_id": "class10_math", "question": "What is the degree of a quadratic polynomial?", "category": "Polynomials", "expected_keywords": ["2", "degree"]},
    {"id": "Q025", "module_id": "class10_math", "question": "Solve 4x + 8 = 24", "category": "Algebra", "expected_keywords": ["4", "subtract", "divide"]},
    {"id": "Q026", "module_id": "class10_math", "question": "If an AP has a = 1 and d = 2, find the 5th term", "category": "Arithmetic Progressions", "expected_keywords": ["9", "formula"]},
    {"id": "Q027", "module_id": "class10_math", "question": "What is the discriminant of x^2 - 4x + 4 = 0?", "category": "Quadratic Equations", "expected_keywords": ["0", "b^2 - 4ac", "equal"]},
    {"id": "Q028", "module_id": "class10_math", "question": "Can the probability of an event be greater than 1?", "category": "Probability", "expected_keywords": ["no", "0 and 1", "probability"]},
    {"id": "Q029", "module_id": "class10_math", "question": "State Basic Proportionality Theorem (Thales theorem)", "category": "Triangles", "expected_keywords": ["parallel", "proportional", "ratio"]},
    {"id": "Q030", "module_id": "class10_math", "question": "What is the sum of angles in a triangle?", "category": "Triangles", "expected_keywords": ["180", "degrees"]},

    # --- Class 10 Science (30 questions) ---
    {"id": "Q031", "module_id": "class10_science", "question": "Explain Newton's second law of motion with formula", "category": "Physics - Mechanics", "expected_keywords": ["force", "mass", "acceleration", "f = m * a"]},
    {"id": "Q032", "module_id": "class10_science", "question": "What is Newton's first law of motion?", "category": "Physics - Mechanics", "expected_keywords": ["inertia", "rest", "uniform", "unbalanced"]},
    {"id": "Q033", "module_id": "class10_science", "question": "What is Newton's third law of motion?", "category": "Physics - Mechanics", "expected_keywords": ["action", "reaction", "equal", "opposite"]},
    {"id": "Q034", "module_id": "class10_science", "question": "Why does a cricket fielder pull his hands backwards while catching a ball?", "category": "Physics - Mechanics", "expected_keywords": ["time", "force", "momentum", "acceleration"]},
    {"id": "Q035", "module_id": "class10_science", "question": "State Ohm's Law and its formula", "category": "Physics - Electricity", "expected_keywords": ["v = i * r", "potential", "current", "resistance"]},
    {"id": "Q036", "module_id": "class10_science", "question": "How do you calculate equivalent resistance in series?", "category": "Physics - Electricity", "expected_keywords": ["r1 + r2", "series", "sum"]},
    {"id": "Q037", "module_id": "class10_science", "question": "How do you calculate equivalent resistance in parallel?", "category": "Physics - Electricity", "expected_keywords": ["1/r", "parallel", "reciprocal"]},
    {"id": "Q038", "module_id": "class10_science", "question": "State Joule's law of heating", "category": "Physics - Electricity", "expected_keywords": ["h = i^2 * r * t", "heat", "square", "time"]},
    {"id": "Q039", "module_id": "class10_science", "question": "State the Mirror Formula and sign convention", "category": "Physics - Optics", "expected_keywords": ["1/f = 1/v + 1/u", "focal", "distance"]},
    {"id": "Q040", "module_id": "class10_science", "question": "State Snell's Law of refraction", "category": "Physics - Optics", "expected_keywords": ["sin(i) / sin(r)", "refractive", "constant"]},
    {"id": "Q041", "module_id": "class10_science", "question": "What is the power of a lens and its SI unit?", "category": "Physics - Optics", "expected_keywords": ["dioptre", "1/f", "metres"]},
    {"id": "Q042", "module_id": "class10_science", "question": "Why are convex mirrors used as rear-view mirrors?", "category": "Physics - Optics", "expected_keywords": ["convex", "erect", "field of view", "diminished"]},
    {"id": "Q043", "module_id": "class10_science", "question": "What is a chemical combination reaction? Give an example.", "category": "Chemistry", "expected_keywords": ["combine", "single product", "cao", "reaction"]},
    {"id": "Q044", "module_id": "class10_science", "question": "What is a decomposition reaction?", "category": "Chemistry", "expected_keywords": ["breaks down", "heat", "simpler products"]},
    {"id": "Q045", "module_id": "class10_science", "question": "What is a displacement reaction?", "category": "Chemistry", "expected_keywords": ["more reactive", "displaces", "less reactive"]},
    {"id": "Q046", "module_id": "class10_science", "question": "Define oxidation and reduction in terms of oxygen gain/loss", "category": "Chemistry", "expected_keywords": ["oxidation", "gain of oxygen", "reduction", "loss"]},
    {"id": "Q047", "module_id": "class10_science", "question": "What is the pH scale and what does pH 7 mean?", "category": "Chemistry", "expected_keywords": ["ph", "neutral", "hydrogen ion", "7"]},
    {"id": "Q048", "module_id": "class10_science", "question": "What is the chemical formula of baking soda?", "category": "Chemistry", "expected_keywords": ["nahco3", "sodium hydrogen carbonate"]},
    {"id": "Q049", "module_id": "class10_science", "question": "What happens when Plaster of Paris mixes with water?", "category": "Chemistry", "expected_keywords": ["gypsum", "hard", "caso4"]},
    {"id": "Q050", "module_id": "class10_science", "question": "Explain the equation for photosynthesis", "category": "Biology", "expected_keywords": ["co2", "h2o", "glucose", "chlorophyll", "oxygen"]},
    {"id": "Q051", "module_id": "class10_science", "question": "What is the difference between aerobic and anaerobic respiration?", "category": "Biology", "expected_keywords": ["oxygen", "mitochondria", "atp", "lactic acid"]},
    {"id": "Q052", "module_id": "class10_science", "question": "What is the function of nephrons in the human body?", "category": "Biology", "expected_keywords": ["kidney", "filtration", "urine", "excretion"]},
    {"id": "Q053", "module_id": "class10_science", "question": "What are the main functions of xylem and phloem?", "category": "Biology", "expected_keywords": ["xylem", "water", "phloem", "food", "transport"]},
    {"id": "Q054", "module_id": "class10_science", "question": "What is the unit of electric current?", "category": "Physics - Electricity", "expected_keywords": ["ampere", "coulombs per second"]},
    {"id": "Q055", "module_id": "class10_science", "question": "What is the commercial unit of electrical energy?", "category": "Physics - Electricity", "expected_keywords": ["kilowatt-hour", "kwh", "3.6"]},
    {"id": "Q056", "module_id": "class10_science", "question": "What gas is produced when acid reacts with metal?", "category": "Chemistry", "expected_keywords": ["hydrogen", "h2", "gas"]},
    {"id": "Q057", "module_id": "class10_science", "question": "What is rancidity and how can it be prevented?", "category": "Chemistry", "expected_keywords": ["oxidation", "fat", "antioxidants", "nitrogen"]},
    {"id": "Q058", "module_id": "class10_science", "question": "What is momentum and what is its SI unit?", "category": "Physics - Mechanics", "expected_keywords": ["mass", "velocity", "kg m/s"]},
    {"id": "Q059", "module_id": "class10_science", "question": "What is the lens formula?", "category": "Physics - Optics", "expected_keywords": ["1/f = 1/v - 1/u", "lens"]},
    {"id": "Q060", "module_id": "class10_science", "question": "Why does stomach produce hydrochloric acid?", "category": "Biology", "expected_keywords": ["hcl", "pepsin", "acidic", "digestion"]},

    # --- Class 5 Mathematics (20 questions) ---
    {"id": "Q061", "module_id": "class5_math", "question": "A car travels at 20 m/s for 5 seconds. What distance does it travel?", "category": "Speed Distance Time", "expected_keywords": ["100", "speed * time", "meters"]},
    {"id": "Q062", "module_id": "class5_math", "question": "What is the formula for speed?", "category": "Speed Distance Time", "expected_keywords": ["distance / time", "speed"]},
    {"id": "Q063", "module_id": "class5_math", "question": "How do you calculate distance when speed and time are given?", "category": "Speed Distance Time", "expected_keywords": ["speed * time", "multiply"]},
    {"id": "Q064", "module_id": "class5_math", "question": "What is the perimeter of a rectangle?", "category": "Perimeter and Area", "expected_keywords": ["2 * (length + breadth)", "boundary"]},
    {"id": "Q065", "module_id": "class5_math", "question": "What is the area of a rectangle?", "category": "Perimeter and Area", "expected_keywords": ["length * breadth", "square"]},
    {"id": "Q066", "module_id": "class5_math", "question": "What is the perimeter of a square with side 6 cm?", "category": "Perimeter and Area", "expected_keywords": ["24", "4 * side"]},
    {"id": "Q067", "module_id": "class5_math", "question": "What is the area of a square with side 5 cm?", "category": "Perimeter and Area", "expected_keywords": ["25", "side * side"]},
    {"id": "Q068", "module_id": "class5_math", "question": "What is a right angle?", "category": "Shapes and Angles", "expected_keywords": ["90", "degrees"]},
    {"id": "Q069", "module_id": "class5_math", "question": "What is an acute angle?", "category": "Shapes and Angles", "expected_keywords": ["less than 90", "degrees"]},
    {"id": "Q070", "module_id": "class5_math", "question": "What is an obtuse angle?", "category": "Shapes and Angles", "expected_keywords": ["between 90 and 180", "greater than 90"]},
    {"id": "Q071", "module_id": "class5_math", "question": "How many thousands are there in 1 Lakh?", "category": "Large Numbers", "expected_keywords": ["100", "100,000"]},
    {"id": "Q072", "module_id": "class5_math", "question": "How many lakhs are in 1 Crore?", "category": "Large Numbers", "expected_keywords": ["100", "crore"]},
    {"id": "Q073", "module_id": "class5_math", "question": "What is a proper fraction?", "category": "Fractions", "expected_keywords": ["numerator < denominator", "fraction"]},
    {"id": "Q074", "module_id": "class5_math", "question": "What is 1/4 + 2/4?", "category": "Fractions", "expected_keywords": ["3/4", "add"]},
    {"id": "Q075", "module_id": "class5_math", "question": "Convert 0.5 into a simple fraction", "category": "Fractions", "expected_keywords": ["1/2", "5/10"]},
    {"id": "Q076", "module_id": "class5_math", "question": "If a cyclist rides 30 km in 2 hours, what is their speed?", "category": "Speed Distance Time", "expected_keywords": ["15", "km/h"]},
    {"id": "Q077", "module_id": "class5_math", "question": "What is a straight angle in degrees?", "category": "Shapes and Angles", "expected_keywords": ["180", "degrees"]},
    {"id": "Q078", "module_id": "class5_math", "question": "Find perimeter of a rectangle with length 10 m and breadth 4 m", "category": "Perimeter and Area", "expected_keywords": ["28", "formula"]},
    {"id": "Q079", "module_id": "class5_math", "question": "Find area of a rectangle with length 10 m and breadth 4 m", "category": "Perimeter and Area", "expected_keywords": ["40", "sq m"]},
    {"id": "Q080", "module_id": "class5_math", "question": "How many sides does a pentagon have?", "category": "Shapes and Angles", "expected_keywords": ["5", "sides"]},

    # --- Computer Science / Programming (20 questions) ---
    {"id": "Q081", "module_id": "bca_cs", "question": "Explain how Binary Search works and state its time complexity", "category": "Algorithms", "expected_keywords": ["divide", "mid", "sorted", "o(log n)"]},
    {"id": "Q082", "module_id": "bca_cs", "question": "What is the time complexity of Linear Search?", "category": "Algorithms", "expected_keywords": ["o(n)", "linear"]},
    {"id": "Q083", "module_id": "bca_cs", "question": "What principle does a Stack follow?", "category": "Data Structures", "expected_keywords": ["lifo", "last in first out", "push", "pop"]},
    {"id": "Q084", "module_id": "bca_cs", "question": "What principle does a Queue follow?", "category": "Data Structures", "expected_keywords": ["fifo", "first in first out", "enqueue", "dequeue"]},
    {"id": "Q085", "module_id": "bca_cs", "question": "What are the four main pillars of Object-Oriented Programming?", "category": "OOP", "expected_keywords": ["encapsulation", "inheritance", "polymorphism", "abstraction"]},
    {"id": "Q086", "module_id": "bca_cs", "question": "Explain encapsulation in OOP with an example", "category": "OOP", "expected_keywords": ["data", "methods", "bundle", "private"]},
    {"id": "Q087", "module_id": "bca_cs", "question": "What is inheritance in OOP?", "category": "OOP", "expected_keywords": ["child", "parent", "reuse", "class"]},
    {"id": "Q088", "module_id": "bca_cs", "question": "What is polymorphism in Python?", "category": "OOP", "expected_keywords": ["same method", "different", "poly"]},
    {"id": "Q089", "module_id": "bca_cs", "question": "How does Bubble Sort work and what is its worst-case complexity?", "category": "Algorithms", "expected_keywords": ["swap", "adjacent", "o(n^2)"]},
    {"id": "Q090", "module_id": "bca_cs", "question": "Explain Merge Sort and its divide-and-conquer approach", "category": "Algorithms", "expected_keywords": ["divide", "conquer", "merge", "o(n log n)"]},
    {"id": "Q091", "module_id": "bca_cs", "question": "What is a recursive function in Python?", "category": "Python Programming", "expected_keywords": ["calls itself", "base case", "recursion"]},
    {"id": "Q092", "module_id": "bca_cs", "question": "What is the difference between a list and a tuple in Python?", "category": "Python Programming", "expected_keywords": ["mutable", "immutable", "brackets"]},
    {"id": "Q093", "module_id": "bca_cs", "question": "What does a while loop do in Python?", "category": "Python Programming", "expected_keywords": ["condition", "executes", "true"]},
    {"id": "Q094", "module_id": "bca_cs", "question": "What is a dictionary in Python?", "category": "Python Programming", "expected_keywords": ["key", "value", "hash"]},
    {"id": "Q095", "module_id": "bca_cs", "question": "What is the worst-case time complexity of Merge Sort?", "category": "Algorithms", "expected_keywords": ["o(n log n)", "complexity"]},
    {"id": "Q096", "module_id": "bca_cs", "question": "What is an array and what is its index of the first element?", "category": "Data Structures", "expected_keywords": ["0", "zero", "contiguous"]},
    {"id": "Q097", "module_id": "bca_cs", "question": "What is a class vs an object?", "category": "OOP", "expected_keywords": ["blueprint", "instance", "class"]},
    {"id": "Q098", "module_id": "bca_cs", "question": "Give a real-world example of a Stack data structure", "category": "Data Structures", "expected_keywords": ["undo", "call stack", "plates"]},
    {"id": "Q099", "module_id": "bca_cs", "question": "Give a real-world example of a Queue data structure", "category": "Data Structures", "expected_keywords": ["printer", "line", "scheduling"]},
    {"id": "Q100", "module_id": "bca_cs", "question": "What keyword is used to define a function in Python?", "category": "Python Programming", "expected_keywords": ["def", "function"]}
]

def generate():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target = os.path.join(base_dir, "benchmark", "dataset_100_questions.json")
    with open(target, "w", encoding="utf-8") as f:
        json.dump(QUESTIONS, f, indent=2)
    print(f"Generated {len(QUESTIONS)} curriculum benchmark questions in {target}")

if __name__ == "__main__":
    generate()
