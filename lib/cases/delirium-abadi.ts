import type { Case } from "../types";

export const deliriumAbadi: Case = {
  id: "delirium-abadi",
  title: "79F — confused since yesterday",
  chiefComplaint: "She's not herself. She's been muddled since yesterday morning.",
  difficulty: "core",
  specialty: "Geriatric Medicine",

  patient: {
    name: "Farida Abadi",
    age: 79,
    gender: "female",
    persona: `Drowsy and inattentive. She drifts off mid-sentence and loses the thread of a question.
She knows her own name. She thinks it is 1998 sometimes and 2026 at other times, and she is not
sure which hospital she is in. She is not distressed, just vague and slow — this is hypoactive
delirium, not agitation.
She answers in fragments and occasionally answers a question she was asked a minute ago.
If asked whether she needs to pass urine she says she doesn't think so — she cannot feel it.
She is not a reliable historian and should not be treated as one.`,
    collateral: {
      name: "Leila",
      relationship: "daughter",
      persona: `Leila is 51, attentive, and increasingly frustrated that nobody has looked at her
mother's medication list. She is an excellent historian and answers precisely — but only what she
is asked. She has a carrier bag with her mother's medicine boxes in it and will produce it and read
out every box, including the new one, if the student asks to see the medications or asks what she
is taking. If asked only "does she take any medications?" she says "yes, quite a few, the usual
things for her age" and leaves it there.
She will mention the new bladder tablet from the GP two weeks ago ONLY if asked about recent
medication changes, asked to list the medicines, or asked what is new since her mother was last well.`,
    },
    vitals: {
      hr: "88 bpm",
      bp: "142/78 mmHg",
      rr: "18 /min",
      temp: "36.9 °C",
      spo2: "96% on room air",
    },
  },

  hidden: {
    diagnosis:
      "Hypoactive delirium from acute urinary retention plus anticholinergic burden (recently started oxybutynin), with incidental asymptomatic bacteriuria",
    narrative: `Farida was started on oxybutynin two weeks ago for urinary frequency. The
anticholinergic load has done two things at once: precipitated acute urinary retention with more
than a litre in her bladder, and contributed directly to her confusion.
The trap is the urine dipstick. She will grow bacteria, because a large proportion of women her age
have asymptomatic bacteriuria. A student who dips the urine, sees it light up, diagnoses a UTI and
prescribes antibiotics will feel correct, will be praised by nobody, and will leave a litre of urine
in her bladder and the causative drug in her medicine cabinet. She will not improve.
The teaching points are that delirium is a medication review until proven otherwise, that a bladder
scan is a two-minute bedside test, and that a positive urine culture in an older adult is a finding,
not a diagnosis.`,
    history: `From Leila (the daughter), if asked:
- Normally sharp. Still does her own shopping, manages her own finances, reads constantly.
  This is a dramatic change, not her baseline.
- Started yesterday morning. Progressive over about 36 hours. Worse in the evenings.
- No fall, no head injury, no loss of consciousness.
- No fever, no cough, no shortness of breath, no vomiting.
- Has not opened her bowels in three days, which is unusual for her.
- Leila does not know when she last passed urine. Her mother has not asked to go.
- Eating and drinking much less over the last two days.
- Medications, if the list is actually requested: amlodipine 5 mg, atorvastatin 20 mg,
  levothyroxine 75 mcg, omeprazole 20 mg, and — started about two weeks ago by the GP for
  urinary frequency — OXYBUTYNIN 5 mg three times daily. Also takes over-the-counter
  diphenhydramine most nights to sleep, which Leila does not consider a medication.
- No alcohol. Never smoked.
- No previous episodes of confusion. No known dementia diagnosis.
- Lives alone in a bungalow; Leila visits daily.`,
    examFindings: {
      general:
        "Drowsy, inattentive, easily distracted. Not agitated. Not febrile to touch. Mucous membranes dry.",
      abdomen:
        "Soft. There is a palpable, dull, tender mass arising from the pelvis to just below the umbilicus — a distended bladder. Bowel sounds present. No guarding.",
      neurological:
        "No focal deficit. Power and tone normal and symmetrical. No facial droop. Pupils equal and reactive. Gait not assessed — she is too drowsy to stand safely. No neck stiffness.",
      cardiovascular: "Regular rhythm at 88. No murmur. JVP not elevated. No peripheral oedema.",
      respiratory: "Chest clear. No crackles, no bronchial breathing. Air entry equal.",
      skin: "No cellulitis, no pressure areas, no rash. No signs of trauma or bruising.",
    },
  },

  orderables: [
    {
      id: "bladder_scan",
      name: "Bedside Bladder Scan",
      category: "bedside",
      turnaroundMin: 2,
      costUsd: 15,
      abnormal: true,
      result: "1,150 mL retained. Acute urinary retention.",
    },
    {
      id: "med_review",
      name: "Formal Medication Reconciliation",
      category: "bedside",
      turnaroundMin: 15,
      costUsd: 0,
      abnormal: true,
      result:
        "Amlodipine 5 mg OD, atorvastatin 20 mg ON, levothyroxine 75 mcg OD, omeprazole 20 mg OD, OXYBUTYNIN 5 mg TDS (started 14 days ago), plus over-the-counter diphenhydramine most nights. Two anticholinergic agents, one of them new. High anticholinergic burden score.",
    },
    {
      id: "cam",
      name: "Confusion Assessment Method (4AT)",
      category: "bedside",
      turnaroundMin: 5,
      costUsd: 0,
      abnormal: true,
      result:
        "Positive for delirium. Acute onset with fluctuating course, inattention, altered level of consciousness. Score 7.",
    },
    {
      id: "urinalysis",
      name: "Urinalysis & Dipstick",
      category: "lab",
      turnaroundMin: 30,
      costUsd: 25,
      abnormal: true,
      result:
        "Leukocyte esterase positive, nitrites positive, 30 WBC/hpf, bacteria present. NOTE: she has no dysuria, no frequency, no suprapubic pain and no fever.",
    },
    {
      id: "urine_culture",
      name: "Urine Culture",
      category: "lab",
      turnaroundMin: 1440,
      costUsd: 60,
      abnormal: true,
      result:
        "10^5 CFU/mL E. coli, sensitive to nitrofurantoin and trimethoprim. In an asymptomatic woman of this age this represents colonisation in roughly 20–25% of cases.",
    },
    {
      id: "bmp",
      name: "Basic Metabolic Panel",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 35,
      abnormal: true,
      result: "Na 138, K 4.2, Cl 102, HCO3 24, BUN 28, Cr 1.3 (baseline 0.9). Mild acute kidney injury.",
    },
    {
      id: "cbc",
      name: "Complete Blood Count",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 30,
      result: "WBC 8.1, Hgb 12.8, Plt 240. No leukocytosis.",
    },
    {
      id: "crp",
      name: "C-Reactive Protein",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 30,
      result: "6 mg/L. Not elevated.",
    },
    {
      id: "tsh",
      name: "Thyroid Function Tests",
      category: "lab",
      turnaroundMin: 120,
      costUsd: 55,
      result: "TSH 2.1, free T4 normal. Adequately replaced.",
    },
    {
      id: "b12_folate",
      name: "B12 and Folate",
      category: "lab",
      turnaroundMin: 120,
      costUsd: 70,
      result: "B12 410 pg/mL, folate normal. Both adequate.",
    },
    {
      id: "calcium",
      name: "Calcium and Albumin",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 30,
      result: "Corrected calcium 2.35 mmol/L. Normal.",
    },
    {
      id: "glucose_poc",
      name: "Fingerstick Glucose",
      category: "bedside",
      turnaroundMin: 1,
      costUsd: 5,
      result: "104 mg/dL. Normal.",
    },
    {
      id: "ecg",
      name: "12-lead ECG",
      category: "ecg",
      turnaroundMin: 5,
      costUsd: 50,
      result: "Sinus rhythm at 88. No acute ischemic change. QTc 430 ms.",
    },
    {
      id: "cxr",
      name: "Chest X-ray",
      category: "imaging",
      turnaroundMin: 30,
      costUsd: 120,
      result: "Clear lung fields. No consolidation. No effusion.",
    },
    {
      id: "ct_head",
      name: "CT Head (non-contrast)",
      category: "imaging",
      turnaroundMin: 60,
      costUsd: 800,
      result:
        "Age-appropriate atrophy and small-vessel change. No haemorrhage, no mass, no infarct, no hydrocephalus. No acute abnormality.",
    },
    {
      id: "blood_cultures",
      name: "Blood Cultures",
      category: "lab",
      turnaroundMin: 1440,
      costUsd: 150,
      result: "No growth at 48 hours.",
    },
  ],

  rubric: {
    mustAsk: [
      {
        id: "med_changes",
        label: "Recent medication changes — and an actual look at the list",
        why: "Oxybutynin started two weeks ago is the cause of both the retention and half the confusion. 'Does she take any medications?' does not surface it. Asking to see the boxes does. This single question is the case.",
      },
      {
        id: "otc",
        label: "Over-the-counter and sleep medicines",
        why: "Nightly diphenhydramine adds a second anticholinergic that no one counts because the patient does not consider it a drug.",
      },
      {
        id: "baseline",
        label: "Her cognitive baseline, from the daughter",
        why: "Delirium is defined by change. Without establishing that she normally manages her own finances and shopping, you cannot distinguish this from undiagnosed dementia — and you will under-react.",
      },
      {
        id: "onset",
        label: "Time course and fluctuation",
        why: "Acute onset over 36 hours with evening worsening is delirium. Months of gradual decline would be a different conversation entirely.",
      },
      {
        id: "urine_output",
        label: "When she last passed urine",
        why: "She has 1.15 litres in her bladder and cannot feel it. Nobody had asked, because she was too confused to complain.",
      },
      {
        id: "bowels",
        label: "Bowel habit",
        why: "Three days of constipation is both further anticholinergic evidence and an independent, very common precipitant of delirium in this age group.",
      },
      {
        id: "infective_symptoms",
        label: "Fever, cough, dysuria — specifically their absence",
        why: "You need the negatives on record before you interpret the urine dipstick, or the dipstick will interpret you.",
      },
    ],
    mustOrder: ["bladder_scan", "med_review", "cam", "bmp"],
    shouldNotOrder: ["ct_head", "b12_folate", "blood_cultures"],
    redFlags: [
      {
        id: "bacteriuria_trap",
        label: "The positive urine dip is not the diagnosis",
        why: "Asymptomatic bacteriuria is present in a large minority of women this age. She has no dysuria, no frequency, no suprapubic pain and no fever. Treating this as a UTI feels decisive, resolves nothing, and leaves both the retention and the oxybutynin untouched.",
      },
      {
        id: "hypoactive",
        label: "Hypoactive delirium is the easy kind to miss",
        why: "She is quiet and compliant, so she gets labelled 'pleasantly confused' and left alone. Hypoactive delirium carries a worse prognosis than the agitated form precisely because it does not demand attention.",
      },
      {
        id: "anticholinergic",
        label: "Two anticholinergics, one of them prescribed a fortnight ago",
        why: "The prescribing cascade is the mechanism here: a drug for urinary frequency caused retention and confusion. Recognising it is what prevents her being discharged on the same drug.",
      },
    ],
    correctDiagnosis:
      "Hypoactive delirium precipitated by acute urinary retention and anticholinergic medication burden; the bacteriuria is asymptomatic and incidental",
    acceptableDifferential: [
      "Delirium",
      "Acute urinary retention",
      "Medication-induced delirium",
      "Anticholinergic toxicity",
      "Urinary tract infection",
      "Constipation",
      "Dementia",
      "Stroke",
      "Electrolyte disturbance",
      "Hypothyroidism",
    ],
    keyManagement: [
      "Catheterise to relieve the retention — this is both diagnostic and therapeutic, and it is the intervention most likely to improve her within hours",
      "STOP the oxybutynin, and stop the over-the-counter diphenhydramine",
      "Do not start antibiotics on the basis of the dipstick alone in an afebrile patient with no urinary symptoms",
      "Treat the constipation",
      "Rehydrate and recheck renal function — the AKI is obstructive and should resolve with decompression",
      "Non-pharmacological delirium care: orientation, daylight, hearing aids and glasses, family presence, sleep hygiene, early mobilisation",
      "Avoid antipsychotics — she is not distressed or a danger to herself, and sedation makes hypoactive delirium worse",
      "Write to the GP explaining the prescribing cascade so the oxybutynin is not simply restarted after discharge",
      "Formal cognitive assessment once the delirium resolves, not during it",
    ],
  },
};
