import initPreload from '/@preload/index'
import adminPage from '/@renderer/pages/admin/index.html'
import updatePage from '/@renderer/pages/update/index.html'
import logoUrl from '/@static/live.png'

type pagesType = {
  admin: string,
  update: string
}

export const pages: pagesType = {
  admin: adminPage,
  update: updatePage
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
