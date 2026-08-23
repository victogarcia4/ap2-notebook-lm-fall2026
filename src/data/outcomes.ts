import { LearningOutcome } from '../types';

export const hapsOutcomes: Record<string, LearningOutcome[]> = {
  exam1: [
    { id: "AP-19-J-01-01", chap: "13", topic: "Endocrine", desc: "Describe the general functions of the endocrine system and relate it to communication speed." },
    { id: "AP-19-J-03-02", chap: "13", topic: "Endocrine", desc: "Describe mechanisms of action of water-soluble vs lipid-soluble hormones." },
    { id: "AP-19-J-05-02", chap: "13", topic: "Endocrine", desc: "List pituitary hormones (anterior/posterior) and summarize their target organs and physiological impact." },
    { id: "AP-19-J-08-01", chap: "13", topic: "Endocrine", desc: "Describe location, histology, zones, and physiological functions of cortical/medullary adrenal hormones." },
    { id: "AP-19-K-01-01", chap: "14", topic: "Blood", desc: "List the general functions of blood (transport, regulation, protection) and physiological ranges." },
    { id: "AP-19-K-03-01", chap: "14", topic: "Blood", desc: "Describe structure, function, and development (erythropoiesis) of mature red blood cells." },
    { id: "AP-19-K-06-01", chap: "14", topic: "Blood", desc: "Detail the steps of hemostasis: vascular spasm, platelet plug, and coagulation cascades." },
    { id: "AP-19-K-07-01", chap: "14", topic: "Blood", desc: "Predict which blood types are compatible and what happens when the incorrect ABO or Rh blood type is transfused." },
    { id: "AP-19-L-03-02", chap: "15", topic: "Cardio: Heart", desc: "Trace systemic, pulmonary, and coronary pathways of blood flow through specific chambers & valves." },
    { id: "AP-19-L-05-01", chap: "15", topic: "Cardio: Heart", desc: "Identify components of the intrinsic cardiac conduction system and relate them to pacemaking." },
    { id: "AP-19-L-07-01", chap: "15", topic: "Cardio: Heart", desc: "Define cardiac output, stroke volume, heart rate, and relate factors affecting preload/afterload." },
    { id: "AP-19-M-01-01", chap: "15", topic: "Cardio: Vessels", desc: "Contrast histological layers and functions of elastic/muscular arteries, arterioles, and venules." },
    { id: "AP-19-M-03-01", chap: "15", topic: "Cardio: Vessels", desc: "Explain fluid mechanics of blood flow, blood pressure gradient, and peripheral vascular resistance." },
    { id: "AP-19-M-04-01", chap: "15", topic: "Cardio: Vessels", desc: "Describe baroreceptor and chemoreceptor reflex pathways regulating systemic blood pressure." }
  ],
  exam2: [
    { id: "AP-19-N-01-01", chap: "16", topic: "Lymphatic", desc: "Describe the structural outline, drainage, and volume-clearing role of the lymphatic system." },
    { id: "AP-19-N-02-01", chap: "16", topic: "Lymphatic", desc: "Summarize anatomy and lymphoid roles of lymph nodes, spleen, red bone marrow, and thymus." },
    { id: "AP-19-N-03-01", chap: "16", topic: "Lymphatic", desc: "Compare and contrast innate (nonspecific) defenses with adaptive (specific) adaptive immunity." },
    { id: "AP-19-N-04-02", chap: "16", topic: "Immunity", desc: "Describe mechanisms of phagocytosis, NK cell surveillance, fever induction, and chemical inflammation." },
    { id: "AP-19-N-08-01", chap: "16", topic: "Immunity", desc: "Describe cell-mediated activation pathways involving MHC-I/II proteins, Helper & Cytotoxic T cells." },
    { id: "AP-19-N-09-02", chap: "16", topic: "Immunity", desc: "Contrast structures, classes (IgG, IgM, IgA, IgE, IgD) and neutralization mechanisms of antibodies." },
    { id: "AP-19-O-01-01", chap: "19", topic: "Respiratory", desc: "Describe structural pathways from nasal passages down to standard terminal bronchial segments." },
    { id: "AP-19-O-05-01", chap: "19", topic: "Respiratory", desc: "Examine microscopic anatomy, cellular compositions, and properties of the respiratory membrane." },
    { id: "AP-19-O-07-01", chap: "19", topic: "Respiratory", desc: "Apply Boyle's, Dalton's, and Henry's ideal gas laws to active ventilation and tissue exchange." },
    { id: "AP-19-O-07-02", chap: "19", topic: "Respiratory", desc: "Explain physical pressure differentials and muscle activations for quiet vs forced inspiration." },
    { id: "AP-19-O-10-01", chap: "19", topic: "Respiratory", desc: "Describe carbaminohemoglobin and bicarbonate buffer mechanisms transporting CO2 in plasma." },
    { id: "AP-19-O-11-01", chap: "19", topic: "Respiratory", desc: "Examine central/peripheral chemoreceptor controls regulating rate & depth of alveolar ventilation." }
  ],
  exam3: [
    { id: "AP-19-P-01-01", chap: "17", topic: "Digestive", desc: "List organs of the gastrointestinal tract and define ingestion, propulsion, mechanical digestion." },
    { id: "AP-19-P-02-01", chap: "17", topic: "Digestive", desc: "Contrast the basic histological layers of the canal: mucosa, submucosa, muscularis, and serosa." },
    { id: "AP-19-P-06-01", chap: "17", topic: "Digestive", desc: "Describe anatomy, gastric pits, cells (parietal, chief, G-cells) and chemical actions of stomach juices." },
    { id: "AP-19-P-08-01", chap: "17", topic: "Digestive", desc: "Explain the accessory biliary pipeline: liver lobule flow, gallbladder storage, and pancreatic enzymes." },
    { id: "AP-19-P-09-01", chap: "17", topic: "Digestive", desc: "Trace chemical breakdown and standard symport/facilitated absorption of carbohydrates and proteins." },
    { id: "AP-19-P-11-01", chap: "17", topic: "Digestive", desc: "Explain neural (myenteric) and hormonal (gastrin, CCK, secretin) phases of gastric and duodenal control." },
    { id: "AP-19-Q-01-01", chap: "18", topic: "Metabolism", desc: "Define cellular metabolism, contrasting energetic requirements of anabolism vs catabolic pathways." },
    { id: "AP-19-Q-02-01", chap: "18", topic: "Metabolism", desc: "Detail net yields, cellular locations, and mechanisms of Glycolysis, Citric Acid Cycle, and ETC." },
    { id: "AP-19-Q-04-01", chap: "18", topic: "Metabolism", desc: "Describe lipid pathways: cellular beta-oxidation, lipogenesis, and dangerous ketone body generation." },
    { id: "AP-19-Q-06-01", chap: "18", topic: "Metabolism", desc: "Contrast systemic hormone distributions during absorptive (insulin) vs post-absorptive (glucagon) states." },
    { id: "AP-19-Q-07-01", chap: "18", topic: "Metabolism", desc: "Describe hypothalamic set-points, shivering, vasodilation, and core thermal feedback." },
    { id: "AP-19-Q-09-01", chap: "18", topic: "Metabolism", desc: "Summarize nutritional requirements, classifications, and systemic functions of essential vitamins & minerals." }
  ],
  exam4: [
    { id: "AP-19-R-01-01", chap: "21", topic: "Urinary", desc: "Identify the organs of the urinary system and outline their primary blood-filtering roles." },
    { id: "AP-19-R-05-01", chap: "21", topic: "Urinary", desc: "Contrast structure and local microvascular loops of cortical vs juxtamedullary nephrons." },
    { id: "AP-19-R-06-01", chap: "21", topic: "Urinary", desc: "Define renal mechanisms: glomerular filtration, tubular reabsorption, and active secretion." },
    { id: "AP-19-R-07-01", chap: "21", topic: "Urinary", desc: "Analyze structural layers of the filtration membrane and local pressures establishing net GFR." },
    { id: "AP-19-R-08-01", chap: "21", topic: "Urinary", desc: "Describe active transport and osmolarity changes in PCT, thin/thick limbs of Loop of Henle, and DCT." },
    { id: "AP-19-R-09-01", chap: "21", topic: "Urinary", desc: "Detail the countercurrent multiplier and urea trapping mechanisms forming concentrated urine under ADH." },
    { id: "AP-19-R-12-01", chap: "21", topic: "Urinary", desc: "Detail mechanical steps and autonomic pathways of the micturition reflex." },
    { id: "AP-19-S-01-01", chap: "20", topic: "Fluid/Acid-Base", desc: "Map approximate volumes and fundamental ion balances of ICF, interstitial fluid, and blood plasma." },
    { id: "AP-19-S-02-01", chap: "20", topic: "Fluid/Acid-Base", desc: "Summarize thirst triggers (hypothalamic osmoreceptors, blood pressure drop) and systemic ADH output." },
    { id: "AP-19-S-03-01", chap: "20", topic: "Fluid/Acid-Base", desc: "Describe cellular impacts and hormonal control of hypernatremia, hyponatremia, and hyperkalemia." },
    { id: "AP-19-S-04-02", chap: "20", topic: "Fluid/Acid-Base", desc: "Describe molecular behavior of bicarbonate, phosphate, and protein buffer systems." },
    { id: "AP-19-S-04-03", chap: "20", topic: "Fluid/Acid-Base", desc: "Contrast speed and efficiency of respiratory compensation vs renal excretion of acid load." },
    { id: "AP-19-S-05-01", chap: "20", topic: "Fluid/Acid-Base", desc: "Diagnose arterial blood gas values to identify respiratory acidosis/alkalosis with metabolic compensation." }
  ],
  exam5: [
    { id: "AP-19-T-01-01", chap: "22", topic: "Reproduction", desc: "Describe anatomical relationships of testes, epididymis, vas deferens, and accessory semen glands." },
    { id: "AP-19-T-01-02", chap: "22", topic: "Reproduction", desc: "Describe stages of spermatogenesis, meiosis, blood-testis barrier, and Sertoli/Leydig cell signals." },
    { id: "AP-19-T-02-01", chap: "22", topic: "Reproduction", desc: "Describe ovaries, uterine tube, uterus structure, and histological layers of endometrium." },
    { id: "AP-19-T-02-02", chap: "22", topic: "Reproduction", desc: "Trace follicle development, steps of oogenesis, and contrast meiosis halts in oocytes vs spermatids." },
    { id: "AP-19-T-02-03", chap: "22", topic: "Reproduction", desc: "Correlate ovarian cycle changes (follicular, luteal) with uterine cycle (menstrual, secretory) under LH/FSH." },
    { id: "AP-19-T-03-01", chap: "23", topic: "Development", desc: "Define gastrulation timeline and structural formation of primitive streak, node, and blastopore." },
    { id: "AP-19-T-03-02", chap: "23", topic: "Development", desc: "Identify germ layers (ectoderm, mesoderm, endoderm) and map three specific adult organ systems from each." },
    { id: "AP-19-T-03-04", chap: "23", topic: "Development", desc: "Explain steps of neurulation, including neural crest migration and timing of anterior/posterior pore closure." },
    { id: "AP-19-T-04-01", chap: "23", topic: "Development", desc: "Detail fertilization steps: acrosomal reaction, plasma fusion, fast and slow blocks to polyspermy." },
    { id: "AP-19-T-05-02", chap: "23", topic: "Development", desc: "Describe embryogenesis of chorion, amnion, allantois, yolk sac, and functional syncytiotrophoblast roles." },
    { id: "AP-19-T-08-01", chap: "23", topic: "Development", desc: "Describe hormonal shifts (estrogen/progesterone ratio, oxytocin, prostaglandins) initiating three stages of labor." },
    { id: "AP-19-T-11-01", chap: "24", topic: "Genetics", desc: "Define homozygous, heterozygous, genotype, phenotype, allele variation, dominant and recessive genes." },
    { id: "AP-19-T-11-02", chap: "24", topic: "Genetics", desc: "Solve cross combinations of autosomes, sex-linked traits, incomplete dominance, and codominance via Punnett grids." }
  ]
};
