
const cookieparser = process.server ? require('cookieparser') : undefined

// 在服务器端运行的都是一个实例
// 为了防止数据冲突，务必要把state定义成一个函数，返回数据对象
export const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const actions = {
  // nuxtServerInit是一个特殊的action
  // 这个action会在服务器渲染期间自动调用
  // 初始化容器数据，传递数据给客户端使用
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    
    // 如果请求头中有cookie
    if(req.headers.cookie) {
      // 使用cookieparser把cookie字符串转化为Javascript对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch(err) {

      }
    }

    commit('setUser', user)
  }
}
