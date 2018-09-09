import numeral from 'numeral'

export default {
  filters: {
    getHelper: function (param) {
      var x = ''
      if (param.type === undefined) {
        x = param.helper + ' (' + numeral(param.default).format('0%') + ')'
      } else {
        x = param.helper + ' (' + param.default + ')'
      }
      return x
    }
  },
  computed: {
    params: function () {
      return {
        ...this.poplnUserParams,
        ...this.psiUserParams,
        ...this.ivtUserParams,
        ...this.diversionUserParams,
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
    }
  }
}
