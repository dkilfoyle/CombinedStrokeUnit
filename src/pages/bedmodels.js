export default {
  data () {
    return {
      bedUserParams: {
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
          val: 4.9,
          default: 4.5,
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
        pHASUOccupancy: {
          name: 'pHASUOccupancy',
          val: 0.75,
          default: 0.75,
          type: 'percent',
          group: 'Beds',
          label: '% HASU Bed Occupancy',
          helper: 'Target % Occupancy of HASU Beds'
        },
        pASUOccupancy: {
          name: 'pASUOccupancy',
          val: 0.85,
          default: 0.85,
          type: 'percent',
          group: 'Beds',
          label: '% ASU Bed Occupancy',
          helper: 'Target % Occupancy of HASU Beds'
        }
      }
    }
  },
  methods: {
    nRehabNeuroStroke: function (year) {
      return Math.round(
        this.nASUStroke(year) * this.params.pRehab.val
      )
    },
    nRehabTotal: function (year) {
      return this.nRehabNeuroStroke(year) + this.nRehabWDHBUnder65(year) + this.nRehabOtherStroke(year)
    },
    nHASU: function (year) {
      return Math.round(
        this.nPSIIVTNegADHB(year) * this.params.pPSIIVTNegHASU.val +
        this.nPSIIVT(year)
      )
    },
    nASU: function (year) {
      return this.nASUStroke(year) + this.nASUTIA(year)
    },
    nASUStroke: function (year) {
      return Math.round(
        this.nPASTANeg(year) +
        this.nPSIIVTNegADHB(year) * (1.0 - this.params.pPSIIVTNegHASU.val) +
        this.nHASU(year) -
        this.nPSIIVTExternal(year)
      )
    },
    nASUTIA: function (year) {
      return this.nADHBTIA(year)
    },

    nHASUBedDays: function (year) {
      return Math.round(this.nHASU(year) * this.params.nHASULOS.val)
    },
    nASUBedDays: function (year) {
      return Math.round(
        this.nASUStroke(year) * this.params.nASULOSStroke.val +
        this.nASUTIA(year) * this.params.nASULOSTIA.val
      )
    },
    nRehabBedDays: function (year) {
      return Math.round(this.nRehabTotal(year) * this.params.nRehabLOS.val)
    },

    nHASUBeds: function (year) {
      return Math.ceil(
        this.nHASUBedDays(year) * 1 / this.params.pHASUOccupancy.val / 365
      )
    },
    nASUBeds: function (year) {
      return Math.ceil(
        this.nASUBedDays(year) * 1 / this.params.pASUOccupancy.val / 365
      )
    },
    nRehabBeds: function (year) {
      return Math.ceil(
        this.nRehabBedDays(year) * 1 / this.params.pASUOccupancy.val / 365.0
      )
    },
    nTotalBeds: function (year) {
      return this.nHASUBeds(year) + this.nASUBeds(year) + this.nRehabBeds(year)
    }
  }
}
