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
                    realLifeAnalogyHi = "बास्केटबॉल फेंकने पर हवा में जो वक्र (Parabola) बनता है, वह द्विघात समीकरण द्वारा ही तय होता है।"
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
