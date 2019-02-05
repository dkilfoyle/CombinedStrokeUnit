import numeral from 'numeral'

var n = function (mynum) {
  return numeral(mynum).format('0,0')
}
var n1 = function (mynum) {
  return numeral(mynum).format('0,0.1')
}

export default {
  computed: {
    nodes: function () {
      return [
        // ===================== Inputs
        {
          id: 'psitransfer',
          label: '*PSI Transfer*\nn = ' + n(this.nPSITransfer(this.year)),
          level: 0,
          group: 'start'
        },
        {
          id: 'diversions',
          label: '*Diversions*\nn = ' + n(this.getDiversions(this.year)),
          level: 0,
          group: 'start'
        },
        {
          id: 'adhbstroke',
          label: '*Stroke (ADHB)*\nn = ' + n(this.nADHBStroke(this.year)), // n(this.params.nADHBStroke.val),
          level: 0,
          font: {
            multi: 'md'
          },
          group: 'start'
        },
        {
          id: 'blank1',
          level: 0,
          hidden: true
        },
        {
          id: 'adhbtia',
          label: '*TIA (ADHB)*\nn = ' + n(this.nADHBTIA(this.year)),
          level: 0,
          group: 'start'
        },
        {
          id: 'otherstroke',
          label: `*WDHB <65y\nn = ${n(
            this.nRehabWDHBUnder65(this.year)
          )}\n*Other Specialty\nn = ${n(this.nRehabOtherStroke(this.year))}`,
          level: 0,
          group: 'start'
        },
        {
          id: 'nonstrokerehab',
          label: `*Nonstroke Rehab\nn = ${n(this.nRehabNonStroke(this.year))}`,
          level: 0,
          group: 'start'
        },
        // ===================== ED
        {
          id: 'psinegexternal',
          label:
            '*PSI / IVT -ve*\nExternal: ' +
            n(this.nPSIIVTNegExternal(this.year)),
          level: 1,
          group: 'norm'
        },
        {
          id: 'pastapos',
          label: '*PASTA +ve*\nn = ' + n(this.nPASTAPos(this.year)),
          level: 1,
          group: 'ed'
        },
        {
          id: 'psinegadhb',
          label: '*PSI / IVT -ve\nADHB: ' + n(this.nPSIIVTNegADHB(this.year)),
          level: 1,
          group: 'norm'
        },
        {
          id: 'pastaneg',
          label: '*PASTA -ve*\nADHB: ' + n(this.nPASTANeg(this.year)),
          level: 1,
          group: 'norm'
        },
        // {
        //   id: 'tiaed',
        //   label: '*TIA*\nADHB:' + n(this.nTIA(this.year)),
        //   level: 1,
        //   group: 'norm'
        // },
        // ==================== NR
        {
          id: 'psipos2',
          hidden: true,
          level: 2
        },
        {
          id: 'psipos',
          label:
            '*PSI*\nN= ' +
            n(this.nPSI(this.year)) +
            '\nTransfers: ' +
            n(this.nPSITransfer(this.year)) +
            '\nDiversions: ' +
            n(this.nPSIDiversions(this.year)) +
            '\nADHB: ' +
            n(this.nPSIADHB(this.year)) +
            '\n\n*IVT Only*\nN= ' +
            n(this.nIVT(this.year)) +
            '\nDiversions: ' +
            n(this.nIVTDiversions(this.year)) +
            '\nADHB: ' +
            n(this.nIVTADHB(this.year)),
          level: 2,
          group: 'ed'
        },
        {
          id: 'psipos3',
          hidden: true,
          level: 2
        },
        // {id: 'psipos3', label: '*PSI*\nN= ' + n(this.nPSI), level: 2},
        // ==================== ISU
        {
          id: 'repat',
          label: '*REPATRIATION*\nn = ' + n(this.nRepatriation(this.year)),
          level: 3,
          group: 'end',
          y: 2
        },
        {
          id: 'blank2',
          level: 3,
          hidden: true
        },
        {
          id: 'hasu',
          label: `*HASU*\nn = ${n(this.nHASU(this.year))}, LOS: ${n1(
            this.params.nHASULOS.val
          )}`,
          level: 3,
          group: 'norm'
        },
        {
          id: 'asu',
          label: `*ASU*\nStroke = ${n(this.nASUStroke(this.year))}, LOS: ${n1(
            this.params.nASULOSStroke.val
          )}\nTIA = ${n(this.nASUTIA(this.year))}, LOS: ${n1(
            this.params.nASULOSTIA.val
          )}`,
          level: 3,
          group: 'norm'
        },
        // {
        //   id: 'blank4',
        //   level: 3,
        //   hidden: true
        // },
        {
          id: 'rehab',
          label: `*Rehab*\nn = ${n(this.nRehabTotal(this.year))}, LOS: ${n1(
            this.params.nRehabLOS.val
          )}`,
          level: 3,
          group: 'norm'
        },
        // ================== discharge
        {
          id: 'discharge',
          label: `*ISU Discharges*\nn = ${n(this.nISUDischarge(this.year))}`,
          level: 4,
          x: 300,
          y: 500,
          physics: false,
          group: 'end'
        }
      ]
    }
  }
}
