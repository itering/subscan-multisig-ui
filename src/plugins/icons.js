import Vue from 'vue'
import IconSvg from 'Views/Components/Icon-svg'// svg组件
// register globally

Vue.component('icon-svg', IconSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../assets/icons', false, /\.svg$/)
requireAll(req)
