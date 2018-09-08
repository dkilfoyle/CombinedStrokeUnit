module.exports = {
  mDiversions: {
    name: 'mDiversions',
    val: 'pragmatic',
    default: 'pragmatic',
    group: 'ED',
    label: 'Diversion Model',
    helper: 'Number of Ambulance Diversions from WDHB and CMDHB / year',
    tip: 'Pragmatic: acuity 49%, hours 61%.<br>Expanded: acuity 82%, hours 61%.<br>Future: acuity 82%, hours 100%.<br>All: 22% deficit, 79% mRS, mimics 1:5',
    type: 'select',
    options: [{
      label: 'Status Quo (6%, WTK)',
      value: 'statusquo'
    },
    {
      label: 'Pragmatic (6%, WDHB+CMDHB)',
      value: 'pragmatic'
    },
    {
      label: 'Expanded (10%, 0-24h duration)',
      value: 'expanded'
    },
    {
      label: 'Future (17%, 24/7)',
      value: 'future'
    }
    ]
  },
  nADHBStroke: {
    name: 'nADHBStroke',
    // From PP20 the total number of stroke (hemorrhage, ischemic, unspecified) discharges in 2017 was 163 + 159 + 294 + 192
    // From PP20 ADHB admits 91% of all stroke to stroke unit
    // At least 75 of these were outside PSIs
    // Therefore total = (163 + 159 + 294 + 192) * 0.91 - 75 = 660
    // -----------------------------------------------------------
    // From ADT145 the total number of stroke admissions (LOS>0) from Neuro in 2017 was 608
    // Of these 69 were PSI transfers and 4 were diversions
    // Thus total ADHB area stroke admissions in 2017 = 607-69-4 = 535

    val: 535,
    default: 535,
    type: 'number',
    group: 'Populations',
    label: '# ADHB Stroke',
    helper: 'Number of ADHB area stroke admissions in 2017',
    tip: 'From ADT145 the total number of stroke admissions (LOS>0) from Neuro in 2017 was 608.<br>Of these 69 were PSI transfers and 4 were diversions.<br>Thus total ADHB area stroke admissions in 2017 = 607-69-4 = 535'
  },
  nADHBTIA: {
    name: 'nADHBTIA',
    val: 114,
    default: 114,
    type: 'number',
    group: 'Populations',
    label: '# ADHB TIA',
    helper: 'Number of TIA admissions (LOS>0d) in 2017'
  },
  nWDHBUnder65: {
    name: 'nWDHBUnder65',
    val: 30,
    default: 30,
    type: 'number',
    group: 'Populations',
    label: '# WDHB <65 Stroke Rehab',
    helper: 'Number of WDHB area <65y stroke rehab patients'
  },
  popGrowth: {
    name: 'popGrowth',
    val: 0.025,
    default: 0.025,
    max: 0.2,
    decimals: 1,
    type: 'percent',
    group: 'Populations',
    label: 'Annual Popln Growth',
    helper: '% population growth'
  },
  pIVTOnly: {
    name: 'pIVTOnly',
    val: 0.06,
    default: 0.06,
    type: 'percent',
    group: 'ED',
    label: 'IVT Only',
    helper: '% of ischemic stroke having IVT without PSI'
  },
  mPSI: {
    name: 'mPSI',
    val: 'pragmatic',
    default: 'pragmatic',
    group: 'Neuroradiology',
    label: 'PSI Model',
    helper: 'Number of PSI (all areas) / year',
    type: 'select',
    options: [{
      label: 'Status Quo',
      value: 'statusquo'
    },
    {
      label: 'Pragmatic',
      value: 'pragmatic'
    },
    {
      label: 'Expanded',
      value: 'expanded'
    },
    {
      label: 'Future',
      value: 'future'
    }
    ]
  },
  pPASTAPos: {
    name: 'pPASTAPos',
    val: 0.3,
    default: 0.3,
    type: 'percent',
    group: 'ED',
    label: '% PASTA Positive',
    helper: '% of stroke that is PASTA Positive'
  },
  pRehab: {
    name: 'pRehab',
    val: 0.24,
    default: 0.24,
    type: 'percent',
    group: 'Rehab',
    label: '% Rehab',
    helper: '% of Stroke patients in ASU needing inpatient rehab',
    tip: 'From ADT145 data for neuro stroke discharges'
  },
  nRehabLOS: {
    name: 'nRehabLOS',
    val: 22.7,
    default: 22.7,
    min: 2,
    max: 100,
    decimals: 1,
    type: 'slider',
    group: 'Rehab',
    label: 'Rehab LOS',
    helper: 'Average LOS in rehab bed',
    tip: 'ADT145 data for patients referred from stroke neuro in 2017.'
  },
  nHASULOS: {
    name: 'nHASULOS',
    val: 1.5,
    default: 1.5,
    min: 1,
    max: 10,
    decimals: 1,
    type: 'slider',
    group: 'HASU/ASU',
    label: 'HASU LOS',
    helper: 'Average LOS in HASU bed',
    tip: 'Approximately 50% will LOS 24h, 50% 48h'
  },
  nASULOSStroke: {
    name: 'nASULOSStroke',
    val: 3.0,
    default: 3.0,
    min: 1,
    max: 20,
    decimals: 1,
    type: 'slider',
    group: 'HASU/ASU',
    label: 'ASU LOS Stroke',
    helper: 'Average LOS in for stroke patient in ASU',
    tip: 'ADT145 Total Acute LOS = 3.8d. ASU phase will be shorter for those coming from HASU.'
  },
  nASULOSTIA: {
    name: 'nASULOSTIA',
    val: 1.8,
    default: 1.8,
    min: 1,
    max: 10,
    decimals: 1,
    type: 'slider',
    group: 'HASU/ASU',
    label: 'ASU LOS TIA',
    helper: 'Average LOS for TIA in ASU'
  },
  // pTIAAdmitted: {
  //   name: 'pTIAAdmitted',
  //   val: 0.5,
  //   default: 0.5,
  //   type: 'percent',
  //   group: 'ED',
  //   label: '% TIA Admitted',
  //   helper: '% of TIA seen in ED admitted to ASU'
  // },
  pPSIIVTNegHASU: {
    name: 'pPSINegHASU',
    val: 0.5,
    default: 0.5,
    type: 'percent',
    group: 'ED',
    label: '% PSI Neg to HASU',
    help: '% PASTA +ve/PSI&IVT -ve admitted to HASU vs ASU'
  },
  pHASUOccupancy: {
    name: 'pHASUOccupancy',
    val: 0.75,
    default: 0.75,
    type: 'percent',
    group: 'Beds',
    label: '% HASU Bed Occupancy',
    help: 'Target % Occupancy of HASU Beds'
  },
  pASUOccupancy: {
    name: 'pASUOccupancy',
    val: 0.9,
    default: 0.9,
    type: 'percent',
    group: 'Beds',
    label: '% ASU Bed Occupancy',
    help: 'Target % Occupancy of HASU Beds'
  }
}
