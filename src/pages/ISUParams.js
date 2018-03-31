module.exports = {
  mDiversions: {
    name: 'mDiversions',
    val: 'pragmatic',
    default: 'pragmatic',
    group: 'ED',
    label: 'Diversion Model',
    helper: 'Number of Ambulance Diversions from WDHB and CMDHB / year',
    type: 'select',
    options: [
      {label: 'Status Quo (WTK)', value: 'statusquo'},
      {label: 'Pragmatic (WDHB+CMDHB)', value: 'pragmatic'},
      {label: 'Expanded (0-24h duration)', value: 'expanded'},
      {label: 'Future (24/7)', value: 'future'}
    ]
  },
  nADHBStroke: {
    name: 'nADHBStroke',
    val: 650,
    default: 650,
    type: 'number',
    group: 'Populations',
    label: '# ADHB Stroke',
    helper: 'Number of ADHB area stroke admissions per year in 2017'
  },
  nADHBTIA: {
    name: 'nADHBTIA',
    val: 200,
    default: 200,
    type: 'number',
    group: 'Populations',
    label: '# ADHB TIA',
    helper: 'Number of ADHB area TIA presentations to ED per year'
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
    val: 0.02,
    default: 0.02,
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
    val: 'expanded',
    default: 'expanded',
    group: 'Neuroradiology',
    label: 'PSI Model',
    helper: 'Number of PSI (all areas) / year',
    type: 'select',
    options: [
      {label: 'Status Quo', value: 'statusquo'},
      {label: 'Pragmatic', value: 'pragmatic'},
      {label: 'Expanded', value: 'expanded'},
      {label: 'Future', value: 'future'}
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
    val: 0.33,
    default: 0.33,
    type: 'percent',
    group: 'Rehab',
    label: '% Rehab',
    helper: '% of Stroke patients in ASU needing inpatient rehab'
  },
  nRehabLOS: {
    name: 'nRehabLOS',
    val: 22,
    default: 22,
    min: 2,
    max: 100,
    type: 'slider',
    group: 'Rehab',
    label: 'Rehab LOS',
    helper: 'Average LOS in rehab bed'
  },
  nHASULOS: {
    name: 'nHASULOS',
    val: 2,
    default: 2,
    min: 1,
    max: 10,
    type: 'slider',
    group: 'HASU/ASU',
    label: 'HASU LOS',
    helper: 'Average LOS in rehab bed'
  },
  nASULOSStroke: {
    name: 'nASULOSStroke',
    val: 4,
    default: 4,
    min: 1,
    max: 20,
    type: 'slider',
    group: 'HASU/ASU',
    label: 'ASU LOS Stroke',
    helper: 'Average LOS in for stroke patient in ASU'
  },
  nASULOSTIA: {
    name: 'nASULOSTIA',
    val: 1,
    default: 1,
    min: 1,
    max: 10,
    type: 'slider',
    group: 'HASU/ASU',
    label: 'ASU LOS TIA',
    helper: 'Average LOS for TIA in ASU'
  },
  pTIAAdmitted: {
    name: 'pTIAAdmitted',
    val: 0.5,
    default: 0.5,
    type: 'percent',
    group: 'ED',
    label: '% TIA Admitted',
    helper: '% of TIA seen in ED admitted to ASU'
  },
  pPSIIVTNegHASU: {
    name: 'pPSINegHASU',
    val: 0.2,
    default: 0.2,
    type: 'percent',
    group: 'ED',
    label: '% PSI Neg to HASU',
    help: '% PASTA +ve/PSI -ve admitted to HASU vs ASU'
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
