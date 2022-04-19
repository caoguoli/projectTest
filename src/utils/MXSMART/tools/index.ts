export const parseUrl = (variable: string) => {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return ''
}
// 兼容app参数从ua拿
export const parseAppParams = () => {
  let app = ''
  window.navigator.userAgent.split(' ').forEach(v => {
    if (v.includes('app/')) {
      app = v.split('/')[1]
    }
  })
  if (!app) {
    app = parseUrl('app')
  }
  return app
}
