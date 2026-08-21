import type { Case } from "../types";

export const peOkafor: Case = {
  id: "pe-okafor",
  title: "34F — shortness of breath",
  chiefComplaint:
    "I can't catch my breath, and it hurts in my chest when I breathe in.",
  difficulty: "core",
  specialty: "Emergency Medicine",

  patient: {
    name: "Maya Okafor",
    age: 34,
    gender: "female",
    persona: `Anxious but articulate. A graphic designer, used to being dismissed by doctors.
She has had panic attacks before and someone in triage already suggested this might be anxiety,
which has made her doubt herself — if asked whether she thinks it's anxiety, she'll say
"maybe? everyone keeps saying that" even though this feels different to her.
She answers what she is asked and does not volunteer. She will not mention the flight,
the birth control pill, or her sore calf unless specifically asked about travel, medications,
or her legs. She describes her leg as "I think I pulled something" if asked.
She is short of breath, so she speaks in shorter sentences than she otherwise would.`,
    vitals: {
      hr: "112 bpm",
      bp: "118/74 mmHg",
      rr: "24 /min",
      temp: "37.4 °C",
      spo2: "91% on room air",
    },
  },

  hidden: {
    diagnosis: "Acute submassive (intermediate-risk) pulmonary embolism",
    narrative: `Maya has a submassive PE with evidence of right ventricular strain
(elevated troponin, RV dilation on echo) originating from an occlusive right popliteal DVT.
Provoked by a 14-hour flight 5 days ago plus 6 years of combined oral contraceptive use.
The teaching point is the anchoring trap: tachycardia, tachypnea, chest pain and a history of
panic attacks in a young woman get labelled anxiety, and the hypoxia gets missed.`,
    history: `- Symptoms began suddenly 2 days ago, while she was sitting at her desk.
- Right-sided chest pain, sharp, clearly worse on deep inspiration and on coughing. Not exertional.
- Breathlessness is constant, worse on walking up her stairs, which is new for her.
- Returned 5 days ago from Lagos — a 14-hour flight, window seat, she barely got up.
- Takes a combined oral contraceptive pill, has for about 6 years. No other medications.
- Right calf has felt "tight and sore" for about 4 days. She assumed she pulled it hauling luggage.
- Mild dry cough. No hemoptysis. No fever or chills. No sputum.
- Smokes socially, about 3 cigarettes a week.
- No prior clots herself. Her mother had "a clot in her leg" after a hip operation.
- Last menstrual period 2 weeks ago, on schedule. Not pregnant, no chance of pregnancy.
- No recent surgery, no immobilisation other than the flight, no known cancer.
- History of panic attacks in her twenties, treated with therapy, none in about 4 years.
  She insists this does not feel like those did.`,
    examFindings: {
      general:
        "Alert, uncomfortable, visibly working slightly to breathe. Speaking in short sentences.",
      cardiovascular:
        "Tachycardic at 112, regular rhythm. No murmur. JVP mildly elevated. Peripheries warm.",
      respiratory:
        "Tachypneic at 24. Chest clear to auscultation bilaterally — no wheeze, no crackles, no focal dullness. Reproducible tenderness is ABSENT over the chest wall.",
      legs: "Right calf is 3 cm greater in circumference than left. Mild tenderness along the deep venous line. No overlying erythema or warmth. Left leg normal.",
      abdomen: "Soft, non-tender.",
    },
  },

  orderables: [
    {
      id: "ecg",
      name: "12-lead ECG",
      category: "ecg",
      turnaroundMin: 5,
      costUsd: 50,
      abnormal: true,
      result:
        "Sinus tachycardia at 112. S1Q3T3 pattern present. T-wave inversions V1–V3. No ST elevation.",
    },
    {
      id: "cbc",
      name: "Complete Blood Count",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 30,
      result: "WBC 8.9, Hgb 13.4, Plt 265. All within normal limits.",
    },
    {
      id: "bmp",
      name: "Basic Metabolic Panel",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 35,
      result: "Na 139, K 4.1, Cr 0.8, eGFR >60. Unremarkable.",
    },
    {
      id: "troponin",
      name: "High-sensitivity Troponin",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 60,
      abnormal: true,
      result:
        "78 ng/L (ref <14). Mildly elevated. Repeat at 3h: 81 ng/L — flat, non-ischemic pattern.",
    },
    {
      id: "ddimer",
      name: "D-dimer",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 40,
      abnormal: true,
      result: "3,240 ng/mL FEU (ref <500). Markedly elevated.",
    },
    {
      id: "bnp",
      name: "BNP",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 55,
      abnormal: true,
      result: "412 pg/mL. Elevated.",
    },
    {
      id: "abg",
      name: "Arterial Blood Gas",
      category: "lab",
      turnaroundMin: 15,
      costUsd: 90,
      abnormal: true,
      result:
        "pH 7.48, pCO2 30 mmHg, pO2 62 mmHg, HCO3 22. Respiratory alkalosis with hypoxemia. A-a gradient widened.",
    },
    {
      id: "cxr",
      name: "Chest X-ray",
      category: "imaging",
      turnaroundMin: 30,
      costUsd: 120,
      result:
        "Clear lung fields. No consolidation, effusion or pneumothorax. Normal cardiac silhouette.",
    },
    {
      id: "ctpa",
      name: "CT Pulmonary Angiogram",
      category: "imaging",
      turnaroundMin: 90,
      costUsd: 1400,
      abnormal: true,
      result:
        "Filling defects in the right lower lobe segmental and subsegmental pulmonary arteries. RV/LV diameter ratio 1.1, consistent with right heart strain. No aortic dissection.",
    },
    {
      id: "leg_us",
      name: "Lower Extremity Doppler Ultrasound",
      category: "imaging",
      turnaroundMin: 60,
      costUsd: 350,
      abnormal: true,
      result:
        "Occlusive thrombus in the right popliteal vein extending to the tibioperoneal trunk. Left leg normal.",
    },
    {
      id: "echo",
      name: "Bedside Echocardiogram",
      category: "bedside",
      turnaroundMin: 20,
      costUsd: 300,
      abnormal: true,
      result:
        "RV dilation with RV/LV ratio >1. McConnell's sign present (akinetic RV free wall, preserved apex). No pericardial effusion.",
    },
    {
      id: "resp_panel",
      name: "Respiratory Viral Panel",
      category: "lab",
      turnaroundMin: 120,
      costUsd: 180,
      result: "Negative for influenza A/B, RSV, SARS-CoV-2.",
    },
    {
      id: "stress_test",
      name: "Exercise Stress Test",
      category: "bedside",
      turnaroundMin: 180,
      costUsd: 900,
      result:
        "NOT PERFORMED. Cardiology declined: the patient is hypoxic and tachycardic at rest. Exercise testing is contraindicated in suspected acute PE.",
    },
    {
      id: "ct_head",
      name: "CT Head (non-contrast)",
      category: "imaging",
      turnaroundMin: 60,
      costUsd: 800,
      result: "Normal. No acute intracranial abnormality.",
    },
  ],

  rubric: {
    mustAsk: [
      {
        id: "travel",
        label: "Recent travel or prolonged immobilisation",
        why: "The 14-hour flight 5 days ago is the single strongest provoking factor in this case. Without it the Wells score drops and PE slides down the differential.",
      },
      {
        id: "ocp",
        label: "Medications, specifically hormonal contraception",
        why: "Combined oral contraceptives are a major VTE risk factor in a 34-year-old woman. 'Any medications?' is not enough — many patients do not consider the pill a medication.",
      },
      {
        id: "legs",
        label: "Leg pain or swelling",
        why: "She has an occlusive popliteal DVT and will not mention it — she thinks she pulled a muscle. Asking about the legs converts this from a chest complaint to a VTE presentation.",
      },
      {
        id: "vte_history",
        label: "Personal or family history of clots",
        why: "Her mother had a post-operative DVT. It raises the pre-test probability and changes the thrombophilia conversation on discharge.",
      },
      {
        id: "pain_character",
        label: "Onset, character and pleuritic nature of the pain",
        why: "Sudden onset, sharp, worse on inspiration and non-exertional points away from ACS and toward a pleural process.",
      },
      {
        id: "hemoptysis",
        label: "Hemoptysis",
        why: "Its absence does not exclude PE, but it is part of the Wells criteria and a standard part of this history.",
      },
      {
        id: "pregnancy",
        label: "Pregnancy status / LMP",
        why: "Changes both the risk calculus and the imaging pathway before you send anyone for a CTPA.",
      },
    ],
    mustOrder: ["ecg", "ddimer", "ctpa"],
    shouldNotOrder: ["stress_test", "ct_head", "resp_panel"],
    redFlags: [
      {
        id: "hypoxia",
        label: "SpO2 91% on room air",
        why: "A genuinely hypoxic 34-year-old is not having a panic attack. This single number should have stopped the anxiety anchor cold.",
      },
      {
        id: "rv_strain",
        label: "Elevated troponin with RV dilation",
        why: "This is what makes the PE submassive rather than low-risk. It changes disposition from possible outpatient management to a monitored bed, and puts thrombolysis on the table if she decompensates.",
      },
      {
        id: "anchor",
        label: "The anxiety anchor from triage",
        why: "Diagnostic momentum from a triage note is one of the most reliably studied sources of error in emergency medicine. The note is not data.",
      },
    ],
    correctDiagnosis: "Acute submassive (intermediate-risk) pulmonary embolism",
    acceptableDifferential: [
      "Pulmonary embolism",
      "Deep vein thrombosis with PE",
      "Pneumothorax",
      "Pneumonia",
      "Acute coronary syndrome",
      "Pericarditis",
      "Panic attack / anxiety",
      "Musculoskeletal chest pain",
    ],
    keyManagement: [
      "Start therapeutic anticoagulation (LMWH or a DOAC) — and start it empirically before imaging if suspicion is high and bleeding risk is low, rather than waiting 90 minutes for the CTPA",
      "Risk-stratify formally (PESI or sPESI, plus troponin and RV assessment) — this is intermediate-risk, not low-risk",
      "Admit to a monitored bed rather than discharging on a DOAC; do not treat as an outpatient low-risk PE",
      "Supplemental oxygen to maintain saturations above 94%",
      "Do not give thrombolysis now — she is normotensive — but document that she is a candidate if she decompensates",
      "Stop the combined oral contraceptive and counsel on alternative contraception",
      "Plan a minimum 3 months of anticoagulation; discuss provoked vs unprovoked and whether thrombophilia testing is warranted given the family history",
    ],
  },
};
