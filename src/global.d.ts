declare module 'dsbridge'
import { MXSMART } from '@/utils/MXSMART'

declare module 'vue/types/vue' {
  interface Vue {
    $mx: MXSMART
  }
}
