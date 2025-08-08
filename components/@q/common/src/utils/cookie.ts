import Cookies from 'js-cookie'

import config from '@/../config'

const get = Cookies.get
const set = Cookies.set

export function getTgt(): string {
    return get('tgt') || ''
}

export function setTgt(tgt: string): void {
    set('tgt', tgt, { expires: config.cookieExpires })
}

export function getToken(): string {
    return get('token') || ''
}

export function setToken(token: string): void {
    set('token', token, { expires: config.cookieExpires })
}

export function getAccessToken(): string {
    return get('AccessToken') || ''
}

export function setAccessToken(token: string, expires: number): void {
    set('AccessToken', token, { expires: expires })
}

export function getUserId(): string {
    return get('userId') || ''
}

export function setUserId(userId: string): void {
    set('userId', userId, { expires: config.cookieExpires })
}

export function getUsername(): string {
    return get('username') || ''
}

export function setUsername(username: string): void {
    set('username', username, { expires: config.cookieExpires })
}

export function getNickname(): string {
    return get('nickname') || ''
}

export function setNickname(nickname: string): void {
    set('nickname', nickname, { expires: config.cookieExpires })
}

export function getRoles(): any[] {
    return JSON.parse(get('roles') || '[]')
}

export function setRoles(roles: string): void {
    set('roles', roles, { expires: config.cookieExpires })
}

export function getDataRights(): string {
    return get('DataRights') || ''
}

export function setDataRights(DataRights: string): void {
    set('DataRights', DataRights, { expires: config.cookieExpires })
}

export function getAreaName(): string {
    return get('areaName') || ''
}

export function setAreaName(areaName: string): void {
    set('areaName', areaName, { expires: config.cookieExpires })
}

export function getACode(): string {
    return get('ACode') || ''
}

export function setACode(ACode: string): void {
    set('ACode', ACode, { expires: config.cookieExpires })
}

export function getACodes(): any[] {
    return JSON.parse(get('acodes') || '[]')
}
