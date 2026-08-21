import type { Case } from "../types";

export const miCastillo: Case = {
  id: "mi-castillo",
  title: "56M — indigestion that won't settle",
  chiefComplaint: "I've had this indigestion since this morning and the antacids aren't touching it.",
  difficulty: "hard",
  specialty: "Emergency Medicine",

  patient: {
    name: "Ronald Castillo",
    age: 56,
    gender: "male",
    persona: `A contractor who does not go to doctors and is faintly embarrassed to be here — his
wife made him come. He downplays everything. If you ask whether he has chest pain he says no,
because to him this is his stomach, not his chest. He will only agree it is "pressure" or "fullness"
if you offer those words.
He will not mention the jaw ache or the heaviness in his arm unless you ask about them specifically,
because he does not think they are connected to indigestion. He will mention the sweating if asked,
and he is a little unsettled by it — "I don't sweat like that."
He is diabetic and has not had his HbA1c checked in over a year. He minimises. Short answers.`,
    vitals: {
      hr: "52 bpm",
      bp: "96/58 mmHg",
      rr: "18 /min",
      temp: "36.6 °C",
      spo2: "95% on room air",
    },
  },

  hidden: {
    diagnosis:
      "Acute inferior ST-elevation myocardial infarction with right ventricular involvement",
    narrative: `Ronald is having an inferior STEMI with RV extension, and he is calling it indigestion.
Long-standing diabetes with peripheral neuropathy has blunted his pain, so the presentation is an
anginal equivalent rather than crushing chest pain — a pattern that is both common and commonly
missed, and that carries higher mortality precisely because of the delay it causes.
Two traps compound it. The first is the GI cocktail: relief from an antacid proves nothing, and
failure to relieve gets dismissed anyway. The second is far more dangerous — he is hypotensive with
a raised JVP and clear lungs, the classic RV infarct triad. His cardiac output is preload-dependent.
Give him nitroglycerin, as the reflex for "cardiac chest pain" dictates, and he will drop his blood
pressure precipitously. He needs fluid, not vasodilation.`,
    history: `- Started about four hours ago while he was mowing the lawn. He stopped and it did not go away.
- Pressure and fullness high in the stomach, under the breastbone. Constant, not colicky.
- Not related to eating. He had breakfast three hours before it started.
- Took two antacid tablets and then a third. No relief at all.
- If asked about the jaw or arm: his jaw has been aching, and his left arm feels heavy and dull.
  He had not connected either to the indigestion.
- Sweating: he soaked through his shirt within minutes of it starting. This bothers him.
- Nauseated. Vomited once, which did not help.
- Mildly short of breath on walking to the car. No orthopnoea.
- Type 2 diabetes for about 12 years, on metformin. Last HbA1c "a while ago", 8.9% when checked.
- Peripheral neuropathy — his feet have been numb for years. He mentions this only if asked
  about diabetic complications or numbness.
- High blood pressure and high cholesterol, both diagnosed, both treated on and off. He is not
  reliable with the tablets.
- Smokes about a pack a day, has done for 30 years.
- Father had a heart attack at 58 and survived. Older brother had a stent at 60.
- No previous chest pain, no previous cardiac testing, never had a stress test.
- No reflux history, no ulcers, no NSAID use, no alcohol excess, no black stools.`,
    examFindings: {
      general:
        "Pale, clammy and visibly diaphoretic — his shirt is damp. Uncomfortable but not distressed. Looks unwell.",
      cardiovascular:
        "Bradycardic at 52, regular. JVP clearly elevated at about 8 cm. Heart sounds normal, no murmur, no gallop. Peripheries cool. Capillary refill 3 seconds.",
      respiratory:
        "Chest CLEAR to auscultation throughout. No crackles, no wheeze. This combination — hypotension, raised JVP, clear lungs — is the point.",
      abdomen:
        "Soft. Mild epigastric tenderness without guarding or rebound. No mass. Bowel sounds normal.",
      legs: "No oedema. No calf tenderness. Pedal pulses present but reduced. Reduced sensation to monofilament bilaterally.",
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
        "ST elevation of 3 mm in II, III and aVF, with ST elevation greater in III than II. Reciprocal ST depression in I and aVL. Sinus bradycardia at 52. INFERIOR STEMI.",
    },
    {
      id: "ecg_right",
      name: "Right-sided ECG leads (V3R–V6R)",
      category: "ecg",
      turnaroundMin: 5,
      costUsd: 50,
      abnormal: true,
      result:
        "ST elevation of 2 mm in V4R. Confirms RIGHT VENTRICULAR INFARCTION. This changes management.",
    },
    {
      id: "troponin",
      name: "High-sensitivity Troponin",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 60,
      abnormal: true,
      result:
        "1,840 ng/L (ref <14). Markedly elevated. NOTE: a normal troponin would not have excluded anything — do not wait for it before activating the cath lab in a STEMI.",
    },
    {
      id: "echo",
      name: "Bedside Echocardiogram",
      category: "bedside",
      turnaroundMin: 20,
      costUsd: 300,
      abnormal: true,
      result:
        "Inferior wall akinesis. Dilated, poorly contracting right ventricle. No pericardial effusion, no tamponade, no aortic flap.",
    },
    {
      id: "cxr",
      name: "Chest X-ray",
      category: "imaging",
      turnaroundMin: 30,
      costUsd: 120,
      result:
        "Clear lung fields, no pulmonary oedema. Normal mediastinal contour — no widening.",
    },
    {
      id: "bmp",
      name: "Basic Metabolic Panel",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 35,
      abnormal: true,
      result: "Na 137, K 4.0, Cr 1.2, glucose 218.",
    },
    {
      id: "cbc",
      name: "Complete Blood Count",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 30,
      result: "WBC 11.8, Hgb 14.6, Plt 231.",
    },
    {
      id: "lipase",
      name: "Lipase",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 40,
      result: "38 U/L. Normal. No evidence of pancreatitis.",
    },
    {
      id: "nitroglycerin",
      name: "Give Sublingual Nitroglycerin",
      category: "bedside",
      turnaroundMin: 5,
      costUsd: 20,
      abnormal: true,
      result:
        "BP falls immediately from 96/58 to 68/40. The patient becomes grey, clammy and briefly unresponsive. Requires a rapid fluid bolus to recover. NITRATES ARE CONTRAINDICATED IN RIGHT VENTRICULAR INFARCTION — his output is preload-dependent.",
    },
    {
      id: "gi_cocktail",
      name: "Give GI Cocktail (antacid + lidocaine)",
      category: "bedside",
      turnaroundMin: 20,
      costUsd: 40,
      result:
        "No change in symptoms. NOTE: response to a GI cocktail has no diagnostic value — it does not distinguish cardiac from gastrointestinal pain in either direction.",
    },
    {
      id: "ct_abdomen",
      name: "CT Abdomen/Pelvis",
      category: "imaging",
      turnaroundMin: 90,
      costUsd: 1200,
      result: "No acute intra-abdominal abnormality. Normal pancreas, no obstruction, no free air.",
    },
    {
      id: "ct_aorta",
      name: "CT Aortogram",
      category: "imaging",
      turnaroundMin: 75,
      costUsd: 1400,
      result: "No dissection flap. No aneurysm. Normal aortic contour.",
    },
  ],

  rubric: {
    mustAsk: [
      {
        id: "radiation",
        label: "Radiation to the jaw, neck, arm or back",
        why: "He has jaw ache and a heavy left arm and will never connect them to 'indigestion' on his own. One direct question converts a GI complaint into a cardiac one.",
      },
      {
        id: "exertion",
        label: "What he was doing when it started",
        why: "Onset during exertion that does not settle with rest is angina until proven otherwise, whatever the patient calls the sensation.",
      },
      {
        id: "diaphoresis",
        label: "Sweating",
        why: "Diaphoresis is one of the highest-yield discriminators for myocardial infarction in undifferentiated epigastric pain, and it is startlingly easy to leave unasked.",
      },
      {
        id: "diabetes",
        label: "Diabetes and its complications, specifically neuropathy",
        why: "Twelve years of diabetes with established peripheral neuropathy is why this presented as indigestion rather than crushing chest pain. It should raise, not lower, your suspicion.",
      },
      {
        id: "risk_factors",
        label: "Smoking, hypertension, cholesterol",
        why: "Thirty pack-years plus untreated hypertension and dyslipidaemia. His pre-test probability was high before he opened his mouth.",
      },
      {
        id: "family_history",
        label: "Family history of premature coronary disease",
        why: "Father with an MI at 58 and a brother stented at 60 is a strong family history.",
      },
      {
        id: "antacid_response",
        label: "Whether antacids helped",
        why: "Worth asking — but for the right reason. The answer here is no, and had it been yes it would still have proved nothing.",
      },
    ],
    mustOrder: ["ecg", "ecg_right", "troponin"],
    shouldNotOrder: ["nitroglycerin", "gi_cocktail", "ct_abdomen"],
    redFlags: [
      {
        id: "rv_triad",
        label: "Hypotension, raised JVP, clear lungs",
        why: "This is the right ventricular infarct triad and it should have stopped your hand before it reached for nitrates. His cardiac output depends on preload; vasodilating him collapses it.",
      },
      {
        id: "brady_hypotension",
        label: "Heart rate 52 with systolic 96",
        why: "Inferior infarcts involve the RCA, which supplies the SA and AV nodes in most people. Bradycardia with hypotension in this setting is an ominous combination, not incidental.",
      },
      {
        id: "anginal_equivalent",
        label: "'Indigestion' in a long-standing diabetic",
        why: "Anginal equivalents — epigastric discomfort, breathlessness, fatigue, jaw pain — are how diabetics, women and older patients often present. Waiting for textbook crushing chest pain is how these are missed, and the delay is what kills.",
      },
      {
        id: "no_troponin_wait",
        label: "Do not wait for the troponin",
        why: "The ECG is the diagnostic test in STEMI. A troponin that has not risen yet is expected at four hours and must not delay reperfusion by a single minute.",
      },
    ],
    correctDiagnosis:
      "Acute inferior STEMI with right ventricular involvement",
    acceptableDifferential: [
      "Acute coronary syndrome",
      "Inferior myocardial infarction",
      "STEMI",
      "Right ventricular infarction",
      "Aortic dissection",
      "Pericarditis",
      "Pulmonary embolism",
      "Peptic ulcer disease",
      "Pancreatitis",
      "Gastro-oesophageal reflux",
    ],
    keyManagement: [
      "Aspirin 300 mg chewed immediately",
      "Activate the cath lab for primary PCI — the target is door-to-balloon under 90 minutes, and everything else happens in parallel with that call, not before it",
      "Obtain right-sided leads in EVERY inferior STEMI before giving anything that vasodilates",
      "AVOID nitrates entirely. Avoid or use extreme caution with morphine and any other preload-reducing agent",
      "Give IV fluid boluses to support right ventricular preload and maintain output",
      "Hold beta-blockers acutely — he is bradycardic and hypotensive",
      "Atropine for symptomatic bradycardia; have transcutaneous pacing available, as high-grade AV block is common in inferior infarction",
      "Second antiplatelet and anticoagulation per local protocol, in discussion with the interventional team",
      "If PCI is not available within the required window, consider thrombolysis — but transfer for PCI is preferred",
    ],
  },
};
