import type { Case } from "../types";

export const sahMensah: Case = {
  id: "sah-mensah",
  title: "28F — headache since this morning",
  chiefComplaint: "I've had a really bad headache since this morning and I can't shake it.",
  difficulty: "core",
  specialty: "Emergency Medicine",

  patient: {
    name: "Grace Mensah",
    age: 28,
    gender: "female",
    persona: `Uncomfortable and photophobic — she asks to have the lights dimmed and keeps her eyes
mostly closed. She gets migraines a few times a year, so she has already decided this is "a bad
migraine" and will say so if asked what she thinks is going on.
She will NOT volunteer that it came on instantly, or that it is unlike her usual migraines, or that
her mother had a brain haemorrhage — those come out only if asked directly. If asked how quickly it
started she is precise and a little surprised by her own answer: it was instant.
She is articulate and cooperative but keeps her replies short because talking makes it worse.`,
    vitals: {
      hr: "78 bpm",
      bp: "168/94 mmHg",
      rr: "16 /min",
      temp: "37.1 °C",
      spo2: "99% on room air",
    },
  },

  hidden: {
    diagnosis:
      "Aneurysmal subarachnoid haemorrhage from a 7 mm anterior communicating artery aneurysm",
    narrative: `Grace has a thunderclap headache from an aneurysmal SAH, six hours old, and she is
neurologically intact — which is exactly why she is dangerous to send home. She has a migraine
history, so the label is pre-attached, and her presenting sentence is deliberately unremarkable.
The diagnosis lives entirely in two questions: how fast did it come on, and how does it compare to
your usual migraines. Non-contrast CT within six hours of onset has near-perfect sensitivity, so the
window she is currently sitting in is the one where this is easiest to catch and easiest to miss.
Roughly a third of aneurysmal SAH patients have a sentinel bleed before the catastrophic one.`,
    history: `- Started about six hours ago, at the gym, mid-lift.
- Instant. Maximum intensity within a couple of seconds — "like being hit in the back of the head
  with a bat". She is definite about this if asked.
- Occipital, radiating down into her neck. Constant since onset, has not eased at all.
- Worst headache she has ever had.
- How it differs from her usual migraines, if asked: her migraines have visual aura first, build up
  over an hour, are one-sided and throbbing, and sumatriptan reliably works. This one had no aura,
  started instantly, is at the back of her head, and sumatriptan did nothing at all.
- Vomited twice. Nauseated since.
- Light hurts. Noise hurts.
- Neck feels stiff and sore.
- Felt faint and grey-out at onset but did not lose consciousness.
- No weakness, no numbness, no slurred speech, no visual loss.
- No fever, no rash, no recent illness, no sick contacts.
- No head injury, no fall, no trauma.
- Smokes about 10 cigarettes a day. Occasional alcohol. No drugs.
- Takes a combined oral contraceptive pill. No other medications.
- Her mother had "a bleed on the brain" at 55 and survived it. An uncle died suddenly at 49,
  cause never explained to her.
- No known hypertension — she has not seen a doctor in years.`,
    examFindings: {
      general: "Uncomfortable, lying still with eyes closed, wants the lights off. Not confused.",
      neurological:
        "GCS 15. Fully oriented. Cranial nerves intact, pupils equal and reactive. Power 5/5 throughout, symmetrical. No pronator drift. Coordination normal. No dysphasia.",
      neck: "Painful resistance to passive neck flexion. Kernig's sign equivocal. No lymphadenopathy.",
      fundoscopy: "No papilloedema. No subhyaloid haemorrhage.",
      cardiovascular: "Regular at 78. BP 168/94 on repeat. No murmur.",
      skin: "No petechial or purpuric rash. No meningococcal rash.",
    },
  },

  orderables: [
    {
      id: "ct_head_noncon",
      name: "CT Head (non-contrast)",
      category: "imaging",
      turnaroundMin: 45,
      costUsd: 800,
      abnormal: true,
      result:
        "Hyperdense material filling the basal cisterns and extending into both Sylvian fissures. Diffuse subarachnoid haemorrhage, modified Fisher grade 3. No hydrocephalus. No midline shift.",
    },
    {
      id: "ct_angio",
      name: "CT Angiogram (head)",
      category: "imaging",
      turnaroundMin: 60,
      costUsd: 1200,
      abnormal: true,
      result:
        "7 mm saccular aneurysm arising from the anterior communicating artery. No other aneurysms identified. No active extravasation.",
    },
    {
      id: "lp",
      name: "Lumbar Puncture",
      category: "bedside",
      turnaroundMin: 90,
      costUsd: 400,
      abnormal: true,
      result:
        "Opening pressure 24 cmH2O. RBC 45,000/µL in tube 1 and 41,000/µL in tube 4 — not clearing. Xanthochromia present on spectrophotometry. WBC 8, protein mildly raised, glucose normal. (Would not have been necessary — the CT was diagnostic.)",
    },
    {
      id: "ecg",
      name: "12-lead ECG",
      category: "ecg",
      turnaroundMin: 5,
      costUsd: 50,
      abnormal: true,
      result:
        "Sinus rhythm. Deep symmetrical T-wave inversions across the precordial leads with QTc 480 ms — neurogenic repolarisation change, not coronary ischemia.",
    },
    {
      id: "troponin",
      name: "High-sensitivity Troponin",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 60,
      abnormal: true,
      result: "42 ng/L. Mildly elevated — neurogenic myocardial stunning.",
    },
    {
      id: "cbc",
      name: "Complete Blood Count",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 30,
      result: "WBC 11.4, Hgb 13.1, Plt 288. Mild stress leukocytosis.",
    },
    {
      id: "bmp",
      name: "Basic Metabolic Panel",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 35,
      result: "Na 139, K 3.9, Cr 0.8. Unremarkable on admission.",
    },
    {
      id: "coags",
      name: "Coagulation Screen",
      category: "lab",
      turnaroundMin: 45,
      costUsd: 45,
      result: "INR 1.0, APTT normal. No coagulopathy.",
    },
    {
      id: "sumatriptan",
      name: "Give Sumatriptan (migraine treatment)",
      category: "bedside",
      turnaroundMin: 30,
      costUsd: 60,
      result:
        "Administered. No improvement in the headache. NOTE: a triptan is a vasoconstrictor and is contraindicated when subarachnoid haemorrhage has not been excluded.",
    },
    {
      id: "mri_brain",
      name: "MRI Brain",
      category: "imaging",
      turnaroundMin: 180,
      costUsd: 2200,
      abnormal: true,
      result:
        "FLAIR hyperintensity in the subarachnoid space. Confirms the haemorrhage — but took three hours to obtain and is not the correct first-line test in this presentation.",
    },
    {
      id: "ct_sinus",
      name: "CT Sinuses",
      category: "imaging",
      turnaroundMin: 45,
      costUsd: 600,
      result: "Clear, well-aerated sinuses. No mucosal thickening or fluid levels.",
    },
  ],

  rubric: {
    mustAsk: [
      {
        id: "onset_speed",
        label: "How quickly the headache reached maximum intensity",
        why: "This is the whole case. Instant, maximal-at-onset headache is thunderclap headache and mandates imaging regardless of how well the patient looks. 'When did it start?' is not the same question as 'how fast did it come on?'",
      },
      {
        id: "vs_usual",
        label: "How this headache compares to her usual migraines",
        why: "She has a migraine history, which is the trap. No aura, instant onset, occipital rather than unilateral, and no response to sumatriptan — every feature says this is a different animal. Asking the comparison is what dismantles the anchor.",
      },
      {
        id: "family_history",
        label: "Family history of aneurysm, subarachnoid haemorrhage or sudden death",
        why: "Her mother had a brain haemorrhage at 55 and an uncle died suddenly at 49. First-degree relatives with SAH raise her risk several-fold, and she will not offer this unprompted.",
      },
      {
        id: "exertion",
        label: "What she was doing at onset",
        why: "Onset during exertion or Valsalva is classic for aneurysmal rupture and is a detail patients rarely think to mention.",
      },
      {
        id: "neck_photophobia",
        label: "Neck stiffness and photophobia",
        why: "Meningism from blood in the subarachnoid space. It also forces you to consider meningitis, which is the other diagnosis you cannot miss here.",
      },
      {
        id: "loc",
        label: "Loss of consciousness or near-syncope at onset",
        why: "Transient loss of consciousness at onset is strongly associated with aneurysmal rupture and predicts a worse grade.",
      },
      {
        id: "trauma",
        label: "Head injury",
        why: "It reframes the entire differential and changes what the CT means. It has to be asked, even when the answer is no.",
      },
    ],
    mustOrder: ["ct_head_noncon", "ct_angio"],
    shouldNotOrder: ["sumatriptan", "ct_sinus", "mri_brain"],
    redFlags: [
      {
        id: "thunderclap",
        label: "Thunderclap onset in a neurologically intact patient",
        why: "A normal neurological examination provides no reassurance whatsoever in SAH. Patients who walk in talking are precisely the ones who get discharged and re-present with a catastrophic rebleed.",
      },
      {
        id: "six_hour_window",
        label: "She is six hours from onset",
        why: "Non-contrast CT within six hours of onset has near-perfect sensitivity for SAH. That window is closing while you take the history. Delay past it and you are committing her to a lumbar puncture.",
      },
      {
        id: "migraine_anchor",
        label: "Her own migraine diagnosis, handed to you pre-packaged",
        why: "Patients arrive with hypotheses, and a plausible one from a patient who has had the condition before is the hardest kind to override. Her history is a data point, not a diagnosis.",
      },
      {
        id: "bp",
        label: "BP 168/94 in a 28-year-old",
        why: "Not her baseline, and a marker of the acute intracranial event rather than of chronic hypertension.",
      },
    ],
    correctDiagnosis: "Aneurysmal subarachnoid haemorrhage",
    acceptableDifferential: [
      "Subarachnoid haemorrhage",
      "Thunderclap headache",
      "Cerebral venous sinus thrombosis",
      "Cervical artery dissection",
      "Reversible cerebral vasoconstriction syndrome",
      "Bacterial meningitis",
      "Migraine",
      "Intracerebral haemorrhage",
      "Pituitary apoplexy",
    ],
    keyManagement: [
      "Immediate non-contrast CT head — do not wait for bloods, and do not treat empirically for migraine first",
      "Urgent neurosurgical referral the moment the CT is positive",
      "Nimodipine 60 mg six-hourly for delayed cerebral ischemia prophylaxis — this is one of the few interventions with a clear mortality benefit here",
      "Blood pressure control before the aneurysm is secured, avoiding both hypertensive peaks and overshoot; keep systolic below roughly 160",
      "Analgesia and antiemetics, bed rest, quiet darkened room, avoid straining",
      "CT angiography to define the aneurysm and plan coiling versus clipping — definitive securing within 24 hours where possible",
      "Do NOT give triptans, and avoid antiplatelets or anticoagulants",
      "Admit to a neuro ICU or high-dependency bed; monitor for rebleed, acute hydrocephalus, vasospasm around days 4–14, and hyponatraemia from cerebral salt wasting",
      "A lumbar puncture is unnecessary once the CT is diagnostic; it would only be indicated if the CT were negative",
    ],
  },
};
