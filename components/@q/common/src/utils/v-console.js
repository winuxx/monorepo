import VConsole from 'vconsole'

import { isInDd } from '../lib/dd-api'

import { isDev } from '.'

// let vConsole = new VConsole()

if (isDev() && isInDd()) {
    // let vConsole = new window.VConsole()

    const vConsole = new VConsole()
}
