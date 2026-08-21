import type { Case } from "../types";

export const endocarditisNowak: Case = {
  id: "endocarditis-nowak",
  title: "31M — fevers for three weeks",
  chiefComplaint: "I've been getting fevers and chills for a few weeks and I feel awful.",
  difficulty: "hard",
  specialty: "Infectious Diseases",

  patient: {
    name: "Tomas Nowak",
    age: 31,
    gender: "male",
    persona: `Unwell, tired, and braced for how this is going to go. He has been dismissed before and
he expects it again — he was seen at another emergency department ten days ago, told it was viral,
and discharged inside forty minutes.
He is guarded about drug use at first. If the student asks in a judgemental, roundabout, or
euphemistic way ("you don't use drugs, do you?"), he says no. If the student asks plainly and
without moralising — any straightforward, matter-of-fact question about injection drug use — he
tells the truth and is relieved to. He also volunteers more once he trusts the student.
He is not drug-seeking. He has not asked for anything. He wants to know why he keeps having fevers.
He answers what he is asked, briefly, and he watches how the student reacts.`,
    vitals: {
      hr: "118 bpm",
      bp: "104/62 mmHg",
      rr: "22 /min",
      temp: "38.9 °C",
      spo2: "93% on room air",
    },
  },

  hidden: {
    diagnosis:
      "Tricuspid valve infective endocarditis due to Staphylococcus aureus, with septic pulmonary emboli",
    narrative: `Tomas has right-sided infective endocarditis with septic pulmonary emboli, and he has
already been sent home once with "a virus". The clinical content of this case is straightforward.
The difficulty is entirely in the history-taking: the diagnosis is unreachable without an honest
answer about injection drug use, and that answer depends on how the question is asked.
Two knowledge traps sit underneath. First, right-sided endocarditis characteristically lacks the
peripheral stigmata students are taught to look for — no Janeway lesions, no Osler nodes, no splinter
haemorrhages — so their absence gets read as reassurance. Second, blood cultures must be drawn before
antibiotics; a student who reflexively covers a septic-looking patient first may cost the team the
organism.`,
    history: `- Fevers and drenching night sweats for about three weeks. He changes the sheets most nights.
- Lost about 8 pounds without trying.
- Sharp chest pain that is worse on breathing in, for the last week or so.
- Cough, occasionally with streaks of blood in the sputum.
- Short of breath walking up a flight of stairs, which is new.
- Constantly exhausted.
- If asked plainly about injection drug use: yes. Heroin, most days, for about six years.
  He injects into his arms, uses whatever water is available, and does not always have clean
  equipment. He has been trying to cut down and has been on buprenorphine twice before.
- He has had skin abscesses at injection sites twice in the past two years, both drained.
- Seen at another emergency department 10 days ago for the same fevers. Told it was viral.
  Discharged in under an hour. No blood tests were done. He did not feel listened to.
- No recent dental work, no dental pain.
- No known heart murmur, no known valve disease, no rheumatic fever, no prosthetic material.
- No IV catheters, no recent hospital admissions, no surgery.
- No travel, no animal exposure, no tick bites, no unpasteurised food.
- Not currently on any prescribed medication. No allergies.
- Housed, living with a friend. Smokes cigarettes. Drinks occasionally.`,
    examFindings: {
      general:
        "Unwell, thin, diaphoretic and flushed. Febrile at 38.9. Looks chronically ill rather than acutely septic.",
      cardiovascular:
        "Tachycardic at 118, regular. A soft systolic murmur at the left lower sternal border that becomes louder on inspiration. JVP visible with prominent v waves. No peripheral oedema.",
      respiratory:
        "Tachypneic at 22. Scattered crackles in both mid and lower zones. No focal consolidation to percussion.",
      skin: "Track marks and healed abscess scars in both antecubital fossae. No active cellulitis or abscess. NO Janeway lesions, NO Osler nodes, NO splinter haemorrhages — their absence is characteristic of right-sided disease and excludes nothing.",
      abdomen: "Soft, non-tender. No hepatosplenomegaly.",
      neurological: "Alert and fully oriented. No focal deficit. No neck stiffness.",
      eyes: "No Roth spots on fundoscopy. Conjunctivae pale.",
    },
  },

  orderables: [
    {
      id: "blood_cultures",
      name: "Blood Cultures ×3 sets, separate sites",
      category: "lab",
      turnaroundMin: 1440,
      costUsd: 180,
      abnormal: true,
      result:
        "Staphylococcus aureus in 3 of 3 sets, drawn from separate sites over one hour. Methicillin-SENSITIVE (MSSA). Persistently positive bacteraemia — a major Duke criterion.",
    },
    {
      id: "echo_tte",
      name: "Transthoracic Echocardiogram",
      category: "imaging",
      turnaroundMin: 90,
      costUsd: 450,
      abnormal: true,
      result:
        "1.4 cm mobile vegetation on the anterior tricuspid leaflet. Moderate-to-severe tricuspid regurgitation. Right ventricle mildly dilated. Left-sided valves appear normal.",
    },
    {
      id: "echo_tee",
      name: "Transoesophageal Echocardiogram",
      category: "imaging",
      turnaroundMin: 180,
      costUsd: 1600,
      abnormal: true,
      result:
        "Confirms the tricuspid vegetation. No perivalvular abscess, no left-sided involvement, no leaflet perforation.",
    },
    {
      id: "cxr",
      name: "Chest X-ray",
      category: "imaging",
      turnaroundMin: 30,
      costUsd: 120,
      abnormal: true,
      result:
        "Multiple bilateral peripheral nodular opacities, several with central cavitation. Appearances are typical of septic pulmonary emboli. No lobar consolidation.",
    },
    {
      id: "ct_chest",
      name: "CT Chest with contrast",
      category: "imaging",
      turnaroundMin: 75,
      costUsd: 1100,
      abnormal: true,
      result:
        "Numerous peripheral wedge-shaped and nodular lesions with cavitation, distributed bilaterally in a haematogenous pattern. Small bilateral effusions. Consistent with septic emboli.",
    },
    {
      id: "cbc",
      name: "Complete Blood Count",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 30,
      abnormal: true,
      result:
        "WBC 18.4 with left shift, Hgb 9.6 (normocytic), Plt 118. Anaemia of chronic inflammation with mild thrombocytopenia.",
    },
    {
      id: "inflammatory",
      name: "CRP and ESR",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 45,
      abnormal: true,
      result: "CRP 214 mg/L, ESR 88 mm/hr. Both markedly elevated.",
    },
    {
      id: "bmp",
      name: "Basic Metabolic Panel",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 35,
      abnormal: true,
      result: "Na 133, K 4.1, Cr 1.4 (no prior baseline available), HCO3 21.",
    },
    {
      id: "urinalysis",
      name: "Urinalysis",
      category: "lab",
      turnaroundMin: 30,
      costUsd: 25,
      abnormal: true,
      result:
        "Microscopic haematuria with 15 RBC/hpf and mild proteinuria. No nitrites. Consistent with immune-complex glomerular involvement — a minor Duke criterion.",
    },
    {
      id: "bbv_screen",
      name: "HIV, Hepatitis B and C Serology",
      category: "lab",
      turnaroundMin: 240,
      costUsd: 140,
      abnormal: true,
      result:
        "HIV negative. Hepatitis C antibody POSITIVE with detectable RNA — new diagnosis, needs linkage to treatment. Hepatitis B non-immune, so vaccination is indicated.",
    },
    {
      id: "ecg",
      name: "12-lead ECG",
      category: "ecg",
      turnaroundMin: 5,
      costUsd: 50,
      result:
        "Sinus tachycardia at 118. Normal PR interval — no conduction delay to suggest a perivalvular abscess. No ischemic change.",
    },
    {
      id: "empiric_abx_first",
      name: "Give empiric antibiotics immediately (before cultures)",
      category: "bedside",
      turnaroundMin: 15,
      costUsd: 90,
      result:
        "Antibiotics administered. Subsequent blood cultures return NO GROWTH. The organism is never identified, and the team is committed to six weeks of broad empiric therapy with no ability to narrow. In a haemodynamically stable patient, cultures come first.",
    },
    {
      id: "discharge_oral_abx",
      name: "Discharge on oral antibiotics with GP follow-up",
      category: "bedside",
      turnaroundMin: 30,
      costUsd: 40,
      result:
        "NOT APPROPRIATE. Untreated S. aureus endocarditis has a mortality approaching 100%. Oral therapy does not treat this, and he re-presents in extremis or not at all.",
    },
    {
      id: "ct_head",
      name: "CT Head (non-contrast)",
      category: "imaging",
      turnaroundMin: 60,
      costUsd: 800,
      result:
        "No haemorrhage, no infarct, no mass. Normal. (Reasonable if there were neurological signs — there are none.)",
    },
  ],

  rubric: {
    mustAsk: [
      {
        id: "idu",
        label: "Injection drug use — asked plainly and without judgement",
        why: "This is the case. He will answer honestly if asked as a straightforward clinical question and will deny it if the question carries disapproval. How you ask determines whether you get the diagnosis. That is not a soft skill; it is the diagnostic instrument.",
      },
      {
        id: "fever_duration",
        label: "Duration and pattern of fever and night sweats",
        why: "Three weeks of drenching night sweats with weight loss is subacute, not viral. The time course alone should have stopped the first team.",
      },
      {
        id: "pulmonary",
        label: "Pleuritic pain, cough and haemoptysis",
        why: "These are the septic pulmonary emboli, and they are what localise right-sided endocarditis. Without asking, the chest X-ray looks like an incidental pneumonia.",
      },
      {
        id: "prior_visit",
        label: "Previous healthcare contacts for the same problem",
        why: "He was discharged ten days ago as 'viral' with no blood tests. A patient re-presenting with the same unresolved illness is a red flag in its own right — and it tells you the first assessment was inadequate rather than reassuring.",
      },
      {
        id: "abscesses",
        label: "Previous skin or soft tissue infections",
        why: "Two drained abscesses establish a history of S. aureus seeding and raise the pre-test probability considerably.",
      },
      {
        id: "cardiac_history",
        label: "Known valve disease, prosthetic material, rheumatic fever",
        why: "Standard endocarditis risk stratification — and here the answer is no, which is itself informative, since right-sided disease in people who inject drugs typically affects previously normal valves.",
      },
      {
        id: "dental",
        label: "Recent dental work",
        why: "The other classic portal of entry. Asking it and excluding it is part of a complete history.",
      },
    ],
    mustOrder: ["blood_cultures", "echo_tte", "cxr"],
    shouldNotOrder: ["empiric_abx_first", "discharge_oral_abx", "ct_head"],
    redFlags: [
      {
        id: "bias",
        label: "He was already dismissed once",
        why: "People who inject drugs are measurably more likely to have symptoms attributed to drug use and to be discharged without workup. The previous 'viral illness' label is the most dangerous piece of information in this chart, because it invites you to agree with it.",
      },
      {
        id: "no_stigmata",
        label: "No Janeway lesions, Osler nodes or splinter haemorrhages",
        why: "Right-sided endocarditis characteristically lacks peripheral stigmata, because the emboli go to the lungs rather than the systemic circulation. Reading their absence as reassurance inverts the finding.",
      },
      {
        id: "cultures_first",
        label: "Blood cultures before antibiotics",
        why: "He is febrile but haemodynamically stable, so there is time to draw three sets properly. Treat first and you lose the organism, and with it any chance of narrowing therapy over six weeks.",
      },
      {
        id: "murmur",
        label: "A systolic murmur that increases on inspiration",
        why: "Carvallo's sign — it localises the regurgitation to the tricuspid valve and points you at the right side of the heart before the echo does.",
      },
    ],
    correctDiagnosis:
      "Tricuspid valve infective endocarditis due to Staphylococcus aureus, complicated by septic pulmonary emboli",
    acceptableDifferential: [
      "Infective endocarditis",
      "Right-sided endocarditis",
      "Septic pulmonary emboli",
      "Staphylococcus aureus bacteraemia",
      "Pneumonia",
      "Tuberculosis",
      "Lymphoma",
      "Pulmonary embolism",
      "Lung abscess",
      "HIV with opportunistic infection",
    ],
    keyManagement: [
      "Three sets of blood cultures from separate sites BEFORE any antibiotic is given — he is stable enough to allow it",
      "Empiric IV vancomycin to cover MRSA while cultures are pending, then narrow to nafcillin, flucloxacillin or cefazolin once MSSA is confirmed — the narrowed agent is meaningfully more effective for MSSA than vancomycin",
      "Four to six weeks of IV therapy, guided by infectious diseases",
      "Transthoracic echo first; transoesophageal if the TTE is non-diagnostic or left-sided involvement is suspected",
      "Apply the modified Duke criteria explicitly and document them",
      "Cardiology and cardiothoracic surgery input — surgical indications include heart failure, uncontrolled infection, perivalvular abscess, or recurrent emboli on therapy",
      "Repeat blood cultures every 48–72 hours to confirm clearance",
      "Involve addiction medicine early and OFFER medication for opioid use disorder — buprenorphine or methadone — as part of this admission, not as an afterthought at discharge",
      "Harm reduction counselling and supplies, whatever his decision about treatment",
      "Link the new hepatitis C diagnosis to treatment; vaccinate against hepatitis B",
      "Plan the vascular access honestly with the patient rather than around him — a PICC line requires a conversation, not an assumption",
    ],
  },
};
