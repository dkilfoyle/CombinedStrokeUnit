import numeral from 'numeral'

var n = function (mynum) {
  return numeral(mynum).format('0,0')
}

export default {
  computed: {
    nodes: function () {
      return [
        // ===================== Inputs
        {
          id: 'psitransfer',
          label: '*PSI Transfer*\nN=' + n(this.nPSITransfer),
          level: 0,
          group: 'start'
        },
        {
          id: 'diversions',
          label:
            '*Diversions*\nN=' +
            n(this.getDiversions(this.params.mDiversions.val)),
          level: 0,
          group: 'start'
        },
        {
          id: 'adhbstroke',
          label: '*Stroke (ADHB)*\nN=' + n(this.params.nADHBStroke.val),
          level: 0,
          font: {multi: 'md'},
          group: 'start'
        },
        {
          id: 'blank1',
          level: 0,
          hidden: true
        },
        {
          id: 'adhbtia',
          label: '*TIA (ADHB)*\nN=' + n(this.params.nADHBTIA.val),
          level: 0,
          group: 'start'
        },
        {
          id: 'wdhbstroke',
          label: `*WDHB <65y\nn = ${n(this.params.nWDHBUnder65.val)}`,
          level: 0,
          group: 'start'
        },
        // ===================== ED
        {
          id: 'psinegexternal',
          label: '*PSI -ve*\nExternal: ' + n(this.nPSINegExternal),
          level: 1,
          group: 'norm'
        },
        {
          id: 'pastapos',
          label: '*PASTA +ve*\nn = ' + n(this.nPASTAPos),
          level: 1,
          group: 'ed'
        },
        {
          id: 'psinegadhb',
          label: '*PSI -ve\nADHB: ' + n(this.nPSINegADHB),
          level: 1,
          group: 'norm'
        },
        {
          id: 'pastaneg',
          label: '*PASTA -ve*\nADHB: ' + n(this.nPASTANeg),
          level: 1,
          group: 'norm'
        },
        {
          id: 'tiaed',
          label: '*TIA*\nADHB:' + n(this.nTIA),
          level: 1,
          group: 'norm'
        },
        // ==================== NR
        {id: 'psipos2', hidden: true, level: 2},
        {
          id: 'psipos',
          label: '*PSI*\nN= ' + n(this.nPSI),
          level: 2,
          group: 'ed'
        },
        {id: 'psipos3', hidden: true, level: 2},
        // {id: 'psipos3', label: '*PSI*\nN= ' + n(this.nPSI), level: 2},
        // ==================== ISU
        {
          id: 'repat',
          label: '*REPATRIATION*\nN = ' + n(this.nRepatriation),
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
          label: `*HASU* n=${n(this.nHASU)}\nPSI External: ${n(
            this.nPSIExternal
          )}\nLOS: ${n(this.params.nHASULOS.val)}`,
          level: 3,
          group: 'norm'
        },
        {
          id: 'asu',
          label: `*ASU*\nStroke = ${n(this.nASUStroke)}, LOS: ${n(
            this.params.nASULOSStroke.val
          )}\nTIA = ${n(this.nASUTIA)}, LOS: ${n(this.params.nASULOSTIA.val)}`,
          level: 3,
          group: 'norm'
        },
        {
          id: 'rehab',
          label: `*Rehab*\nn = ${n(this.nRehab)}, LOS: ${n(
            this.params.nRehabLOS.val
          )}`,
          level: 3,
          group: 'norm'
        },
        // ================== discharge
        {
          id: 'discharge',
          label: `*Discharge*\nn = ${n(this.nDischarge)}`,
          level: 4,
          group: 'end'
        }
      ]
    }
  }
}
