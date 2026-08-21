import type { Case } from "../types";

export const dkaReyes: Case = {
  id: "dka-reyes",
  title: "22F — vomiting since yesterday",
  chiefComplaint: "I've been throwing up since yesterday and I can't keep anything down.",
  difficulty: "intro",
  specialty: "Emergency Medicine",

  patient: {
    name: "Aaliyah Reyes",
    age: 22,
    gender: "female",
    persona: `A college student in exam season, exhausted and nauseated. She wants to sleep and
gives short answers because talking is an effort. She is slightly slow to respond — she has to
think before she answers — but she is oriented and knows where she is.
She has been telling herself for three weeks that she is just stressed and dehydrated, and she
will say so if asked what she thinks is going on. She will NOT mention the thirst, the urination,
or the weight loss unless specifically asked, because she does not connect them to the vomiting.
Her roommate had a stomach bug two weeks ago and she will offer that if asked about sick contacts.`,
    vitals: {
      hr: "124 bpm",
      bp: "102/64 mmHg",
      rr: "28 /min",
      temp: "36.8 °C",
      spo2: "99% on room air",
    },
  },

  hidden: {
    diagnosis: "Diabetic ketoacidosis, presenting as new-onset type 1 diabetes",
    narrative: `Aaliyah has severe DKA as the first presentation of type 1 diabetes.
Three weeks of osmotic symptoms she rationalised as exam stress, then decompensation over 24 hours.
The teaching point is that the diagnosis costs five dollars and one minute — a fingerstick glucose —
and is routinely missed because vomiting plus a sick contact reads as gastroenteritis. Her deep
Kussmaul respirations get charted as "anxious" or "hyperventilating". Her potassium is high on
arrival despite profound total-body potassium depletion, and she will arrest if insulin goes in
before that is understood.`,
    history: `- Vomiting since yesterday morning, about eight times. Cannot keep water down.
- Diffuse crampy abdominal pain, no particular location. No rebound.
- NO diarrhoea at all. This matters and she will say so plainly if asked.
- For about three weeks: drinking constantly, "gallons", always thirsty.
- Getting up four or five times a night to urinate, which is new.
- Lost about 12 pounds in a month without trying. She assumed it was stress and skipped meals.
- Vision has gone blurry on and off for the past two weeks. She blamed screen time.
- Profoundly tired, "like I got hit by a bus", for a couple of weeks.
- No fever, no chills.
- Her roommate had a stomach bug about two weeks ago; Aaliyah did not get sick at the time.
- No recent travel, no unusual food.
- Maternal aunt has type 1 diabetes. Grandmother has type 2.
- Last period a week ago, on time. Not sexually active in the last six months. No chance of pregnancy.
- Occasional alcohol, socially. No recreational drugs. No regular medications.`,
    examFindings: {
      general:
        "Ill-appearing and drowsy. Dry cracked lips, dry mucous membranes, eyes appear sunken. There is a distinctly sweet, acetone-like odour on her breath.",
      respiratory:
        "Deep, slow, sighing respirations at a rate of 28 — Kussmaul breathing. Lungs clear to auscultation. No wheeze or crackles.",
      cardiovascular:
        "Tachycardic at 124, regular. Capillary refill 3 seconds. Peripheries cool. No murmur.",
      abdomen:
        "Diffusely tender to palpation without focal point. NO rebound and NO guarding. Bowel sounds present and normal.",
      neurological:
        "Drowsy but rousable and oriented to person, place and time. Slow to answer. No focal deficit. No neck stiffness.",
      skin: "Poor skin turgor. No rash, no cellulitis, no foot ulcer.",
    },
  },

  orderables: [
    {
      id: "glucose_poc",
      name: "Fingerstick Glucose",
      category: "bedside",
      turnaroundMin: 1,
      costUsd: 5,
      abnormal: true,
      result: 'Reads "HI" — above the meter\'s 600 mg/dL ceiling.',
    },
    {
      id: "vbg",
      name: "Venous Blood Gas",
      category: "lab",
      turnaroundMin: 10,
      costUsd: 80,
      abnormal: true,
      result:
        "pH 7.08, pCO2 18 mmHg, HCO3 6 mmol/L. Severe high-anion-gap metabolic acidosis with respiratory compensation.",
    },
    {
      id: "bmp",
      name: "Basic Metabolic Panel",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 35,
      abnormal: true,
      result:
        "Na 129 (corrected 137), K 5.6, Cl 96, HCO3 6, BUN 32, Cr 1.4, glucose 642. Anion gap 27.",
    },
    {
      id: "ketones",
      name: "Serum Beta-Hydroxybutyrate",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 65,
      abnormal: true,
      result: "6.8 mmol/L (ref <0.6). Markedly elevated.",
    },
    {
      id: "urinalysis",
      name: "Urinalysis",
      category: "lab",
      turnaroundMin: 30,
      costUsd: 25,
      abnormal: true,
      result:
        "Glucose 4+, ketones 3+. Nitrites negative, leukocyte esterase negative, no bacteria. No evidence of urinary infection.",
    },
    {
      id: "cbc",
      name: "Complete Blood Count",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 30,
      abnormal: true,
      result:
        "WBC 16.2 with neutrophil predominance, Hgb 15.1, Plt 340. The leukocytosis is a stress response to ketoacidosis, not proof of infection.",
    },
    {
      id: "hba1c",
      name: "HbA1c",
      category: "lab",
      turnaroundMin: 120,
      costUsd: 45,
      abnormal: true,
      result: "12.4%. Reflects months of untreated hyperglycemia.",
    },
    {
      id: "ecg",
      name: "12-lead ECG",
      category: "ecg",
      turnaroundMin: 5,
      costUsd: 50,
      abnormal: true,
      result:
        "Sinus tachycardia at 124. Peaked T waves in the precordial leads consistent with hyperkalemia. No ischemic ST changes.",
    },
    {
      id: "lipase",
      name: "Lipase",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 40,
      abnormal: true,
      result:
        "182 U/L (ref <60). Mildly elevated. Non-specific — lipase is frequently raised in DKA without pancreatitis.",
    },
    {
      id: "preg_test",
      name: "Urine Pregnancy Test",
      category: "lab",
      turnaroundMin: 10,
      costUsd: 15,
      result: "Negative.",
    },
    {
      id: "ct_abdomen",
      name: "CT Abdomen/Pelvis with contrast",
      category: "imaging",
      turnaroundMin: 90,
      costUsd: 1200,
      result:
        "Normal appendix. No obstruction, no free air, no inflammatory change. Pancreas normal. No acute finding.",
    },
    {
      id: "stool_studies",
      name: "Stool Culture & PCR Panel",
      category: "lab",
      turnaroundMin: 240,
      costUsd: 220,
      result: "No specimen obtainable — the patient has not had diarrhoea.",
    },
    {
      id: "cxr",
      name: "Chest X-ray",
      category: "imaging",
      turnaroundMin: 30,
      costUsd: 120,
      result: "Clear lung fields. No consolidation. Normal cardiac silhouette.",
    },
  ],

  rubric: {
    mustAsk: [
      {
        id: "polyuria_polydipsia",
        label: "Thirst and urinary frequency",
        why: "Three weeks of osmotic symptoms is the entire diagnosis, and she will never volunteer it — she came in about vomiting and does not connect the two. One question converts a gastroenteritis workup into a DKA workup.",
      },
      {
        id: "weight_loss",
        label: "Unintentional weight loss",
        why: "Twelve pounds in a month in a 22-year-old is never benign. Together with polyuria it is type 1 diabetes until proven otherwise.",
      },
      {
        id: "diarrhea",
        label: "Diarrhoea — specifically its absence",
        why: "Vomiting without diarrhoea should make you suspicious of gastroenteritis as a label. Asking the question and getting a clear 'no' is what breaks the anchor.",
      },
      {
        id: "family_history",
        label: "Family history of diabetes or autoimmune disease",
        why: "A maternal aunt with type 1 raises her pre-test probability substantially.",
      },
      {
        id: "vision",
        label: "Visual changes",
        why: "Intermittent blurred vision from osmotic lens shifts is a classic and underasked feature of new hyperglycemia.",
      },
      {
        id: "pregnancy",
        label: "Pregnancy status",
        why: "Standard in any woman of reproductive age with vomiting, and euglycemic DKA in pregnancy behaves differently.",
      },
    ],
    mustOrder: ["glucose_poc", "vbg", "bmp", "ketones"],
    shouldNotOrder: ["ct_abdomen", "stool_studies"],
    redFlags: [
      {
        id: "kussmaul",
        label: "Respiratory rate of 28 with deep sighing breaths",
        why: "This is Kussmaul respiration compensating for a pH of 7.08 — not anxiety and not hyperventilation. Sedating or reassuring this patient instead of treating the acidosis would be catastrophic.",
      },
      {
        id: "potassium",
        label: "Potassium 5.6 with total-body potassium depletion",
        why: "The number looks reassuringly high because acidosis has driven potassium extracellularly. Give insulin and it will crash. Potassium must be checked before insulin starts, and replaced first if it is below 3.3.",
      },
      {
        id: "glucose_cost",
        label: "The diagnosis cost $5 and one minute",
        why: "If your workup reached a CT abdomen before it reached a fingerstick glucose, the problem is the order of your thinking, not your knowledge.",
      },
    ],
    correctDiagnosis: "Diabetic ketoacidosis, new-onset type 1 diabetes mellitus",
    acceptableDifferential: [
      "Diabetic ketoacidosis",
      "New-onset diabetes mellitus",
      "Hyperosmolar hyperglycemic state",
      "Gastroenteritis",
      "Starvation or alcoholic ketoacidosis",
      "Pancreatitis",
      "Appendicitis",
      "Salicylate toxicity",
    ],
    keyManagement: [
      "Isotonic IV fluid resuscitation FIRST — she is 8–10% volume depleted, and fluids alone will drop her glucose substantially",
      "Check potassium BEFORE starting insulin. If K < 3.3, replace potassium first and hold insulin — this is the step that kills patients",
      "Insulin infusion at roughly 0.1 units/kg/hr once fluids are running and potassium is known; a bolus is not required",
      "Add dextrose to the fluids once glucose falls below ~200 mg/dL and CONTINUE the insulin — you are treating ketoacidosis, not the glucose number",
      "Track anion gap closure, not glucose, as your marker of resolution. Hourly glucose, electrolytes every 2–4 hours",
      "Do not give bicarbonate at this pH — it is not indicated at 7.08 and carries real harms",
      "Search for a precipitant, but recognise that here the precipitant is the new diagnosis itself, not sepsis",
      "Endocrinology involvement, and structured diabetes education before discharge — this is a life-altering diagnosis for a 22-year-old and the discharge conversation matters as much as the insulin",
    ],
  },
};
