export default {
  data () {
    return {
      populations: {
        ADHB: 523500,
        BOP: 231900,
        Canterbury: 551400,
        CaC: 312700,
        CMDHB: 546600,
        HawkesBay: 163900,
        HuttValley: 147900,
        Lakes: 108500,
        MidCentral: 176600,
        NelsonMarlborough: 148800,
        Northland: 175400,
        SouthCanterbury: 59600,
        Southern: 324300,
        Tairawhiti: 48500,
        Taranaki: 118100,
        Waikato: 408800,
        Wairarapa: 44500,
        Waitemata: 606000,
        WestCoast: 32500,
        Whanganui: 64100
      },
      poplnParams: {
        pIncidence: 192 / 100000, // ARCOS4 incidence of first or recurrent all stroke including SAH
        pHospitalised: 0.86,
        pAdults: 0.8,
        pNotSAH: 0.96,
        pIschemic: 0.88 // proportion of not SAH - from ADT145
      },
      poplnUserParams: {
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
        nRehabWDHBUnder65: {
          name: 'nRehabWDHBUnder65',
          val: 30,
          default: 30,
          type: 'number',
          group: 'Populations',
          label: '# WDHB <65 Stroke Rehab',
          helper: 'Number of WDHB area <65y stroke rehab patients'
        },
        nRehabOtherStroke: {
          name: 'nRehabOtherStroke',
          val: 21 + 15 + 3 + 1,
          default: 21 + 15 + 3 + 1,
          type: 'number',
          group: 'Populations',
          label: '# Non-Neuro Stroke Rehab',
          helper: 'Number of patients from other specialties (eg Gen Med) requiring stroke rehab'
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
        }
      }
    }
  },
  methods: {
    getRegionTotalPopulation: function (region) {
      switch (region) {
        case 'Metro':
          return this.populations.ADHB + this.populations.CMDHB + this.populations.Waitemata
        case 'NonMetro':
          return this.populations.Northland + this.populations.HawkesBay + this.populations.Lakes + this.populations.Tairawhiti + this.populations.Taranaki + this.populations.Waikato
        case 'MetroNonADHB':
          return this.populations.CMDHB + this.populations.Waitemata
        case 'WTK':
          return 217402
        default:
          return 0
      }
    },
    getAllAdultStrokeByDHB: function (DHB, year, popGrowth) {
      // = totalpopln * annual growth * adults * incidence * hospitalised * notSAH
      return Math.round(
        this.populations[DHB] *
        (1.0 + popGrowth) ** (year - 2017) *
        this.poplnParams.pAdults *
        this.poplnParams.pIncidence *
        this.poplnParams.pHospitalised *
        this.poplnParams.pNotSAH
      )
    },
    getAllAdultStrokeByRegion: function (region, year, popGrowth) {
      // = totalpopln * annual growth * adults * incidence * hospitalised * notSAH
      return Math.round(
        this.getRegionTotalPopulation(region) *
        (1.0 + popGrowth) ** (year - 2017) *
        this.poplnParams.pAdults *
        this.poplnParams.pIncidence *
        this.poplnParams.pHospitalised *
        this.poplnParams.pNotSAH
      )
    },
    getIschemicAdultStrokeByRegion: function (Region, year, popGrowth) {
      return Math.round(this.getAllAdultStrokeByRegion(Region, year, popGrowth) * 0.81)
    },
    nADHBStroke: function (year) {
      return Math.round(
        this.params.nADHBStroke.val *
        (1.0 + this.params.popGrowth.val) ** (year - 2017)
      )
    },
    nADHBTIA: function (year) {
      return Math.round(
        this.params.nADHBTIA.val *
        (1.0 + this.params.popGrowth.val) ** (year - 2017)
      )
    },
    nRehabWDHBUnder65: function (year) {
      return Math.round(
        this.params.nRehabWDHBUnder65.val *
        (1.0 + this.params.popGrowth.val) ** (year - 2017)
      )
    },
    nRehabOtherStroke: function (year) {
      return Math.round(
        this.params.nRehabOtherStroke.val *
        (1.0 + this.params.popGrowth.val) ** (year - 2017)
      )
    }

  }
}
