import numeral from 'numeral'

var n = function (mynum) {
  return numeral(mynum).format('0,0')
}
var p = function (mynum) {
  return numeral(mynum).format('0%')
}
export default {
  computed: {
    edges: function () {
      return [
        {
          from: 'psitransfer',
          to: 'pastapos',
          value: this.nPSITransfer
        },
        {
          from: 'diversions',
          to: 'pastapos',
          value: this.getDiversions(this.params.mDiversions.val)
        },
        {
          from: 'adhbstroke',
          to: 'pastapos',
          label:
            p(this.params.pPASTAPos.val) + ' +ve\nn = ' + this.nPASTAPosADHB,
          value: this.nPASTAPosADHB
        },
        {
          from: 'adhbstroke',
          to: 'pastaneg',
          label:
            p(1.0 - this.params.pPASTAPos.val) + ' -ve\nn = ' + this.nPASTANeg,
          value: this.nPASTANeg
        },
        {
          from: 'adhbtia',
          to: 'tiaed'
        },
        {
          from: 'wdhbstroke',
          to: 'rehab',
          value: this.nWDHBUnder65
        },
        // ======================== Inside ED
        {
          from: 'pastapos',
          to: 'psinegexternal',
          value: this.nPSINegExternal
        },
        {
          from: 'pastapos',
          to: 'psinegadhb',
          value: this.nPSINegADHB
        },
        // ======================= ED to PSI
        {
          from: 'pastapos',
          to: 'psipos',
          value: this.nPSI
        },
        // ==================== ED TO ISU
        {
          from: 'psinegexternal',
          to: 'repat',
          value: this.nPSINegExternal
        },
        {
          from: 'psipos',
          to: 'hasu',
          value: this.nPSI
        },
        {
          from: 'psipos',
          to: 'repat',
          dashes: true,
          label: 'Future?'
        },
        {
          from: 'psinegadhb',
          to: 'hasu',
          label:
            p(this.params.pPSINegHASU.val) +
            '\nn = ' +
            n(this.params.pPSINegHASU.val * this.nPSINegADHB)
        },
        {
          from: 'psinegadhb',
          to: 'asu',
          label:
            p(1.0 - this.params.pPSINegHASU.val) +
            '\nn = ' +
            n((1.0 - this.params.pPSINegHASU.val) * this.nPSINegADHB)
        },
        {
          from: 'pastaneg',
          to: 'asu',
          value: this.nPASTANeg
        },
        {
          from: 'tiaed',
          to: 'asu',
          label: p(this.params.pTIAAdmitted.val) + ' Admitted',
          value: this.params.pTIAAdmitted.val * this.nTIA
        },
        {
          from: 'hasu',
          to: 'repat',
          label: n(this.nPSIExternal) + ' PSI',
          value: this.nPSIExternal
        },
        {
          from: 'hasu',
          to: 'asu',
          label: n(this.nHASU - this.nPSIExternal),
          value: this.nHASU - this.nPSIExternal
        },
        {
          from: 'asu',
          to: 'rehab',
          label: p(this.params.pRehab.val) + ' Stroke',
          value: this.nASUStroke * this.params.pRehab.val
        },
        {
          from: 'asu',
          to: 'discharge',
          label: n(
            this.nASUTIA + this.nASUStroke * (1 - this.params.pRehab.val)
          ),
          value: this.nASUTIA + this.nASUStroke * (1 - this.params.pRehab.val)
        },
        {
          from: 'rehab',
          to: 'discharge',
          value: this.nRehab
        }
      ]
    }
  }
}
