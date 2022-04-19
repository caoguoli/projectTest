<template>
  <NavBar
    :title="deviceName || title"
    :background="navbarStatusHash[navbarStatus].background"
    :left-content-style="
      `color:${navbarStatusHash[navbarStatus].leftContentColor}`
    "
    :title-content-style="
      `color:${navbarStatusHash[navbarStatus].rightContentColor}`
    "
    :right-content-style="
      `color:${navbarStatusHash[navbarStatus].rightContentColor}`
    "
    :right-icon="$mx.query.isOwner === '2' ? 'none' : 'icon-menu'"
    @back="$mx.page.closeWebView({})"
    @rightClick="goDetail()"
  >
    <template v-slot:right>
      <slot name="right"></slot>
    </template>
  </NavBar>
</template>
<script>
import NavBar from '@/components/NavBar'
import goDetail from '@/mixin/goDetail'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'

export default {
  name: 'BIZNavBar',

  components: {
    NavBar
  },
  mixins: [goDetail],

  props: {
    barColorType: {
      default: 'transparent',
      type: String
    },
    title: {
      default: '',
      type: String
    }
  },

  data() {
    return {
      devicePic: '',
      deviceName: '',
      navbarStatus: this.barColorType,
      navbarStatusHash: {
        transparent: {
          leftContentColor: '#fff',
          rightContentColor: '#fff',
          background: 'transparent'
        },
        transparentBlack: {
          leftContentColor: '#000',
          rightContentColor: '#000',
          background: 'transparent'
        },
        white: {
          leftContentColor: '#183B56',
          rightContentColor: '#183B56',
          background: '#fff'
        }
      }
    }
  },
  watch: {
    barColorType() {
      this.navbarStatus = this.barColorType
    }
  },

  mounted() {
    this.getName()
    document.addEventListener('visibilitychange', this.getName)
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('visibilitychange', this.getName)
  },
  methods: {
    getName() {
      if (parseUrl('groupId')) {
        this.$mx.request.fetchOwnServer(
          {
            url: `app/v1/device/group/ctrl/info`,
            method: 'GET',
            data: {
              group_id: parseUrl('groupId')
            }
          },
          res => {
            if (+res.code === 0) {
              this.deviceName = res.data.name
            }
          }
        )
      } else {
        // 获取产品详情
        this.$mx.request.fetch(
          {
            url: '/uc/getByAccountAndDev',
            method: 'GET',
            data: {},
            authType: 'iotAuth',
            version: '1.0.2'
          },
          res => {
            if (+res.code === 200) {
              this.devicePic = res.data.productImage || res.data.categoryImage
              this.deviceName = res.data.nickName || res.data.productName
            }
          }
        )
      }
    },
    handleScroll() {
      const top = document.documentElement.scrollTop || document.body.scrollTop
      if (top > 40) {
        this.navbarStatus = 'white'
        return
      } else {
        this.navbarStatus = this.barColorType
      }
    }
  }
}
</script>
