package com.guruoffline.app.rag

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.File

data class DocumentChunk(
    val chunk_id: String,
    val type: String = "text",
    val topic: String,
    val title: String = "",
    val content: String,
    val board: String = "cbse",
    val classLevel: Int = 10,
    val subject: String = "science",
    val chapter: String = "",
    val language: String = "hi",
    val state: String? = null,
    val stream: String? = null,
    val module_id: String = "class10_science",
    val chapter_id: String = "cbse-10-sci-ch01",
    var bm25_score: Float = 0f
)

data class InvertedPosting(
    val doc_id: Int,
    val tf: Int
)

data class IndexData(
    val total_docs: Int,
    val avg_dl: Float,
    val doc_lengths: List<Int>,
    val idf: Map<String, Float>,
    val inverted_index: Map<String, List<InvertedPosting>>
)

data class AutoChapterAnalysis(
    val chapterNumber: Int,
    val chapterTitle: String,
    val chapterTitleHi: String,
    val subject: String,
    val explanationEn: String,
    val explanationHi: String,
    val formulaOrKeyFactEn: String,
    val formulaOrKeyFactHi: String,
    val realLifeAnalogyEn: String,
    val realLifeAnalogyHi: String,
    val practiceQuestionEn: String? = null,
    val practiceQuestionHi: String? = null,
    val explanation: String = explanationHi,
    val formulaOrKeyFact: String = formulaOrKeyFactEn,
    val realLifeAnalogy: String = realLifeAnalogyEn
)

class LocalRagRetriever(private val baseModulesDir: File? = null) {

    private val gson = Gson()
    private val loadedChunks = mutableMapOf<String, List<DocumentChunk>>()
    private val loadedIndices = mutableMapOf<String, IndexData>()

