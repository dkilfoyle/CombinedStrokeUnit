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
          label: '*PSI Transfer*\nN=' + n(this.nPSITransfer(this.year)),
          level: 0,
          group: 'start'
        },
        {
          id: 'diversions',
          label:
            '*Diversions*\nN=' +
            n(this.getDiversions(this.year, this.params.mDiversions.val)),
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
          label: '*TIA (ADHB)*\nN=' + n(this.nADHBTIA(this.year)),
          level: 0,
          group: 'start'
        },
        {
          id: 'wdhbstroke',
          label: `*WDHB <65y\nn = ${n(this.nWDHBUnder65(this.year))}`,
          level: 0,
          group: 'start'
        },
        // ===================== ED
        {
          id: 'psinegexternal',
          label: '*PSI -ve*\nExternal: ' + n(this.nPSINegExternal(this.year)),
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
          label: '*PSI -ve\nADHB: ' + n(this.nPSINegADHB(this.year)),
          level: 1,
          group: 'norm'
        },
        {
          id: 'pastaneg',
          label: '*PASTA -ve*\nADHB: ' + n(this.nPASTANeg(this.year)),
          level: 1,
          group: 'norm'
        },
        {
          id: 'tiaed',
          label: '*TIA*\nADHB:' + n(this.nTIA(this.year)),
          level: 1,
          group: 'norm'
        },
        // ==================== NR
        {id: 'psipos2', hidden: true, level: 2},
        {
          id: 'psipos',
          label: '*PSI*\nN= ' + n(this.nPSI(this.year)),
          level: 2,
          group: 'ed'
        },
        {id: 'psipos3', hidden: true, level: 2},
        // {id: 'psipos3', label: '*PSI*\nN= ' + n(this.nPSI), level: 2},
        // ==================== ISU
        {
          id: 'repat',
          label: '*REPATRIATION*\nN = ' + n(this.nRepatriation(this.year)),
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
          label: `*HASU* n=${n(this.nHASU(this.year))}\nPSI External: ${n(
            this.nPSIExternal(this.year)
          )}\nLOS: ${n(this.params.nHASULOS.val)}`,
          level: 3,
          group: 'norm'
        },
        {
          id: 'asu',
          label: `*ASU*\nStroke = ${n(this.nASUStroke(this.year))}, LOS: ${n(
            this.params.nASULOSStroke.val
          )}\nTIA = ${n(this.nASUTIA(this.year))}, LOS: ${n(
            this.params.nASULOSTIA.val
          )}`,
          level: 3,
          group: 'norm'
        },
        {
          id: 'rehab',
          label: `*Rehab*\nn = ${n(this.nRehab(this.year))}, LOS: ${n(
            this.params.nRehabLOS.val
          )}`,
          level: 3,
          group: 'norm'
        },
        // ================== discharge
        {
          id: 'discharge',
          label: `*Discharge*\nn = ${n(this.nDischarge(this.year))}`,
          level: 4,
          group: 'end'
        }
      ]
    }
  }
}
