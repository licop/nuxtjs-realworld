import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from '@nuxt/ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _a4daf778 = () => interopDefault(import('../pages/layout' /* webpackChunkName: "" */))
const _1a8bfc79 = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _372bdb0f = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _166fb862 = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _357c66bd = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _bc78aaf2 = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _7c0c946a = () => interopDefault(import('../pages/acticle' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'hash',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _a4daf778,
    children: [{
      path: "",
      component: _1a8bfc79,
      name: "home"
    }, {
      path: "/login",
      component: _372bdb0f,
      name: "login"
    }, {
      path: "/register",
      component: _372bdb0f,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _166fb862,
      name: "profile"
    }, {
      path: "/settings",
      component: _357c66bd,
      name: "settings"
    }, {
      path: "/editor",
      component: _bc78aaf2,
      name: "editor"
    }, {
      path: "/acticle/:slug",
      component: _7c0c946a,
      name: "acticle"
    }]
  }],

  fallback: false
}

function decodeObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = decode(obj[key])
    }
  }
}

export function createRouter () {
  const router = new Router(routerOptions)

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    const r = resolve(to, current, append)
    if (r && r.resolved && r.resolved.query) {
      decodeObj(r.resolved.query)
    }
    return r
  }

  return router
}
