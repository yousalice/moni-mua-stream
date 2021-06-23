import initPreload from '/@preload/index'
import adminPage from '/@renderer/pages/admin/index.html'
// import stagePage from '/@renderer/pages/stage/index.html'
import logoUrl from '/@static/live.png'

type pagesType = {
  admin: string,
  // stage: string
}

export const pages: pagesType = {
  admin: adminPage
  // stage: stagePage
}

type preloadType = {
  init: string
}

export const preload: preloadType = {
  init: initPreload
}

type assetsType = {
  logo: string
}

export const assets: assetsType = {
  logo: logoUrl
}
