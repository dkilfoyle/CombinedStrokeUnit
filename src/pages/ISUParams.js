module.exports = {
  nDiversions: {
    name: 'nDiversions',
    val: 356,
    default: 356,
    group: 'Populations',
    label: 'Diversion Model',
    helper: 'Number of Ambulance Diversions from WDHB and CMDHB / year',
    type: 'select',
    options: [
      {label: 'Status Quo', value: 40},
      {label: 'Pragmatic', value: 215},
      {label: 'Expanded', value: 356},
      {label: 'Future', value: 614}
    ]
  },
  nADHBStroke: {
    name: 'nADHBStroke',
    val: 700,
    default: 700,
    type: 'number',
    group: 'Populations',
    label: '# ADHB Stroke',
    helper: 'Number of ADHB area stroke admissions per year'
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
    val: 0.2,
    default: 0.2,
    type: 'percent',
    group: 'ED',
    label: '% PASTA Positive',
    helper: '% of stroke that is PASTA Positive'
  },
  pRehab: {
    name: 'pRehab',
    val: 0.28,
    default: 0.28,
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
    val: 22,
    default: 22,
    min: 2,
    max: 100,
    type: 'slider',
    group: 'Rehab',
    label: 'Rehab LOS',
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
    label: 'LOS Stroke in ASU',
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
    label: 'LOS TIA',
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
  pPSINegHASU: {
    name: 'pPSINegHASU',
    val: 0.5,
    default: 0.5,
    type: 'percent',
    group: 'ED',
    label: '% PSI Neg to HASU',
    help: '% PASTA +ve/PSI -ve admitted to HASU vs ASU'
  }
}
