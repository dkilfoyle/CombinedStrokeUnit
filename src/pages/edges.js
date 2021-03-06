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
          value: this.nPSITransfer(this.year)
        },
        {
          from: 'diversions',
          to: 'pastapos',
          value: this.getDiversions(this.year)
        },
        {
          from: 'adhbstroke',
          to: 'pastapos',
          label:
            p(this.params.pPASTAPos.val) +
            ' +ve\nn = ' +
            n(this.nPASTAPosADHB(this.year)),
          value: this.nPASTAPosADHB(this.year)
        },
        {
          from: 'adhbstroke',
          to: 'pastaneg',
          label:
            p(1.0 - this.params.pPASTAPos.val) +
            ' -ve\nn = ' +
            n(this.nPASTANeg(this.year)),
          value: this.nPASTANeg(this.year)
        },
        // {
        //   from: 'adhbtia',
        //   to: 'tiaed'
        // },
        {
          from: 'otherstroke',
          to: 'rehab',
          value:
            this.nRehabWDHBUnder65(this.year) +
            this.nRehabOtherStroke(this.year)
        },
        {
          from: 'nonstrokerehab',
          to: 'rehab',
          value: this.nRehabNonStroke(this.year)
        },
        // ======================== Inside ED
        {
          from: 'pastapos',
          to: 'psinegexternal',
          value: this.nPSIIVTNegExternal(this.year)
        },
        {
          from: 'pastapos',
          to: 'psinegadhb',
          value: this.nPSIIVTNegADHB(this.year)
        },
        // ======================= ED to PSI
        {
          from: 'pastapos',
          to: 'psipos',
          value: this.nPSI(this.year)
        },
        // ==================== ED TO ISU
        {
          from: 'psinegexternal',
          to: 'repat',
          value: this.nPSIIVTNegExternal(this.year)
        },
        {
          from: 'psipos',
          to: 'hasu',
          value: this.nPSIIVT(this.year),
          label: n(this.nPSIIVT(this.year))
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
            p(this.params.pPSIIVTNegHASU.val) +
            '\nn = ' +
            n(this.params.pPSIIVTNegHASU.val * this.nPSIIVTNegADHB(this.year))
        },
        {
          from: 'psinegadhb',
          to: 'asu',
          label:
            p(1.0 - this.params.pPSIIVTNegHASU.val) +
            '\nn = ' +
            n(
              (1.0 - this.params.pPSIIVTNegHASU.val) *
                this.nPSIIVTNegADHB(this.year)
            )
        },
        {
          from: 'pastaneg',
          to: 'asu',
          value: this.nPASTANeg(this.year)
        },
        {
          from: 'adhbtia',
          to: 'asu',
          // label: p(this.params.pTIAAdmitted.val) + ' Admitted',
          value: this.nADHBTIA(this.year) // * this.params.pTIAAdmitted.val
        },
        {
          from: 'hasu',
          to: 'repat',
          dashes: true,
          smooth: {
            enabled: true,
            type: 'curvedCCW'
          },
          label:
            n(this.nPSIIVTExternal(this.year)) + ' PSI/Diversion\nRepatriation',
          value: this.nPSIIVTExternal(this.year)
        },
        {
          from: 'hasu',
          to: 'asu',
          label: n(this.nHASU(this.year) - this.nPSIIVTExternal(this.year)),
          value: this.nHASU(this.year) - this.nPSIIVTExternal(this.year)
        },
        {
          from: 'asu',
          to: 'rehab',
          label:
            p(this.params.pRehab.val) +
            ' Stroke\n n = ' +
            this.nRehabNeuroStroke(this.year),
          value: this.nRehabNeuroStroke(this.year)
        },
        {
          from: 'hasu',
          to: 'discharge',
          dashes: true,
          label:
            n(this.nPSIIVTExternal(this.year)) + ' PSI/Diversion\nRepatriation',
          value: this.nPSIIVTExternal(this.year),

          smooth: {
            enabled: true,
            type: 'curvedCW'
          }
        },
        {
          from: 'asu',
          to: 'discharge',
          label: n(
            this.nASUTIA(this.year) +
              this.nASUStroke(this.year) * (1 - this.params.pRehab.val)
          ),
          value:
            this.nASUTIA(this.year) +
            this.nASUStroke(this.year) * (1 - this.params.pRehab.val)
        },
        {
          from: 'rehab',
          to: 'discharge',
          value: this.nRehabTotal(this.year)
        }
      ]
    }
  }
}