    // Core on-device verified knowledge base for all 13 NCERT Class 10 Science chapters from jesc1dd.zip + Class 10 Math
    private val defaultCurriculumStore = listOf(
        // Science Chapter 1: Chemical Reactions and Equations
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch01_01",
            topic = "Chemical Equations & Conservation of Mass",
            title = "Chemical Reactions and Equations",
            content = "A chemical reaction transforms reactants into products. By the Law of Conservation of Mass, the total mass of the elements present in products must equal total mass in reactants. Balancing ensures equal atom counts on both sides (e.g., 2Mg + O2 -> 2MgO).",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 1: Chemical Reactions and Equations",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch01"
        ),
        // Science Chapter 2: Acids, Bases and Salts
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch02_01",
            topic = "pH Scale, Acids, Bases & Salts",
            title = "Acids, Bases and Salts",
            content = "Acids produce H+(aq) ions and turn blue litmus red. Bases produce OH-(aq) ions and turn red litmus blue. The pH scale ranges from 0 to 14. Neutral is 7; acidic is < 7; basic is > 7. Plaster of Paris is CaSO4·1/2H2O, which hardens into gypsum on adding water.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 2: Acids, Bases and Salts",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch02"
        ),
        // Science Chapter 3: Metals and Non-metals
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch03_01",
            topic = "Reactivity Series & Ionic Compounds",
            title = "Metals and Non-metals",
            content = "Reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au. Sodium and potassium are stored in kerosene. Ionic compounds have high melting points and conduct electricity in molten state. Galvanisation coats zinc on iron to prevent rusting.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 3: Metals and Non-metals",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch03"
        ),
        // Science Chapter 4: Carbon and its Compounds
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch04_01",
            topic = "Covalent Bonding, Catenation & Soaps",
            title = "Carbon and its Compounds",
            content = "Carbon forms covalent bonds by sharing electrons. Its versatile nature is due to catenation and tetravalency. Alkanes are saturated (CnH2n+2); alkenes and alkynes are unsaturated. Soap molecules form spherical micelles with hydrophobic tails trapping dirt.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 4: Carbon and its Compounds",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch04"
        ),
        // Science Chapter 5: Life Processes
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch05_01",
            topic = "Photosynthesis, Respiration & Excretion",
            title = "Life Processes",
            content = "Photosynthesis: 6CO2 + 6H2O -> C6H12O6 + 6O2. Aerobic respiration in mitochondria generates 38 ATP. Double circulation in 4-chambered heart pumps blood. Nephrons in kidneys filter blood to produce urine.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 5: Life Processes",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch05"
        ),
        // Science Chapter 6: Control and Coordination
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch06_01",
            topic = "Nervous System, Reflex Arc & Hormones",
            title = "Control and Coordination",
            content = "Neuron transmits electrical impulses across synapses. Reflex arc gives involuntary response via spinal cord. Brain controls voluntary actions (cerebrum) and balance (cerebellum). Plant hormone auxin controls phototropism. Insulin regulates blood sugar.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 6: Control and Coordination",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch06"
        ),
        // Science Chapter 7: How do Organisms Reproduce?
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch07_01",
            topic = "Asexual & Sexual Reproduction",
            title = "How do Organisms Reproduce?",
            content = "Asexual reproduction: binary fission in amoeba, budding in hydra/yeast. In flowers, pollination transfers pollen from anther to stigma. In humans, fertilisation occurs in fallopian tubes, and embryo develops in uterus via placenta.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 7: How do Organisms Reproduce?",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch07"
        ),
        // Science Chapter 8: Heredity
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch08_01",
            topic = "Mendel Laws & Sex Determination",
            title = "Heredity",
            content = "Gregor Mendel studied pea plants. Monohybrid cross F2 phenotypic ratio is 3:1 (genotypic 1:2:1). In humans, 23 chromosome pairs include sex chromosomes: females have XX, males have XY. Father's sperm (X or Y) determines child sex.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 8: Heredity",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch08"
        ),
        // Science Chapter 9: Light - Reflection and Refraction
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch09_01",
            topic = "Mirror Formula, Refraction & Lens Power",
            title = "Light - Reflection and Refraction",
            content = "Mirror Formula: 1/f = 1/v + 1/u. Convex mirrors are used as vehicle rear-view mirrors for wide field of view. Snell Law: sin i / sin r = n. Lens Formula: 1/f = 1/v - 1/u. Power of lens P = 1/f (in meters), measured in Dioptres (D).",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 9: Light - Reflection and Refraction",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch09"
        ),
        // Science Chapter 10: The Human Eye and Colourful World
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch10_01",
            topic = "Myopia, Hypermetropia & Dispersion",
            title = "The Human Eye and the Colourful World",
            content = "Near point of normal eye is 25 cm. Myopia (near-sightedness) is corrected with concave lenses. Hypermetropia (far-sightedness) is corrected with convex lenses. Glass prism disperses white light into VIBGYOR. Stars twinkle due to atmospheric refraction.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 10: The Human Eye and the Colourful World",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch10"
        ),
        // Science Chapter 11: Electricity
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch11_01",
            topic = "Ohm Law, Resistance & Joule Heating",
            title = "Electricity",
            content = "Ohm's Law: V = IR. Resistance R = rho * l / A. In series: R = R1 + R2; in parallel: 1/R = 1/R1 + 1/R2. Joule Heating: H = I^2Rt. Power P = VI = I^2R = V^2/R in Watts. 1 kWh = 3.6 x 10^6 Joules.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 11: Electricity",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch11"
        ),
        // Science Chapter 12: Magnetic Effects of Electric Current
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch12_01",
            topic = "Magnetic Field, Fleming Rule & Motor",
            title = "Magnetic Effects of Electric Current",
            content = "Current generates magnetic field (Right-Hand Thumb Rule). Solenoid produces uniform internal magnetic field. Fleming's Left-Hand Rule determines force direction in electric motors. Domestic circuits use 220V, 50Hz AC with live, neutral, and earth wires.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 12: Magnetic Effects of Electric Current",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch12"
        ),
        // Science Chapter 13: Our Environment
        DocumentChunk(
            chunk_id = "cbse_10_sci_ch13_01",
            topic = "Ecosystem, 10 Percent Law & Ozone Layer",
            title = "Our Environment",
            content = "Ecosystem consists of biotic and abiotic components. 10% Law: only 10% of energy passes to next trophic level. Biomagnification concentrates toxic chemicals at top levels. Ozone (O3) protects from harmful UV rays; CFCs deplete ozone.",
            board = "cbse",
            classLevel = 10,
            subject = "science",
            chapter = "Chapter 13: Our Environment",
            language = "hi",
            module_id = "class10_science",
            chapter_id = "cbse-10-sci-ch13"
        ),
        // Math Chapter 4: Quadratic Equations
        DocumentChunk(
            chunk_id = "cbse_10_math_ch04_01",
            topic = "Standard Form & Discriminant",
            title = "Quadratic Equations",
            content = "Quadratic equation standard form: ax² + bx + c = 0 (a ≠ 0). Discriminant D = b² - 4ac. Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a). Projectile motion (basketball trajectory) follows a parabolic path.",
            board = "cbse",
            classLevel = 10,
            subject = "mathematics",
            chapter = "Chapter 4: Quadratic Equations",
            language = "hi",
            module_id = "class10_math",
            chapter_id = "cbse-10-math-ch04"
        )
    )

    /**
     * Automatic Chapter Analysis & Selection:
     * Analyzes question semantics and keywords to auto-select the exact NCERT Class 10 chapter.
     */
    fun analyzeAndAutoSelectChapter(query: String): AutoChapterAnalysis {
        val q = query.lowercase()

        return when {
            // Chapter 1: Chemical Reactions
            q.contains("reaction") || q.contains("chemical") || q.contains("balance") || q.contains("redox") ||
            q.contains("oxidation") || q.contains("reduction") || q.contains("displacement") || q.contains("अभिक्रिया") ||
            q.contains("समीकरण") || q.contains("corrosion") || q.contains("rancid") -> {
                AutoChapterAnalysis(
                    chapterNumber = 1,
                    chapterTitle = "Chemical Reactions and Equations",
                    chapterTitleHi = "रासायनिक अभिक्रियाएं एवं समीकरण",
                    subject = "Science",
                    explanationEn = "A chemical reaction transforms reactants into new products with distinct properties.\n\n" +
                            "• Combination Reaction: 2Mg + O₂ → 2MgO (Burning of magnesium ribbon in air)\n" +
                            "• Decomposition Reaction: CaCO₃ + heat → CaO + CO₂\n" +
                            "• Displacement Reaction: Fe + CuSO₄ → FeSO₄ + Cu (Iron displaces copper)\n" +
                            "• Redox Reaction: Simultaneous oxidation (gain of oxygen/loss of electrons) and reduction (loss of oxygen/gain of electrons).",
                    explanationHi = "रासायनिक अभिक्रिया में एक या अधिक पदार्थ आपस में क्रिया करके नए गुणधर्म वाले उत्पाद बनाते हैं। द्रव्यमान संरक्षण के नियम के अनुसार अभिकारकों का कुल द्रव्यमान उत्पादों के कुल द्रव्यमान के बराबर होना चाहिए।\n\n" +
                            "• संयोजन अभिक्रिया: 2Mg + O₂ → 2MgO (मैग्नीशियम रिबन का दहन)\n" +
                            "• वियोजन अभिक्रिया: CaCO₃ + ऊष्मा → CaO + CO₂\n" +
                            "• विस्थापन अभिक्रिया: Fe + CuSO₄ → FeSO₄ + Cu\n" +
                            "• उपचयन (ऑक्सीजन का जुड़ना) और अपचयन (ऑक्सीजन का ह्रास) एक साथ होना रेडॉक्स (Redox) कहलाता है।",
                    formulaOrKeyFactEn = "Law of Conservation of Mass: Mass of Reactants = Mass of Products",
                    formulaOrKeyFactHi = "द्रव्यमान संरक्षण का नियम: अभिकारकों का कुल द्रव्यमान = उत्पादों का कुल द्रव्यमान",
                    realLifeAnalogyEn = "Rusting of iron railings and food turning rancid in open air are common real-life examples of redox reactions.",
                    realLifeAnalogyHi = "लोहे पर जंग लगना या भोजन का खराब होना (विकृतगंधिता) रेडॉक्स अभिक्रिया का दैनिक उदाहरण है।"
                )
            }

            // Chapter 2: Acids, Bases and Salts
            q.contains("acid") || q.contains("base") || q.contains("ph") || q.contains("litmus") ||
            q.contains("salt") || q.contains("plaster of paris") || q.contains("baking soda") || q.contains("bleach") ||
            q.contains("अम्ल") || q.contains("क्षारक") || q.contains("लवण") || q.contains("उदासीनीकरण") -> {
                AutoChapterAnalysis(
                    chapterNumber = 2,
                    chapterTitle = "Acids, Bases and Salts",
                    chapterTitleHi = "अम्ल, क्षारक एवं लवण",
                    subject = "Science",
                    explanationEn = "Acids taste sour and release H⁺(aq) ions in aqueous solution. Bases taste bitter, feel soapy, and release OH⁻(aq) ions.\n\n" +
                            "• pH Scale (0 to 14): pH 7 is neutral; pH < 7 is acidic; pH > 7 is basic.\n" +
                            "• Neutralisation Reaction: Acid + Base → Salt + Water (HCl + NaOH → NaCl + H₂O)\n" +
                            "• Baking Soda: NaHCO₃ (sodium hydrogen carbonate), used in baking powder and as an antacid.\n" +
                            "• Plaster of Paris (POP): CaSO₄·½H₂O, hardens into gypsum (CaSO₄·2H₂O) when mixed with water.",
                    explanationHi = "अम्ल स्वाद में खट्टे होते हैं और जलीय विलयन में H⁺(aq) आयन देते हैं। क्षारक कड़वे होते हैं और OH⁻(aq) आयन देते हैं।\n\n" +
                            "• pH स्केल (0 से 14): शुद्ध जल व उदासीन विलयन का pH = 7 होता है। pH < 7 अम्लीय और pH > 7 क्षारीय होता है।\n" +
                            "• उदासीनीकरण (Neutralisation): अम्ल + क्षारक → लवण + जल (HCl + NaOH → NaCl + H₂O)\n" +
                            "• बेकिंग सोडा: NaHCO₃ (एंटी-एसिड व बेकिंग पाउडर में)\n" +
                            "• प्लास्टर ऑफ पेरिस (POP): CaSO₄·½H₂O, जल मिलाने पर कठोर जिप्सम (CaSO₄·2H₂O) बन जाता है।",
                    formulaOrKeyFactEn = "Neutralisation: Acid + Base -> Salt + H2O | pH = -log[H+]",
                    formulaOrKeyFactHi = "उदासीनीकरण: अम्ल + क्षारक -> लवण + जल | pH = -log[H+]",
                    realLifeAnalogyEn = "Taking an antacid (baking soda or Eno) neutralises excessive stomach acidity, providing instant relief.",
                    realLifeAnalogyHi = "पेट में एसिडिटी होने पर बेकिंग सोडा या इनो (क्षारक) लेने से तुरंत आराम मिलता है।"
                )
            }

            // Chapter 3: Metals and Non-metals
            q.contains("metal") || q.contains("non-metal") || q.contains("reactivity series") ||
            q.contains("ionic bond") || q.contains("galvanis") || q.contains("alloy") ||
            q.contains("धातु") || q.contains("अधातु") || q.contains("सक्रियता श्रेणी") -> {
                AutoChapterAnalysis(
                    chapterNumber = 3,
                    chapterTitle = "Metals and Non-metals",
                    chapterTitleHi = "धातु एवं अधातु",
                    subject = "Science",
                    explanationEn = "Metals are malleable (hammered into sheets), ductile (drawn into wires), and good conductors of heat and electricity.\n\n" +
                            "• Reactivity Series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au.\n" +
                            "• Highly reactive metals like Sodium and Potassium are stored in kerosene to prevent vigorous oxidation.\n" +
                            "• Ionic Compounds: Formed by complete transfer of electrons from a metal to a non-metal; have high melting points and conduct electricity when molten or dissolved.\n" +
                            "• Galvanisation: Coating a thin layer of zinc over iron to prevent rusting.",
                    explanationHi = "धातुएं आघातवर्ध्य (पीटकर चादर बनाना), तन्य (खींचकर तार बनाना) तथा ऊष्मा व विद्युत की सुचालक होती हैं।\n\n" +
                            "• सक्रियता श्रेणी: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au। सोडियम और पोटैशियम इतने अधिक क्रियाशील हैं कि इन्हें केरोसिन में डुबोकर रखा जाता है।\n" +
                            "• आयनिक यौगिक: धातुओं से अधातुओं में इलेक्ट्रॉन स्थानांतरण से बनते हैं। इनके गलनांक उच्च होते हैं और ये जलीय या गलित अवस्था में विद्युत का चालन करते हैं।\n" +
                            "• जस्तीकरण (Galvanisation): लोहे को जंग से बचाने के लिए जिंक की परत चढ़ाई जाती है।",
                    formulaOrKeyFactEn = "Reactivity Series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Ag > Au",
                    formulaOrKeyFactHi = "सक्रियता श्रेणी: K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Ag > Au",
                    realLifeAnalogyEn = "Zinc coating on iron bridge railings and outdoor water tanks prevents rust for decades.",
                    realLifeAnalogyHi = "लोहे के पुलों व बर्तनों पर जस्तीकरण कर उन्हें वर्षों तक जंग से सुरक्षित रखा जाता है।"
                )
            }

            // Chapter 4: Carbon and its Compounds
            q.contains("carbon") || q.contains("covalent") || q.contains("catenation") || q.contains("tetravalen") ||
            q.contains("alkane") || q.contains("alkene") || q.contains("alkyne") || q.contains("soap") ||
            q.contains("detergent") || q.contains("micelle") || q.contains("ethanol") || q.contains("कार्बन") -> {
                AutoChapterAnalysis(
                    chapterNumber = 4,
                    chapterTitle = "Carbon and its Compounds",
                    chapterTitleHi = "कार्बन एवं उसके यौगिक",
                    subject = "Science",
                    explanationEn = "Carbon has atomic number 6 and valency 4. It forms covalent bonds by sharing electron pairs with other atoms.\n\n" +
                            "• Versatile nature is due to Catenation (self-linking) and Tetravalency, allowing carbon to form millions of organic compounds.\n" +
                            "• Saturated Hydrocarbons: Alkanes (CₙH₂ₙ₊₂ - single carbon-carbon bonds).\n" +
                            "• Unsaturated Hydrocarbons: Alkenes (CₙH₂ₙ - double bond) and Alkynes (CₙH₂ₙ₋₂ - triple bond).\n" +
                            "• Soap Cleansing Action: Soap molecules form spherical micelles in water with hydrophobic hydrocarbon tails trapping oily dirt and hydrophilic ionic heads facing water.",
                    explanationHi = "कार्बन की परमाणु संख्या 6 और संयोजकता 4 होती है। यह इलेक्ट्रॉन साझा करके सहसंयोजी आबंध (Covalent Bonds) बनाता है।\n\n" +
                            "• शृंखलन (Catenation) और चतुःसंयोजकता के कारण कार्बन लाखों यौगिक बनाता है।\n" +
                            "• संतृप्त हाइड्रोकार्बन: एल्केन (CₙH₂ₙ₊₂ - एकल आबंध)\n" +
                            "• असंतृप्त हाइड्रोकार्बन: एल्कीन (CₙH₂ₙ - द्वि-आबंध) व एल्काइन (CₙH₂ₙ₋₂ - त्रि-आबंध)\n" +
                            "• साबुन की सफाई क्रिया: साबुन के अणु जल में मिसेल (Micelle) बनाते हैं, जिसमें जलविरागी पूँछ मैल को केंद्र में फंसाती है और जलरागी सिरा बाहर रहता है।",
                    formulaOrKeyFactEn = "Alkanes: CnH2n+2 | Alkenes: CnH2n | Alkynes: CnH2n-2",
                    formulaOrKeyFactHi = "एल्केन: CnH2n+2 | एल्कीन: CnH2n | एल्काइन: CnH2n-2",
                    realLifeAnalogyEn = "Soap micelles surround oily grease on clothes like tiny spheres and carry it away into rinse water.",
                    realLifeAnalogyHi = "साबुन से कपड़े धोते समय मिसेल मैल व तेल को पानी के साथ खींचकर बाहर निकाल देता है।"
                )
            }

            // Chapter 5: Life Processes
            q.contains("photosynthesis") || q.contains("nutrition") || q.contains("respiration") || q.contains("digestion") ||
            q.contains("atp") || q.contains("heart") || q.contains("xylem") || q.contains("phloem") ||
            q.contains("nephron") || q.contains("kidney") || q.contains("life process") || q.contains("जैव प्रक्रम") ||
            q.contains("श्वसन") || q.contains("प्रकाश संश्लेषण") -> {
                AutoChapterAnalysis(
                    chapterNumber = 5,
                    chapterTitle = "Life Processes",
                    chapterTitleHi = "जैव प्रक्रम",
                    subject = "Science",
                    explanationEn = "Life processes are essential functions performed by living organisms: nutrition, respiration, transportation, and excretion.\n\n" +
                            "• Photosynthesis: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ (glucose) + 6O₂\n" +
                            "• Respiration: Aerobic respiration in mitochondria breaks down glucose using O₂ to generate 38 ATP molecules of energy.\n" +
                            "• Double Circulation: The 4-chambered human heart prevents mixing of oxygen-rich and carbon dioxide-rich blood.\n" +
                            "• Excretion: Nephrons inside kidneys filter blood to eliminate toxic nitrogenous waste (urea) as urine.",
                    explanationHi = "जीवों में जीवन को बनाए रखने वाले आवश्यक प्रक्रम पोषण, श्वसन, वहन और उत्सर्जन हैं।\n\n" +
                            "• प्रकाश संश्लेषण: 6CO₂ + 6H₂O + सूर्य का प्रकाश → C₆H₁₂O₆ (ग्लूकोज) + 6O₂\n" +
                            "• श्वसन: वायवीय श्वसन माइटोकॉन्ड्रिया में O₂ की उपस्थिति में होता है और 38 ATP ऊर्जा उत्पन्न करता है।\n" +
                            "• परिसंचरण: मानव हृदय में 4 कोष्ठ होते हैं (दोहरा परिसंचरण)। जाइलम जल व खनिज तथा फ्लोएम भोजन का परिवहन करता है।\n" +
                            "• उत्सर्जन: वृक्क (Kidney) में स्थित नेफ्रॉन (Nephron) रक्त से यूरिया को छानकर मूत्र बनाता है।",
                    formulaOrKeyFactEn = "Photosynthesis: 6CO2 + 6H2O -> C6H12O6 + 6O2 + Energy (ATP)",
                    formulaOrKeyFactHi = "प्रकाश संश्लेषण: 6CO2 + 6H2O -> C6H12O6 + 6O2 + ऊर्जा (ATP)",
                    realLifeAnalogyEn = "Just as a car engine burns fuel to produce mechanical energy, our body cells break down glucose to generate ATP energy.",
                    realLifeAnalogyHi = "जैसे कार को चलाने के लिए पेट्रोल जलकर ऊर्जा देता है, वैसे ही कोशिकाओं में ग्लूकोज टूटकर ATP ऊर्जा देता है।"
                )
            }

            // Chapter 6: Control and Coordination
            q.contains("neuron") || q.contains("nerve") || q.contains("synapse") || q.contains("reflex") ||
            q.contains("brain") || q.contains("auxin") || q.contains("cytokinin") || q.contains("insulin") ||
            q.contains("thyroid") || q.contains("hormone") || q.contains("नियंत्रण") || q.contains("समन्वय") -> {
                AutoChapterAnalysis(
                    chapterNumber = 6,
                    chapterTitle = "Control and Coordination",
                    chapterTitleHi = "नियंत्रण एवं समन्वय",
                    subject = "Science",
                    explanationEn = "Body control and coordination is carried out by the nervous system and endocrine hormones.\n\n" +
                            "• Neuron: Structural unit of the nervous system composed of dendrites, cell body (cyton), and axon, transmitting electrical impulses across synapses.\n" +
                            "• Reflex Arc: Rapid involuntary response governed by the spinal cord to protect against sudden danger without brain delay.\n" +
                            "• Brain: Cerebrum (cognition & memory), Cerebellum (motor balance & coordination), Medulla (involuntary actions like blood pressure and heartbeat).\n" +
                            "• Hormones: Auxin (plant phototropism), Insulin (regulates blood sugar), Thyroxine (regulates metabolism, requires iodine).",
                    explanationHi = "शरीर में नियंत्रण तंत्रिका तंत्र और हार्मोन द्वारा होता है।\n\n" +
                            "• न्यूरॉन: तंत्रिका तंत्र की मूल इकाई है जो डेंड्राइट, कोशिका काय और एक्सॉन से बनी होती है।\n" +
                            "• प्रतिवर्ती चाप (Reflex Arc): गर्म वस्तु छूते ही बिना सोचे हाथ पीछे खींचना मेरुदंड द्वारा त्वरित गति से होता है।\n" +
                            "• मस्तिष्क: प्रमस्तिष्क (सोचना-विचारना), अनुमस्तिष्क (शारीरिक संतुलन व साइकिल चलाना), मेडुला (अनैच्छिक क्रियाएं जैसे रक्तचाप)।\n" +
                            "• हार्मोन: ऑक्सिन (पौधों का प्रकाश की ओर मुड़ना), इंसुलिन (रक्त शर्करा नियंत्रण), थायरॉक्सिन (उपापचय नियंत्रण, आयोडीन आवश्यक)।",
                    formulaOrKeyFactEn = "Reflex Pathway: Receptor -> Sensory Neuron -> Spinal Cord -> Motor Neuron -> Muscle",
                    formulaOrKeyFactHi = "प्रतिवर्ती पथ: ग्राही अंग -> संवेदी तंत्रिका -> मेरुदंड -> प्रेरक तंत्रिका -> मांसपेशी",
                    realLifeAnalogyEn = "Pulling your hand away instantly upon touching a hot utensil before even realizing it is a classic reflex arc in action.",
                    realLifeAnalogyHi = "अचानक काँटा चुभने पर बिना सोचे तुरंत पैर ऊपर उठ जाना प्रतिवर्ती चाप का परिणाम है।"
                )
            }

            // Chapter 7: How do Organisms Reproduce?
            q.contains("reproduc") || q.contains("fission") || q.contains("budding") || q.contains("pollination") ||
            q.contains("fertilisation") || q.contains("sperm") || q.contains("ovary") || q.contains("placenta") ||
            q.contains("contracept") || q.contains("जनन") || q.contains("परागण") || q.contains("निषेचन") -> {
                AutoChapterAnalysis(
                    chapterNumber = 7,
                    chapterTitle = "How do Organisms Reproduce?",
                    chapterTitleHi = "जीव जनन कैसे करते हैं",
                    subject = "Science",
                    explanationEn = "Reproduction is the biological process by which organisms produce offspring of the same species to maintain continuity.\n\n" +
                            "• Asexual Reproduction: Binary fission (Amoeba), budding (Hydra/Yeast), regeneration (Planaria).\n" +
                            "• Sexual Reproduction in Flowering Plants: Pollen grains transfer from anther to stigma (pollination), leading to fertilisation into seeds.\n" +
                            "• Human Reproduction: Fertilisation occurs in the fallopian tube; the developing embryo receives nutrition and oxygen from the mother's uterus via the placenta.\n" +
                            "• Contraceptive Methods: Mechanical barrier (condoms), chemical (oral pills), intrauterine devices (Copper-T), and surgical sterilization.",
                    explanationHi = "जनन प्रजातियों की निरंतरता बनाए रखने की प्रक्रिया है।\n\n" +
                            "• अलैंगिक जनन: द्विखंडन (अमीबा), मुकुलन (यीस्ट, हाइड्रा), पुनरुद्भवन (प्लेनेरिया)।\n" +
                            "• पौधों में लैंगिक जनन: पुंकेसर (नर भाग) के परागकण स्त्रीकेसर के वर्तिकाग्र पर स्थानांतरित होते हैं (परागण)। निषेचन के बाद अंडाशय फल और बीजांड बीज बनता है।\n" +
                            "• मानव में: निषेचन अंडवाहिनी (Fallopian Tube) में होता है और भ्रूण गर्भाशय में प्लेसेंटा द्वारा पोषण प्राप्त करता है।\n" +
                            "• गर्भनिरोधक: बैरियर (कंडोम), कॉपर-टी, तथा नसबंदी।",
                    formulaOrKeyFactEn = "Fertilisation: Male Gamete (Sperm) + Female Gamete (Ovum) -> Zygote (2n)",
                    formulaOrKeyFactHi = "निषेचन: नर युग्मक (शुक्राणु) + मादा युग्मक (अंडाणु) -> युग्मनज (2n)",
                    realLifeAnalogyEn = "Growing a fresh rose plant by planting a cut stem into soil is a real-world example of vegetative propagation.",
                    realLifeAnalogyHi = "गुलाब की कलम काटकर नया पौधा उगाना कायिक प्रवर्धन (अलैंगिक जनन) का रूप है।"
                )
            }

            // Chapter 8: Heredity
            q.contains("heredity") || q.contains("mendel") || q.contains("pea") || q.contains("monohybrid") ||
            q.contains("dihybrid") || q.contains("chromosome") || q.contains("sex determin") ||
            q.contains("आनुवंशिकता") || q.contains("मेंडल") || q.contains("गुणसूत्र") -> {
                AutoChapterAnalysis(
                    chapterNumber = 8,
                    chapterTitle = "Heredity",
                    chapterTitleHi = "आनुवंशिकता",
                    subject = "Science",
                    explanationEn = "Heredity refers to the transmission of genetic traits and characters from parents to offspring.\n\n" +
                            "• Gregor Mendel performed classic experiments on garden pea plants (Pisum sativum).\n" +
                            "• Monohybrid Cross: F₂ generation yields phenotypic ratio 3:1 (Tall : Dwarf) and genotypic ratio 1:2:1 (TT : Tt : tt).\n" +
                            "• Sex Determination in Humans: Humans possess 23 pairs of chromosomes. Females have XX sex chromosomes; males have XY. The father's sperm carrying either X or Y determines whether the child will be female (XX) or male (XY).",
                    explanationHi = "माता-पिता से संतानों में आनुवंशिक लक्षणों का संचरण आनुवंशिकता कहलाता है।\n\n" +
                            "• ग्रेगर जॉन मेंडल ने मटर (Pisum sativum) पर प्रयोग किए।\n" +
                            "• एकसंकर संकरण (Monohybrid Cross): लंबे (TT) और बौने (tt) पौधे के संकरण से F₂ पीढ़ी में लक्षणप्ररूपी अनुपात 3:1 (Tall:Dwarf) और जीनप्ररूपी अनुपात 1:2:1 (TT:Tt:tt) मिलता है।\n" +
                            "• लिंग निर्धारण: मानव में 23 जोड़े गुणसूत्र होते हैं। स्त्रियों में XX और पुरुषों में XY होता है। पिता से प्राप्त गुणसूत्र (X या Y) ही बच्चे का लिंग निर्धारित करता है।",
                    formulaOrKeyFactEn = "Mendel Monohybrid F2 Ratio: 3:1 (Phenotype) | 1:2:1 (Genotype)",
                    formulaOrKeyFactHi = "मेंडल एकसंकर F2 अनुपात: 3:1 (लक्षणप्ररूपी) | 1:2:1 (जीनप्ररूपी)",
                    realLifeAnalogyEn = "Inheriting eye color or curly hair from parents is determined by dominant and recessive genes passed across generations.",
                    realLifeAnalogyHi = "आँखों का रंग या बालों का घुंघराला होना माता-पिता से मिलने वाले प्रभावी/अप्रभावी जीन पर निर्भर करता है।"
                )
            }

            // Chapter 9: Light - Reflection and Refraction
            q.contains("light") || q.contains("reflect") || q.contains("mirror") || q.contains("concave") ||
            q.contains("convex") || q.contains("refract") || q.contains("lens") || q.contains("snell") ||
            q.contains("dioptre") || q.contains("प्रकाश") || q.contains("दर्पण") || q.contains("अपवर्तन") -> {
                AutoChapterAnalysis(
                    chapterNumber = 9,
                    chapterTitle = "Light – Reflection and Refraction",
                    chapterTitleHi = "प्रकाश – परावर्तन तथा अपवर्तन",
                    subject = "Science",
                    explanationEn = "Light propagates in straight lines in homogeneous transparent media.\n\n" +
                            "• Spherical Mirror Formula: 1/f = 1/v + 1/u (f = focal length, v = image distance, u = object distance).\n" +
                            "• Convex Mirror: Always produces erect, virtual, and diminished images with a broad field of view; used as vehicle rear-view mirrors.\n" +
                            "• Snell's Law of Refraction: sin i / sin r = constant refractive index (n).\n" +
                            "• Lens Formula: 1/f = 1/v - 1/u. Power of a lens P = 1/f (in meters), measured in Dioptres (D). Convex lens has +D power; concave lens has -D power.",
                    explanationHi = "प्रकाश सीधी रेखा में गमन करता है।\n\n" +
                            "• गोलीय दर्पण सूत्र: 1/f = 1/v + 1/u (जहाँ f = फोकस दूरी, v = प्रतिबिम्ब दूरी, u = बिम्ब दूरी)।\n" +
                            "• उत्तल दर्पण (Convex Mirror): सदैव सीधा, आभासी और छोटा प्रतिबिम्ब बनाता है; वाहनों में रियर-व्यू मिरर के रूप में उपयोगी।\n" +
                            "• स्नेल का नियम (अपवर्तन): sin i / sin r = अपवर्तनांक (n)।\n" +
                            "• लेंस सूत्र: 1/f = 1/v - 1/u। लेंस की क्षमता P = 1/f (मीटर में), मात्रक डायोप्टर (D) है। उत्तल लेंस धनात्मक (+D) व अवतल लेंस ऋणात्मक (-D) क्षमता रखता है।",
                    formulaOrKeyFactEn = "Mirror Formula: 1/f = 1/v + 1/u | Lens Formula: 1/f = 1/v - 1/u | Power P = 1/f",
                    formulaOrKeyFactHi = "दर्पण सूत्र: 1/f = 1/v + 1/u | लेंस सूत्र: 1/f = 1/v - 1/u | लेंस क्षमता P = 1/f",
                    realLifeAnalogyEn = "Rear-view car mirrors state 'Objects in mirror are closer than they appear' because convex mirrors provide a wider field of view.",
                    realLifeAnalogyHi = "वाहनों के साइड मिरर में लिखा होता है: 'Objects in mirror are closer than they appear' क्योंकि उत्तल दर्पण दृष्टि-क्षेत्र बड़ा दिखाता है।"
                )
            }

            // Chapter 10: The Human Eye and Colourful World
            q.contains("eye") || q.contains("retina") || q.contains("myopia") || q.contains("hypermetropia") ||
            q.contains("prism") || q.contains("dispersion") || q.contains("rainbow") || q.contains("twinkling") ||
            q.contains("tyndall") || q.contains("नेत्र") || q.contains("दृष्टि") || q.contains("प्रिज्म") -> {
                AutoChapterAnalysis(
                    chapterNumber = 10,
                    chapterTitle = "The Human Eye and the Colourful World",
                    chapterTitleHi = "मानव नेत्र तथा रंगबिरंगा संसार",
                    subject = "Science",
                    explanationEn = "The human eye lens forms real and inverted images on the retina. The least distance of distinct vision for a normal eye is 25 cm.\n\n" +
                            "• Myopia (Nearsightedness): Nearby objects are seen clearly; distant objects are blurred. Corrected with a Concave lens.\n" +
                            "• Hypermetropia (Farsightedness): Distant objects are seen clearly; nearby objects are blurred. Corrected with a Convex lens.\n" +
                            "• Dispersion: When white light passes through a glass prism, it splits into 7 colors (VIBGYOR). Red deviates the least, and violet deviates the most.\n" +
                            "• Twinkling of Stars: Caused by atmospheric refraction through moving air layers of varying refractive indices.",
                    explanationHi = "नेत्र लेंस रेटिना पर वास्तविक व उल्टा प्रतिबिम्ब बनाता है। सामान्य नेत्र का निकट बिंदु 25 सेमी होता है।\n\n" +
                            "• निकट दृष्टि दोष (Myopia): पास की वस्तुएं साफ दिखती हैं, दूर की नहीं। निवारण: अवतल लेंस (Concave Lens)।\n" +
                            "• दूर दृष्टि दोष (Hypermetropia): दूर की वस्तुएं साफ दिखती हैं, पास की नहीं। निवारण: उत्तल लेंस (Convex Lens)।\n" +
                            "• वर्ण-विक्षेपण (Dispersion): कांच के प्रिज्म से गुजरने पर श्वेत प्रकाश 7 रंगों (VIBGYOR) में विभाजित हो जाता है (लाल सबसे कम, बैंगनी सबसे अधिक मुड़ता है)।\n" +
                            "• तारों का टिमटिमाना: वायुमंडलीय अपवर्तन के कारण होता है। प्रकीर्णन (Scattering) के कारण आकाश नीला दिखाई देता है।",
                    formulaOrKeyFactEn = "Normal Eye Near Point: 25 cm | Rainbow = Dispersion + Refraction + Total Internal Reflection",
                    formulaOrKeyFactHi = "सामान्य नेत्र का निकट बिंदु: 25 सेमी | इंद्रधनुष = वर्ण-विक्षेपण + अपवर्तन + पूर्ण आंतरिक परावर्तन",
                    realLifeAnalogyEn = "Tiny suspended raindrops act like miniature prisms to split sunlight into a colorful rainbow in the sky.",
                    realLifeAnalogyHi = "बारिश के बाद धूप खिलने पर पानी की बूँदें छोटे-छोटे प्रिज्मों की तरह काम करके इंद्रधनुष बनाती हैं।"
                )
            }

            // Chapter 11: Electricity
            q.contains("electric") || q.contains("current") || q.contains("ampere") || q.contains("potential") ||
            q.contains("volt") || q.contains("ohm") || q.contains("resistance") || q.contains("joule") ||
            q.contains("watt") || q.contains("kwh") || q.contains("विद्युत") || q.contains("ओम") || q.contains("प्रतिरोध") -> {
                AutoChapterAnalysis(
                    chapterNumber = 11,
                    chapterTitle = "Electricity",
                    chapterTitleHi = "विद्युत",
                    subject = "Science",
                    explanationEn = "Electric current (I = Q/t) is the rate of flow of electric charges, measured in Amperes (A). Electric potential difference (V = W/Q) is measured in Volts (V).\n\n" +
                            "• Ohm's Law: At constant temperature, current flowing through a conductor is directly proportional to potential difference across its ends: V = IR.\n" +
                            "• Electrical Resistance: R = ρ·l/A (where ρ is resistivity, l is length, A is cross-sectional area).\n" +
                            "• Resistors in Series: R = R₁ + R₂ + R₃. In Parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃.\n" +
                            "• Joule's Law of Heating: Heat produced H = I²Rt. Electric Power P = VI = I²R = V²/R. 1 commercial unit = 1 kWh = 3.6 × 10⁶ Joules.",
                    explanationHi = "विद्युत धारा (I) आवेश प्रवाह की दर है (I = Q/t, मात्रक एम्पीयर A)। विभवांतर (V = W/Q, मात्रक वोल्ट V)।\n\n" +
                            "• ओम का नियम: स्थिर ताप पर तार के सिरों का विभवांतर उसमें प्रवाहित धारा के अनुक्रमानुपाती होता है: V = IR।\n" +
                            "• प्रतिरोध: R = ρ·l/A (लंबाई l बढ़ाने पर प्रतिरोध बढ़ता है, अनुप्रस्थ काट A बढ़ाने पर घटता है)।\n" +
                            "• श्रेणीक्रम: R = R₁ + R₂ + R₃। पार्श्वक्रम (समानांतर): 1/R = 1/R₁ + 1/R₂ + 1/R₃।\n" +
                            "• जूल का तापन नियम: H = I²Rt। विद्युत शक्ति P = VI = I²R = V²/R। 1 यूनिट = 1 kWh = 3.6 × 10⁶ जूल।",
                    formulaOrKeyFactEn = "Ohm's Law: V = IR | Resistance: R = rho*l/A | Heat: H = I^2*R*t | Power: P = VI",
                    formulaOrKeyFactHi = "ओम का नियम: V = IR | प्रतिरोध: R = rho*l/A | तापन: H = I^2*R*t | शक्ति: P = VI",
                    realLifeAnalogyEn = "Household lights and fans are wired in parallel so that if one appliance is turned off, others continue running normally.",
                    realLifeAnalogyHi = "घर में सभी पंखे व लाइट समानांतर क्रम (Parallel) में जुड़े होते हैं ताकि एक बंद होने पर बाकी चलते रहें।"
                )
            }

            // Chapter 12: Magnetic Effects of Electric Current
            q.contains("magnet") || q.contains("solenoid") || q.contains("fleming") || q.contains("motor") ||
            q.contains("induction") || q.contains("domestic") || q.contains("earth wire") ||
            q.contains("चुंबक") || q.contains("चुंबकीय") || q.contains("परिनालिका") -> {
                AutoChapterAnalysis(
                    chapterNumber = 12,
                    chapterTitle = "Magnetic Effects of Electric Current",
                    chapterTitleHi = "विद्युत धारा के चुंबकीय प्रभाव",
                    subject = "Science",
                    explanationEn = "A current-carrying conductor generates a magnetic field around itself (Right-Hand Thumb Rule).\n\n" +
                            "• Solenoid: A cylindrical coil of insulated copper wire that produces uniform internal parallel magnetic field lines, mimicking a bar magnet.\n" +
                            "• Fleming's Left-Hand Rule: Thumb represents force/thrust, Forefinger represents magnetic field, and Middle finger represents current direction. This is the operating principle of electric motors.\n" +
                            "• Domestic Electric Circuits: 220V, 50Hz alternating current (AC). Features live wire (red), neutral wire (black), and earth wire (green, providing a low-resistance path to protect against shocks).",
                    explanationHi = "विद्युत धारावाही तार अपने चारों ओर चुंबकीय क्षेत्र उत्पन्न करता है (दाहिने हाथ के अँगूठे का नियम)।\n\n" +
                            "• परिनालिका (Solenoid): तांबे के तार की बेलनाकार कुंडली, जिसके भीतर चुंबकीय क्षेत्र एकसमान और समानांतर होता है।\n" +
                            "• फ्लेमिंग का वाम-हस्त नियम (वाम हाथ का नियम): अँगूठा (बल F), तर्जनी (चुंबकीय क्षेत्र B), मध्यमा (विद्युत धारा I) परस्पर लंबवत होते हैं। यह विद्युत मोटर का सिद्धांत है।\n" +
                            "• घरेलू परिपथ: 220V, 50Hz प्रत्यावर्ती धारा (AC)। विद्युन्मय तार (लाल), उदासीन तार (काला), तथा भूसंपर्क तार (हरा - जो करंट के झटके से रक्षा करता है)।",
                    formulaOrKeyFactEn = "Fleming's Left-Hand Rule: FBI (Force = Thumb, B-Field = Forefinger, Current = Middle Finger)",
                    formulaOrKeyFactHi = "फ्लेमिंग का वाम-हस्त नियम: FBI (बल = अँगूठा, चुंबकीय क्षेत्र = तर्जनी, धारा = मध्यमा)",
                    realLifeAnalogyEn = "Electric motors in washing machines, ceiling fans, and water pumps operate on Fleming's Left-Hand Rule.",
                    realLifeAnalogyHi = "बिजली के पंखे और मिक्सी में मोटर फ्लेमिंग के बाएं हाथ के नियम के सिद्धांत पर घूमती है।"
                )
            }

            // Chapter 13: Our Environment
            q.contains("environment") || q.contains("ecosystem") || q.contains("food chain") || q.contains("trophic") ||
            q.contains("10 percent") || q.contains("biomagnif") || q.contains("ozone") || q.contains("cfc") ||
            q.contains("waste") || q.contains("biodegrad") || q.contains("पर्यावरण") || q.contains("पारितंत्र") ||
            q.contains("ओजोन") || q.contains("आहार शृंखला") -> {
                AutoChapterAnalysis(
                    chapterNumber = 13,
                    chapterTitle = "Our Environment",
                    chapterTitleHi = "हमारा पर्यावरण",
                    subject = "Science",
                    explanationEn = "An ecosystem consists of biotic living components (producers, consumers, decomposers) interacting with abiotic physical factors (soil, water, climate).\n\n" +
                            "• Lindeman's 10% Law: Only 10% of the energy is transferred from one trophic level to the next; 90% is consumed in life processes and lost as heat.\n" +
                            "• Biological Magnification: Harmful non-biodegradable pesticides (like DDT) accumulate in increasing concentrations at higher trophic levels, reaching maximum levels in humans.\n" +
                            "• Ozone Layer (O₃): Present in the stratosphere, absorbs harmful solar ultraviolet (UV) radiation. It is depleted by chlorofluorocarbons (CFCs).",
                    explanationHi = "पारितंत्र में जैविक घटक (उत्पादक, उपभोक्ता, अपघटक) और अजैविक घटक (हवा, पानी, मिट्टी) होते हैं।\n\n" +
                            "• 10% नियम (लिंडमैन): एक पोषी स्तर से अगले स्तर पर केवल 10% ऊर्जा ही स्थानांतरित होती है; 90% ऊर्जा उपापचय व ऊष्मा में नष्ट हो जाती है।\n" +
                            "• जैव-आवर्धन (Biomagnification): कीटनाशकों (जैसे DDT) का आहार शृंखला के शीर्ष स्तर (मानव) में सर्वाधिक जमाव हो जाना।\n" +
                            "• ओजोन परत (O₃): समताप मंडल में सूर्य की पराबैंगनी (UV) विकिरण से रक्षा करती है। क्लोरोफ्लोरोकार्बन (CFCs) ओजोन परत को क्षति पहुँचाते हैं।",
                    formulaOrKeyFactEn = "10% Energy Transfer: Producer (10,000 J) -> Herbivore (1,000 J) -> Carnivore (100 J) -> Apex Carnivore (10 J)",
                    formulaOrKeyFactHi = "10% ऊर्जा स्थानांतरण नियम: उत्पादक (10,000 J) -> शाकाहारी (1,000 J) -> मांसाहारी (100 J) -> शीर्ष मांसाहारी (10 J)",
                    realLifeAnalogyEn = "The ozone layer functions like global sunscreen protecting all living beings from harmful UV radiation.",
                    realLifeAnalogyHi = "ओजोन परत पृथ्वी के लिए एक सुरक्षात्मक सनस्क्रीन की तरह काम करती है।"
                )
            }

            // Admin Ingested Subject: Robotics & Automation
            q.contains("robot") || q.contains("microcontroller") || q.contains("ultrasonic") ||
            q.contains("h-bridge") || q.contains("motor driver") || q.contains("सेंसर") || q.contains("माइक्रोकंट्रोलर") -> {
                AutoChapterAnalysis(
                    chapterNumber = 1,
                    chapterTitle = "Sensors and Microcontrollers",
                    chapterTitleHi = "सेंसर एवं माइक्रोकंट्रोलर",
                    subject = "Robotics & Automation",
                    explanationEn = "A microcontroller serves as the single-chip processing brain of an autonomous robot, interfacing with input sensors and motor outputs.\n\n" +
                            "• Ultrasonic Sensor (HC-SR04): Emits 40kHz acoustic pulses to calculate distance via echolocation time-of-flight.\n" +
                            "• H-Bridge Motor Driver (L298N): Protects low-current microcontroller GPIO pins and enables bidirectional motor drive via PWM speed control.",
                    explanationHi = "माइक्रोकंट्रोलर एक ऑटोनॉमस रोबोट का मुख्य मस्तिष्क होता है जो सेंसर से इनपुट लेकर मोटर को कमांड देता है।\n\n" +
                            "• अल्ट्रासोनिक दूरी सेंसर: ध्वनि तरंगों की प्रतिध्वनि (इकोलोकेशन) द्वारा बाधा की दूरी मापता है।\n" +
                            "• एच-ब्रिज मोटर ड्राइवर: माइक्रोकंट्रोलर के नाजुक पिनों को सुरक्षित रखते हुए मोटर को दोनों दिशाओं में घुमाने और गति नियंत्रित करने में सक्षम बनाता है।",
                    formulaOrKeyFactEn = "Distance = (Time of Flight * Speed of Sound 343 m/s) / 2 | PWM Duty Cycle % = (Ton / Tperiod) * 100",
                    formulaOrKeyFactHi = "दूरी = (समय × ध्वनि की चाल 343 m/s) / 2 | PWM ड्यूटी साइकिल % = (Ton / Tperiod) × 100",
                    realLifeAnalogyEn = "Bats navigating pitch-black caves using echolocation mirrors ultrasonic obstacle sensing.",
                    realLifeAnalogyHi = "चमगादड़ द्वारा अंधेरी गुफाओं में इकोलोकेशन (ध्वनि परावर्तन) से रास्ता खोजना अल्ट्रासोनिक सेंसर का प्राकृतिक रूप है।",
                    practiceQuestionEn = "Question: What component isolates a microcontroller from the high inductive current of DC motors?\nOptions: A) H-Bridge Motor Driver  B) Chassis  C) Resistor  D) Wheel\nCorrect Answer: Option A.",
                    practiceQuestionHi = "प्रश्न: डीसी मोटर के उच्च करंट से माइक्रोकंट्रोलर की सुरक्षा के लिए किसका उपयोग किया जाता है?\nविकल्प: A) एच-ब्रिज मोटर ड्राइवर  B) चेसिस  C) प्रतिरोधक  D) पहिया\nसही उत्तर: विकल्प A।"
                )
            }

            // Admin Ingested Subject: Astronomy & Space Dynamics
            q.contains("kepler") || q.contains("escape velocity") || q.contains("orbit") ||
            q.contains("planetary motion") || q.contains("केपलर") || q.contains("पलायन वेग") || q.contains("ग्रह") -> {
                AutoChapterAnalysis(
                    chapterNumber = 1,
                    chapterTitle = "Orbital Mechanics and Keplerian Motion",
                    chapterTitleHi = "कक्षीय यांत्रिकी एवं ग्रहों की गति",
                    subject = "Astronomy & Space Dynamics",
                    explanationEn = "Governs celestial orbital mechanics under gravitational forces.\n\n" +
                            "• Kepler's 1st Law (Orbits): All planets travel in elliptical orbits with the Sun at one focus.\n" +
                            "• Kepler's 2nd Law (Areas): The radius vector sweeps out equal areas in equal intervals of time (fastest at perihelion).\n" +
                            "• Kepler's 3rd Law (Periods): T² ∝ r³.\n" +
                            "• Escape Velocity: The minimum speed needed to escape Earth's gravity without propulsion (ve ≈ 11.2 km/s).",
                    explanationHi = "गुरुत्वाकर्षण के प्रभाव में खगोलीय पिंडों और उपग्रहों की गति के सिद्धांत:\n\n" +
                            "• केपलर का प्रथम नियम (कक्षाओं का नियम): सभी ग्रह सूर्य के चारों ओर दीर्घवृत्ताकार कक्षाओं में घूमते हैं।\n" +
                            "• केपलर का द्वितीय नियम (क्षेत्रीय चाल का नियम): ग्रह को सूर्य से मिलाने वाली रेखा समान समय में समान क्षेत्रफल तय करती है।\n" +
                            "• केपलर का तृतीय नियम (परिक्रमण काल का नियम): T² ∝ r³।\n" +
                            "• पलायन वेग: वह न्यूनतम वेग जिससे फेंके जाने पर पिंड पृथ्वी के गुरुत्वाकर्षण से बाहर निकल जाए (ve ≈ 11.2 km/s)।",
                    formulaOrKeyFactEn = "Kepler's Third Law: T² / r³ = 4π² / (G * M) | Escape Velocity: Ve = √(2GM / R) ≈ 11.2 km/s",
                    formulaOrKeyFactHi = "केपलर का तृतीय नियम: T² / r³ = 4π² / (G × M) | पलायन वेग: Ve = √(2gR) ≈ 11.2 km/s",
                    realLifeAnalogyEn = "A spinning figure skater pulling their arms inward speeds up, mirroring planets accelerating when closest to the Sun.",
                    realLifeAnalogyHi = "घूमती हुई स्केटर द्वारा हाथ सिकोड़ने पर गति तेज होना, सूर्य के निकट आने पर ग्रह की गति बढ़ने जैसा है।",
                    practiceQuestionEn = "Question: What is the approximate escape velocity from the surface of Earth?\nOptions: A) 11.2 km/s  B) 3.0 × 10⁸ m/s  C) 9.8 m/s  D) 1.6 km/s\nCorrect Answer: Option A.",
                    practiceQuestionHi = "प्रश्न: पृथ्वी की सतह से पलायन वेग का मान लगभग कितना होता है?\nविकल्प: A) 11.2 km/s  B) 3.0 × 10⁸ m/s  C) 9.8 m/s  D) 1.6 km/s\nसही उत्तर: विकल्प A।"
                )
            }

            // Mathematics Chapter 4: Quadratic Equations
            q.contains("quadratic") || q.contains("discriminant") || q.contains("roots") || q.contains("parabola") ||
            q.contains("द्विघात") || q.contains("samjhao") || q.contains("b² - 4ac") -> {
                AutoChapterAnalysis(
                    chapterNumber = 4,
                    chapterTitle = "Quadratic Equations",
                    chapterTitleHi = "द्विघात समीकरण",
                    subject = "Mathematics",
                    explanationEn = "A quadratic equation in variable x has the standard algebraic form ax² + bx + c = 0 (where a ≠ 0 and a, b, c are real numbers).\n\n" +
                            "• Discriminant D = b² - 4ac determines the nature of the roots:\n" +
                            "  - If D > 0: Two distinct real roots.\n" +
                            "  - If D = 0: Two equal real roots (x = -b / 2a).\n" +
                            "  - If D < 0: No real roots.\n" +
                            "• Sridharacharya Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a).\n" +
                            "• Factorization: Splitting the middle term bx into two terms whose product equals ac.",
                    explanationHi = "एक चर x में द्विघात समीकरण का मानक रूप ax² + bx + c = 0 होता है (जहाँ a ≠ 0)।\n\n" +
                            "• विविक्तकर (Discriminant D = b² - 4ac):\n" +
                            "  - यदि D > 0: दो भिन्न वास्तविक मूल\n" +
                            "  - यदि D = 0: दो बराबर वास्तविक मूल (मूल = -b/2a)\n" +
                            "  - यदि D < 0: कोई वास्तविक मूल नहीं\n" +
                            "• द्विघात सूत्र (श्रीधराचार्य नियम): x = (-b ± √(b² - 4ac)) / (2a)।",
                    formulaOrKeyFactEn = "Standard Form: ax² + bx + c = 0 | D = b² - 4ac | Quadratic Formula: x = (-b ± √D) / (2a)",
                    formulaOrKeyFactHi = "मानक रूप: ax² + bx + c = 0 | D = b² - 4ac | x = (-b ± √D) / (2a)",
                    realLifeAnalogyEn = "The flight trajectory of a basketball curving through the air towards the hoop forms a parabola modeled by a quadratic equation.",
                    realLifeAnalogyHi = "बास्केटबॉल फेंकने पर हवा में जो वक्र (Parabola) बनता है, वह द्विघात समीकरण द्वारा ही तय होता है।",
                    practiceQuestionEn = "Question: Find the discriminant of 2x² - 4x + 3 = 0.\nOptions: A) D = -8 (No real roots)  B) D = 8  C) D = 0  D) D = 4\nCorrect Answer: Option A (D = (-4)² - 4(2)(3) = 16 - 24 = -8 < 0).",
                    practiceQuestionHi = "प्रश्न: समीकरण 2x² - 4x + 3 = 0 का विविक्तकर (D) क्या होगा?\nविकल्प: A) D = -8 (कोई वास्तविक मूल नहीं)  B) D = 8  C) D = 0  D) D = 4\nसही उत्तर: विकल्प A (D = (-4)² - 4×2×3 = 16 - 24 = -8 < 0)।"
                )
            }

            // Mathematics Chapter 1: Real Numbers
            q.contains("real number") || q.contains("euclid") || q.contains("hcf") || q.contains("lcm") ||
            q.contains("fundamental theorem") || q.contains("irrational") || q.contains("वास्तविक संख्या") ||
            q.contains("अपरिमेय") || q.contains("अभाज्य") -> {
                AutoChapterAnalysis(
                    chapterNumber = 1,
                    chapterTitle = "Real Numbers",
                    chapterTitleHi = "वास्तविक संख्याएं",
                    subject = "Mathematics",
                    explanationEn = "The Fundamental Theorem of Arithmetic states that every composite number can be uniquely factorized into prime factors.\n\n" +
                            "• For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b.\n" +
                            "• Proving irrationality: Numbers like √2, √3, √5 are proven irrational by contradiction (assuming p/q in simplest form).\n" +
                            "• Terminating Decimals: A rational number p/q has a terminating decimal expansion if q has prime factorization of form 2ⁿ · 5ᵐ.",
                    explanationHi = "अंकगणित की आधारभूत प्रमेय के अनुसार प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के अद्वितीय गुणनफल के रूप में व्यक्त किया जा सकता है।\n\n" +
                            "• दो धनात्मक पूर्णांकों a और b के लिए: HCF(a, b) × LCM(a, b) = a × b।\n" +
                            "• अपरिमेयता सिद्ध करना: √2, √3, √5 को विरोधाभास विधि द्वारा अपरिमेय सिद्ध किया जाता है।\n" +
                            "• शांत दशमलव: यदि हर q के अभाज्य गुणनखंड 2ⁿ · 5ᵐ के रूप के हों, तो परिमेय संख्या का दशमलव प्रसार शांत होता है।",
                    formulaOrKeyFactEn = "HCF(a, b) * LCM(a, b) = a * b | Rational Terminating: q = 2^n * 5^m",
                    formulaOrKeyFactHi = "HCF(a, b) × LCM(a, b) = a × b | शांत दशमलव: हर q = 2ⁿ × 5ᵐ",
                    realLifeAnalogyEn = "Traffic signals synchronizing or school bells ringing together at common time intervals uses the LCM of their cycle times.",
                    realLifeAnalogyHi = "ट्रैफिक लाइट का एक साथ बदलना या स्कूल की घंटियों का एक साथ बजना LCM निकालने का दैनिक उदाहरण है।",
                    practiceQuestionEn = "Question: If HCF(306, 657) = 9, what is their LCM?\nOptions: A) 22338  B) 22330  C) 12450  D) 34500\nCorrect Answer: Option A (LCM = (306 × 657) / 9 = 22338).",
                    practiceQuestionHi = "प्रश्न: यदि HCF(306, 657) = 9 है, तो LCM क्या होगा?\nविकल्प: A) 22338  B) 22330  C) 12450  D) 34500\nसही उत्तर: विकल्प A (LCM = (306 × 657) ÷ 9 = 22338)।"
                )
            }

            // Mathematics Chapter 2: Polynomials
            q.contains("polynomial") || q.contains("zeroes") || q.contains("coefficient") || q.contains("alpha") ||
            q.contains("beta") || q.contains("बहुपद") || q.contains("शून्यक") -> {
                AutoChapterAnalysis(
                    chapterNumber = 2,
                    chapterTitle = "Polynomials",
                    chapterTitleHi = "बहुपद",
                    subject = "Mathematics",
                    explanationEn = "For a quadratic polynomial p(x) = ax² + bx + c (a ≠ 0), let α and β be its zeroes:\n\n" +
                            "• Sum of Zeroes: α + β = -b / a = -(coefficient of x) / (coefficient of x²)\n" +
                            "• Product of Zeroes: α · β = c / a = (constant term) / (coefficient of x²)\n" +
                            "• Forming a polynomial from zeroes: p(x) = k [x² - (α + β)x + αβ].\n" +
                            "• Geometrical Meaning: The zeroes of p(x) are the x-coordinates of points where the parabola y = p(x) intersects the x-axis.",
                    explanationHi = "द्विघात बहुपद p(x) = ax² + bx + c (a ≠ 0) के शून्यक α और β होने पर:\n\n" +
                            "• शून्यकों का योग: α + β = -b / a = -(x का गुणांक) / (x² का गुणांक)\n" +
                            "• शून्यकों का गुणनफल: α · β = c / a = (अचर पद) / (x² का गुणांक)\n" +
                            "• शून्यकों से बहुपद बनाना: p(x) = k [x² - (α + β)x + αβ]।\n" +
                            "• ज्यामितीय अर्थ: बहुपद के शून्यक वे x-निर्देशांक हैं जहाँ ग्राफ x-अक्ष को काटता है।",
                    formulaOrKeyFactEn = "Sum: alpha + beta = -b/a | Product: alpha * beta = c/a | p(x) = k[x^2 - (alpha+beta)x + alpha*beta]",
                    formulaOrKeyFactHi = "शून्यकों का योग: α + β = -b/a | शून्यकों का गुणनफल: αβ = c/a | बहुपद: k[x² - (α+β)x + αβ]",
                    realLifeAnalogyEn = "Architectural arches in bridges and doorways follow parabolic curves governed by quadratic polynomials.",
                    realLifeAnalogyHi = "पुलों के मेहराब (Arches) परवलयाकार होते हैं, जिनका आकार द्विघात बहुपद द्वारा तय होता है।",
                    practiceQuestionEn = "Question: Find a quadratic polynomial whose zeroes are 2 and -3.\nOptions: A) x² + x - 6  B) x² - x - 6  C) x² + 5x + 6  D) x² - 5x + 6\nCorrect Answer: Option A (Sum = -1, Product = -6 => x² - (-1)x + (-6) = x² + x - 6).",
                    practiceQuestionHi = "प्रश्न: एक द्विघात बहुपद ज्ञात कीजिए जिसके शून्यक 2 और -3 हैं।\nविकल्प: A) x² + x - 6  B) x² - x - 6  C) x² + 5x + 6  D) x² - 5x + 6\nसही उत्तर: विकल्प A (योग = -1, गुणनफल = -6 => x² + x - 6)।"
                )
            }

            // Mathematics Chapter 3: Pair of Linear Equations in Two Variables
            q.contains("linear equation") || q.contains("substitution") || q.contains("elimination") ||
            q.contains("consistent") || q.contains("intersecting") || q.contains("parallel line") ||
            q.contains("रैखिक समीकरण") || q.contains("विलोपन") || q.contains("प्रतिस्थापन") -> {
                AutoChapterAnalysis(
                    chapterNumber = 3,
                    chapterTitle = "Pair of Linear Equations in Two Variables",
                    chapterTitleHi = "दो चर वाले रैखिक समीकरण युग्म",
                    subject = "Mathematics",
                    explanationEn = "For equations a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0:\n\n" +
                            "1. If a₁/a₂ ≠ b₁/b₂: Intersecting lines, exactly one unique solution (Consistent).\n" +
                            "2. If a₁/a₂ = b₁/b₂ = c₁/c₂: Coincident lines, infinitely many solutions (Consistent & Dependent).\n" +
                            "3. If a₁/a₂ = b₁/b₂ ≠ c₁/c₂: Parallel lines, no solution (Inconsistent).\n" +
                            "• Algebraic Methods: Substitution method and Elimination method by equating coefficients.",
                    explanationHi = "दो रैखिक समीकरणों a₁x + b₁y + c₁ = 0 और a₂x + b₂y + c₂ = 0 के लिए:\n\n" +
                            "1. यदि a₁/a₂ ≠ b₁/b₂: प्रतिच्छेदी रेखाएं, अद्वितीय हल (संगत)।\n" +
                            "2. यदि a₁/a₂ = b₁/b₂ = c₁/c₂: संपाती रेखाएं, अनेक हल (संगत व आश्रित)।\n" +
                            "3. यदि a₁/a₂ = b₁/b₂ ≠ c₁/c₂: समानांतर रेखाएं, कोई हल नहीं (असंगत)।\n" +
                            "• बीजगणितीय विधियाँ: प्रतिस्थापन विधि तथा विलोपन विधि।",
                    formulaOrKeyFactEn = "Unique: a1/a2 != b1/b2 | Infinitely Many: a1/a2 = b1/b2 = c1/c2 | No Solution: a1/a2 = b1/b2 != c1/c2",
                    formulaOrKeyFactHi = "अद्वितीय हल: a1/a2 != b1/b2 | अनेक हल: a1/a2 = b1/b2 = c1/c2 | कोई हल नहीं: a1/a2 = b1/b2 != c1/c2",
                    realLifeAnalogyEn = "Calculating the individual cost of apples and oranges from two grocery receipts uses simultaneous linear equations.",
                    realLifeAnalogyHi = "दुकान से 2 सेब और 3 संतरों के कुल मूल्य से प्रत्येक का अलग-अलग दाम निकालना रैखिक समीकरण का उपयोग है।",
                    practiceQuestionEn = "Question: What is the nature of solutions for 2x + 3y = 9 and 4x + 6y = 18?\nOptions: A) Infinitely many solutions  B) Unique solution  C) No solution  D) Cannot determine\nCorrect Answer: Option A (a1/a2 = 2/4 = 1/2, b1/b2 = 3/6 = 1/2, c1/c2 = 9/18 = 1/2; lines are coincident).",
                    practiceQuestionHi = "प्रश्न: समीकरण 2x + 3y = 9 और 4x + 6y = 18 के हलों की प्रकृति क्या है?\nविकल्प: A) अपरिमित रूप से अनेक हल  B) अद्वितीय हल  C) कोई हल नहीं  D) तय नहीं हो सकता\nसही उत्तर: विकल्प A (a1/a2 = b1/b2 = c1/c2 = 1/2, रेखाएं संपाती हैं)।"
                )
            }

            // Mathematics Chapter 5: Arithmetic Progressions
            q.contains("arithmetic") || q.contains("ap") || q.contains("common difference") ||
            q.contains("nth term") || q.contains("समांतर श्रेढ़ी") || q.contains("सार्व अंतर") -> {
                AutoChapterAnalysis(
                    chapterNumber = 5,
                    chapterTitle = "Arithmetic Progressions",
                    chapterTitleHi = "समांतर श्रेढ़ी",
                    subject = "Mathematics",
                    explanationEn = "An Arithmetic Progression (AP) is a sequence where the difference between consecutive terms is constant (common difference d = aₖ₊₁ - aₖ).\n\n" +
                            "• First term is a, common difference is d: a, a+d, a+2d, a+3d...\n" +
                            "• General nth Term Formula: aₙ = a + (n - 1)d\n" +
                            "• Sum of First n Terms: Sₙ = (n / 2) [2a + (n - 1)d] = (n / 2) [a + l] (where l is the last term aₙ).",
                    explanationHi = "समांतर श्रेढ़ी (AP) वह अनुक्रम है जिसमें दो क्रमागत पदों का अंतर (सार्व अंतर d = aₖ₊₁ - aₖ) सदैव समान रहता है।\n\n" +
                            "• प्रथम पद a, सार्व अंतर d: a, a+d, a+2d, a+3d...\n" +
                            "• nवाँ पद सूत्र: aₙ = a + (n - 1)d\n" +
                            "• प्रथम n पदों का योग: Sₙ = (n / 2) [2a + (n - 1)d] = (n / 2) [a + l] (जहाँ l अंतिम पद है)।",
                    formulaOrKeyFactEn = "nth Term: a_n = a + (n-1)d | Sum: S_n = (n/2)[2a + (n-1)d] = (n/2)[a + l]",
                    formulaOrKeyFactHi = "nवाँ पद: an = a + (n-1)d | योग: Sn = (n/2)[2a + (n-1)d] = (n/2)[a + l]",
                    realLifeAnalogyEn = "Salary increments of Rs 2,000 every year or building a staircase with uniform step heights follow an arithmetic progression.",
                    realLifeAnalogyHi = "हर साल वेतन में ₹2000 की निश्चित बढ़ोतरी या सीढ़ियों की समान ऊंचाई समांतर श्रेढ़ी का उदाहरण है।",
                    practiceQuestionEn = "Question: Find the 10th term of the AP: 2, 7, 12, 17...\nOptions: A) 47  B) 52  C) 42  D) 50\nCorrect Answer: Option A (a = 2, d = 5 => a10 = 2 + (10-1)5 = 2 + 45 = 47).",
                    practiceQuestionHi = "प्रश्न: AP: 2, 7, 12, 17... का 10वाँ पद ज्ञात कीजिए।\nविकल्प: A) 47  B) 52  C) 42  D) 50\nसही उत्तर: विकल्प A (a = 2, d = 5 => a10 = 2 + 9×5 = 47)।"
                )
            }

            // Mathematics Chapter 6: Triangles & Similarity
            q.contains("triangle") || q.contains("similarity") || q.contains("thales") || q.contains("bpt") ||
            q.contains("basic proportionality") || q.contains("त्रिभुज") || q.contains("समरूपता") || q.contains("थेल्स") -> {
                AutoChapterAnalysis(
                    chapterNumber = 6,
                    chapterTitle = "Triangles",
                    chapterTitleHi = "त्रिभुज",
                    subject = "Mathematics",
                    explanationEn = "Two triangles are similar (~) if their corresponding angles are equal and corresponding sides are proportional.\n\n" +
                            "• Basic Proportionality Theorem (BPT / Thales Theorem): If a line is drawn parallel to one side of a triangle intersecting the other two sides, it divides them in the same ratio: AD/DB = AE/EC.\n" +
                            "• Criteria for Similarity: AAA (Angle-Angle-Angle), SSS (Side-Side-Side), SAS (Side-Angle-Side).",
                    explanationHi = "दो त्रिभुज समरूप (~) होते हैं यदि उनके संगत कोण बराबर हों तथा संगत भुजाएं समानुपाती हों।\n\n" +
                            "• आधारभूत आनुपातिकता प्रमेय (थेल्स प्रमेय / BPT): यदि किसी त्रिभुज की एक भुजा के समानांतर अन्य दो भुजाओं को प्रतिच्छेद करती रेखा खींची जाए, तो वह उन भुजाओं को समान अनुपात में बांटती है: AD/DB = AE/EC।\n" +
                            "• समरूपता की कसौटियां: AAA, SSS, SAS।",
                    formulaOrKeyFactEn = "Thales BPT: DE || BC => AD/DB = AE/EC | Similarity: AAA, SSS, SAS",
                    formulaOrKeyFactHi = "थेल्स प्रमेय: DE || BC => AD/DB = AE/EC | समरूपता: AAA, SSS, SAS",
                    realLifeAnalogyEn = "Estimating the height of an Egyptian pyramid or a tall flagpole by measuring the ratio of its shadow to a walking stick uses triangle similarity.",
                    realLifeAnalogyHi = "सूरज की रोशनी में खंभे की छाया और छड़ी की छाया के अनुपात से खंभे की ऊंचाई निकालना समरूप त्रिभुज का उपयोग है।",
                    practiceQuestionEn = "Question: In triangle ABC, DE || BC. If AD = 1.5 cm, DB = 3 cm, and AE = 1 cm, find EC.\nOptions: A) 2 cm  B) 3 cm  C) 1.5 cm  D) 4 cm\nCorrect Answer: Option A (By BPT, AD/DB = AE/EC => 1.5/3 = 1/EC => EC = 2 cm).",
                    practiceQuestionHi = "प्रश्न: त्रिभुज ABC में DE || BC है। यदि AD = 1.5 cm, DB = 3 cm और AE = 1 cm है, तो EC का मान क्या होगा?\nविकल्प: A) 2 cm  B) 3 cm  C) 1.5 cm  D) 4 cm\nसही उत्तर: विकल्प A (थेल्स प्रमेय से AD/DB = AE/EC => 1.5/3 = 1/EC => EC = 2 cm)।"
                )
            }

            // Mathematics Chapter 7: Coordinate Geometry
            q.contains("coordinate") || q.contains("distance formula") || q.contains("section formula") ||
            q.contains("midpoint") || q.contains("निर्देशांक") || q.contains("दूरी सूत्र") || q.contains("विभाजन सूत्र") -> {
                AutoChapterAnalysis(
                    chapterNumber = 7,
                    chapterTitle = "Coordinate Geometry",
                    chapterTitleHi = "निर्देशांक ज्यामिति",
                    subject = "Mathematics",
                    explanationEn = "Coordinate geometry connects algebra and geometry using Cartesian plane coordinates (x, y).\n\n" +
                            "• Distance Formula: The distance between P(x₁, y₁) and Q(x₂, y₂) is d = √[(x₂ - x₁)² + (y₂ - y₁)²].\n" +
                            "• Section Formula: The point P(x, y) dividing line segment AB in ratio m₁:m₂ is: ((m₁x₂ + m₂x₁)/(m₁+m₂), (m₁y₂ + m₂y₁)/(m₁+m₂)).\n" +
                            "• Midpoint Formula: ((x₁ + x₂)/2, (y₁ + y₂)/2).",
                    explanationHi = "निर्देशांक ज्यामिति तल पर बिंदुओं की स्थिति दर्शाती है।\n\n" +
                            "• दूरी सूत्र: दो बिंदुओं P(x₁, y₁) और Q(x₂, y₂) के बीच की दूरी d = √[(x₂ - x₁)² + (y₂ - y₁)²]।\n" +
                            "• विभाजन सूत्र: रेखाखंड AB को m₁:m₂ अनुपात में विभाजित करने वाले बिंदु के निर्देशांक: ((m₁x₂ + m₂x₁)/(m₁+m₂), (m₁y₂ + m₂y₁)/(m₁+m₂))।\n" +
                            "• मध्य-बिंदु सूत्र: ((x₁ + x₂)/2, (y₁ + y₂)/2)।",
                    formulaOrKeyFactEn = "Distance: d = sqrt((x2-x1)^2 + (y2-y1)^2) | Midpoint: ((x1+x2)/2, (y1+y2)/2)",
                    formulaOrKeyFactHi = "दूरी सूत्र: d = √((x2-x1)² + (y2-y1)²) | मध्य-बिंदु: ((x1+x2)/2, (y1+y2)/2)",
                    realLifeAnalogyEn = "GPS mapping in Google Maps uses coordinate pairs (latitude, longitude) and distance formulas to calculate trip distances.",
                    realLifeAnalogyHi = "गूगल मैप्स पर दो शहरों के बीच की हवाई दूरी उनके निर्देशांकों (अक्षांश, देशांतर) और दूरी सूत्र से निकाली जाती है।",
                    practiceQuestionEn = "Question: What is the distance of point P(3, 4) from the origin (0, 0)?\nOptions: A) 5 units  B) 7 units  C) 25 units  D) 1 unit\nCorrect Answer: Option A (d = √(3² + 4²) = √(9 + 16) = √25 = 5 units).",
                    practiceQuestionHi = "प्रश्न: मूल बिंदु (0, 0) से बिंदु P(3, 4) की दूरी क्या है?\nविकल्प: A) 5 मात्रक  B) 7 मात्रक  C) 25 मात्रक  D) 1 मात्रक\nसही उत्तर: विकल्प A (दूरी = √(3² + 4²) = √25 = 5 मात्रक)।"
                )
            }

            // Mathematics Chapter 8 & 9: Trigonometry
            q.contains("trig") || q.contains("sin") || q.contains("cos") || q.contains("tan") ||
            q.contains("elevation") || q.contains("depression") || q.contains("height and distance") ||
            q.contains("त्रिकोणमिति") || q.contains("उन्नयन") || q.contains("अवनमन") -> {
                AutoChapterAnalysis(
                    chapterNumber = 8,
                    chapterTitle = "Introduction to Trigonometry",
                    chapterTitleHi = "त्रिकोणमिति का परिचय",
                    subject = "Mathematics",
                    explanationEn = "Trigonometry studies relationships between side lengths and angles of right-angled triangles.\n\n" +
                            "• Ratios: sin θ = Perpendicular/Hypotenuse, cos θ = Base/Hypotenuse, tan θ = Perpendicular/Base.\n" +
                            "• Fundamental Identities:\n" +
                            "  1. sin²θ + cos²θ = 1\n" +
                            "  2. 1 + tan²θ = sec²θ\n" +
                            "  3. 1 + cot²θ = cosec²θ\n" +
                            "• Key Angle Values: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, tan 45° = 1, tan 30° = 1/√3.",
                    explanationHi = "त्रिकोणमिति समकोण त्रिभुज की भुजाओं और कोणों के बीच संबंधों का अध्ययन है।\n\n" +
                            "• त्रिकोणमितीय अनुपात: sin θ = लम्ब/कर्ण, cos θ = आधार/कर्ण, tan θ = लम्ब/आधार।\n" +
                            "• सर्वसमिकाएं:\n" +
                            "  1. sin²θ + cos²θ = 1\n" +
                            "  2. 1 + tan²θ = sec²θ\n" +
                            "  3. 1 + cot²θ = cosec²θ\n" +
                            "• मुख्य मान: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, tan 45° = 1, tan 30° = 1/√3।",
                    formulaOrKeyFactEn = "sin^2(theta) + cos^2(theta) = 1 | 1 + tan^2(theta) = sec^2(theta) | tan 45 deg = 1",
                    formulaOrKeyFactHi = "sin²θ + cos²θ = 1 | 1 + tan²θ = sec²θ | tan 45° = 1",
                    realLifeAnalogyEn = "Civil engineers calculate the exact height of tall cellular towers and bridges using the angle of elevation and tan θ.",
                    realLifeAnalogyHi = "इंजीनियर मोबाइल टावर या मीनार की ऊंचाई जमीन से उन्नयन कोण और tan θ सूत्र की सहायता से नापते हैं।",
                    practiceQuestionEn = "Question: Evaluate: sin² 30° + cos² 30°.\nOptions: A) 1  B) 1/2  C) 0  D) 2\nCorrect Answer: Option A (By identity sin²θ + cos²θ = 1 for any angle θ; or (1/2)² + (√3/2)² = 1/4 + 3/4 = 1).",
                    practiceQuestionHi = "प्रश्न: मान ज्ञात कीजिए: sin² 30° + cos² 30°।\nविकल्प: A) 1  B) 1/2  C) 0  D) 2\nसही उत्तर: विकल्प A (सर्वसमिका sin²θ + cos²θ = 1 से, या (1/2)² + (√3/2)² = 1/4 + 3/4 = 1)।"
                )
            }

            // Mathematics Chapter 10: Circles
            q.contains("circle") || q.contains("tangent") || q.contains("radius") || q.contains("secant") ||
            q.contains("वृत्त") || q.contains("स्पर्श रेखा") -> {
                AutoChapterAnalysis(
                    chapterNumber = 10,
                    chapterTitle = "Circles",
                    chapterTitleHi = "वृत्त",
                    subject = "Mathematics",
                    explanationEn = "A circle is the locus of points equidistant from a center. A tangent touches the circle at exactly one point.\n\n" +
                            "• Theorem 10.1: The tangent at any point of a circle is perpendicular to the radius through the point of contact (OP ⊥ PT).\n" +
                            "• Theorem 10.2: The lengths of tangents drawn from an external point to a circle are equal (PQ = PR).\n" +
                            "• A line intersecting a circle at two points is called a secant.",
                    explanationHi = "वृत्त तल के उन बिंदुओं का समूह है जो निश्चित केंद्र से समान दूरी पर होते हैं। स्पर्श रेखा वृत्त को केवल एक बिंदु पर छूती है।\n\n" +
                            "• प्रमेय 10.1: वृत्त के किसी बिंदु पर स्पर्श रेखा स्पर्श बिंदु से जाने वाली त्रिज्या पर लंब होती है (OP ⊥ PT)।\n" +
                            "• प्रमेय 10.2: बाह्य बिंदु से वृत्त पर खींची गई स्पर्श रेखाओं की लंबाइयां बराबर होती हैं (PQ = PR)।\n" +
                            "• वृत्त को दो बिंदुओं पर काटने वाली रेखा छेदक रेखा (Secant) कहलाती है।",
                    formulaOrKeyFactEn = "Tangent Perpendicular to Radius: OP _|_ PT | Tangents from External Point: PQ = PR",
                    formulaOrKeyFactHi = "स्पर्श रेखा त्रिज्या पर लंब: OP ⊥ PT | बाह्य बिंदु से स्पर्श रेखाएं: PQ = PR",
                    realLifeAnalogyEn = "A rolling bicycle wheel makes contact with flat asphalt at a single point, forming a tangent perpendicular to the radius spoke.",
                    realLifeAnalogyHi = "सड़क पर घूमता हुआ साइकिल का पहिया जमीन को एक स्पर्श रेखा की भांति छूता है।",
                    practiceQuestionEn = "Question: If tangents PA and PB from point P to a circle with centre O are inclined to each other at 80°, find angle POA.\nOptions: A) 50°  B) 60°  C) 70°  D) 80°\nCorrect Answer: Option A (Angle AOB = 180° - 80° = 100° => Angle POA = 100° / 2 = 50°).",
                    practiceQuestionHi = "प्रश्न: यदि बाह्य बिंदु P से वृत्त पर खींची गई स्पर्श रेखाएं PA और PB परस्पर 80° के कोण पर झुकी हों, तो कोण POA का मान क्या होगा?\nविकल्प: A) 50°  B) 60°  C) 70°  D) 80°\nसही उत्तर: विकल्प A (कोण AOB = 180° - 80° = 100° => कोण POA = 100° ÷ 2 = 50°)।"
                )
            }

            // Mathematics Chapter 12: Surface Areas and Volumes
            q.contains("surface area") || q.contains("volume") || q.contains("cylinder") || q.contains("cone") ||
            q.contains("sphere") || q.contains("hemisphere") || q.contains("क्षेत्रफल") || q.contains("आयतन") ||
            q.contains("बेलन") || q.contains("शंकु") || q.contains("गोला") -> {
                AutoChapterAnalysis(
                    chapterNumber = 12,
                    chapterTitle = "Surface Areas and Volumes",
                    chapterTitleHi = "पृष्ठीय क्षेत्रफल एवं आयतन",
                    subject = "Mathematics",
                    explanationEn = "Covers surface areas and volumes of 3D solids and their combinations:\n\n" +
                            "• Right Circular Cylinder: Curved Surface = 2πrh, Total Surface = 2πr(r + h), Volume = πr²h.\n" +
                            "• Right Circular Cone: Slant height l = √(r² + h²), Curved Surface = πrl, Volume = (1/3) πr²h.\n" +
                            "• Sphere: Surface Area = 4πr², Volume = (4/3) πr³.\n" +
                            "• Hemisphere: Curved Surface = 2πr², Total Surface = 3πr², Volume = (2/3) πr³.",
                    explanationHi = "ठोस आकृतियों और उनके संयोजनों के पृष्ठीय क्षेत्रफल एवं आयतन:\n\n" +
                            "• बेलन (Cylinder): वक्र पृष्ठ = 2πrh, कुल पृष्ठ = 2πr(r + h), आयतन = πr²h।\n" +
                            "• शंकु (Cone): तिर्यक ऊंचाई l = √(r² + h²), वक्र पृष्ठ = πrl, आयतन = (1/3) πr²h।\n" +
                            "• गोला (Sphere): पृष्ठीय क्षेत्रफल = 4πr², आयतन = (4/3) πr³।\n" +
                            "• अर्धगोला: वक्र पृष्ठ = 2πr², कुल पृष्ठ = 3πr², आयतन = (2/3) πr³।",
                    formulaOrKeyFactEn = "Cylinder: V = pi*r^2*h | Cone: V = (1/3)pi*r^2*h | Sphere: V = (4/3)pi*r^3, A = 4pi*r^2",
                    formulaOrKeyFactHi = "बेलन आयतन = πr²h | शंकु आयतन = (1/3)πr²h | गोला आयतन = (4/3)πr³ | पृष्ठीय = 4πr²",
                    realLifeAnalogyEn = "Determining how many liters of water can fit in an overhead cylindrical rooftop tank uses V = πr²h (1 m³ = 1000 L).",
                    realLifeAnalogyHi = "छत पर रखी पानी की टंकी में कितने लीटर पानी आएगा, यह बेलन के आयतन सूत्र V = πr²h से निकाला जाता है।",
                    practiceQuestionEn = "Question: If radius of a sphere is 7 cm, find its surface area (use π = 22/7).\nOptions: A) 616 cm²  B) 308 cm²  C) 154 cm²  D) 1232 cm²\nCorrect Answer: Option A (Area = 4πr² = 4 × (22/7) × 7 × 7 = 616 cm²).",
                    practiceQuestionHi = "प्रश्न: यदि एक गोले की त्रिज्या 7 सेमी है, तो इसका पृष्ठीय क्षेत्रफल क्या होगा? (π = 22/7 लें)\nविकल्प: A) 616 cm²  B) 308 cm²  C) 154 cm²  D) 1232 cm²\nसही उत्तर: विकल्प A (क्षेत्रफल = 4πr² = 4 × (22/7) × 7 × 7 = 616 cm²)।"
                )
            }

            // Mathematics Chapter 13 & 14: Statistics and Probability
            q.contains("statistics") || q.contains("mean") || q.contains("median") || q.contains("mode") ||
            q.contains("probability") || q.contains("dice") || q.contains("card") || q.contains("सांख्यिकी") ||
            q.contains("माध्य") || q.contains("माध्यिका") || q.contains("बहुलक") || q.contains("प्रायिकता") -> {
                AutoChapterAnalysis(
                    chapterNumber = 13,
                    chapterTitle = "Statistics and Probability",
                    chapterTitleHi = "सांख्यिकी एवं प्रायिकता",
                    subject = "Mathematics",
                    explanationEn = "Deals with central tendencies of grouped data and numerical measure of likelihood.\n\n" +
                            "• Direct Mean: x̄ = Σ(fᵢxᵢ) / Σfᵢ\n" +
                            "• Empirical Relationship: 3 Median = Mode + 2 Mean\n" +
                            "• Theoretical Probability: P(E) = Number of outcomes favorable to E / Total number of possible outcomes.\n" +
                            "• Properties: 0 ≤ P(E) ≤ 1. Sure event P(E) = 1; impossible event P(E) = 0. P(E) + P(not E) = 1.",
                    explanationHi = "आंकड़ों के केंद्रीय प्रवृत्ति के माप और घटनाओं के घटित होने की संभावना:\n\n" +
                            "• प्रत्यक्ष विधि से माध्य: x̄ = Σ(fᵢxᵢ) / Σfᵢ\n" +
                            "• आनुभविक संबंध: 3 माध्यिका = बहुलक + 2 माध्य\n" +
                            "• प्रायिकता: P(E) = घटना E के अनुकूल परिणामों की संख्या / सभी संभव परिणामों की कुल संख्या।\n" +
                            "• गुणधर्म: 0 ≤ P(E) ≤ 1। निश्चित घटना की प्रायिकता 1 तथा असंभव घटना की 0 होती है। P(E) + P(E नहीं) = 1।",
                    formulaOrKeyFactEn = "3 Median = Mode + 2 Mean | P(E) = Favorable / Total | 0 <= P(E) <= 1",
                    formulaOrKeyFactHi = "3 माध्यिका = बहुलक + 2 माध्य | P(E) = अनुकूल परिणाम / कुल परिणाम | 0 <= P(E) <= 1",
                    realLifeAnalogyEn = "Predicting whether an unbiased coin lands heads (1/2) or forecasting a 60% probability of rainfall uses probability principles.",
                    realLifeAnalogyHi = "सिक्का उछालने पर हेड आने की 50% संभावना या मौसम का पूर्वानुमान प्रायिकता का दैनिक उदाहरण है।",
                    practiceQuestionEn = "Question: What is the probability of getting a number greater than 4 in a single roll of a fair die?\nOptions: A) 1/3  B) 1/2  C) 2/3  D) 1/6\nCorrect Answer: Option A (Favorable outcomes are 5 and 6 => 2/6 = 1/3).",
                    practiceQuestionHi = "प्रश्न: एक पासे को एक बार फेंकने पर 4 से बड़ी संख्या आने की प्रायिकता क्या है?\nविकल्प: A) 1/3  B) 1/2  C) 2/3  D) 1/6\nसही उत्तर: विकल्प A (अनुकूल परिणाम 5 और 6 हैं => 2/6 = 1/3)।"
                )
            }

            // Default fallback
            else -> {
                AutoChapterAnalysis(
                    chapterNumber = 1,
                    chapterTitle = "Chemical Reactions and Equations",
                    chapterTitleHi = "रासायनिक अभिक्रियाएं एवं समीकरण",
                    subject = "Science",
                    explanationEn = "Based on verified NCERT curriculum:\n\n" +
                            "1. Core Definition: Chemical reactions occur when bonds break and form to create new substances.\n" +
                            "2. Principles & Formulas: Equations are balanced in accordance with the Law of Conservation of Mass.\n" +
                            "3. Everyday Application: Chemical transformations occur continuously in nature, including digestion and cellular respiration.",
                    explanationHi = "NCERT कक्षा 10 विज्ञान पाठ्यक्रम के आधार पर:\n\n" +
                            "1. मूलभूत परिभाषा: पदार्थ रासायनिक क्रिया द्वारा नए उत्पाद बनाते हैं।\n" +
                            "2. नियम व सूत्र: द्रव्यमान संरक्षण के नियम के अनुसार समीकरण को संतुलित किया जाता है।\n" +
                            "3. अनुप्रयोग: दैनिक जीवन में रासायनिक परिवर्तन निरंतर होते रहते हैं।",
                    formulaOrKeyFactEn = "NCERT Class 10 Science Core Curriculum",
                    formulaOrKeyFactHi = "NCERT कक्षा 10 विज्ञान मुख्य पाठ्यक्रम",
                    realLifeAnalogyEn = "Digestion of food inside our body is a continuous biochemical reaction.",
                    realLifeAnalogyHi = "दैनिक जीवन में भोजन का पचना भी एक रासायनिक अभिक्रिया है।"
                )
            }
        }
    }
}
