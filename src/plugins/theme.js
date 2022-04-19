import { parseAppParams } from '@/utils/MXSMART/tools/index.ts'
import { APP } from '@/utils/MXSMART/config'

export function initTheme() {
  document.documentElement.setAttribute('data-theme', APP[parseAppParams()])
}
