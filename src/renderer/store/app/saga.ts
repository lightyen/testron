import { request, subscibeChannel, consoleChannel } from "~/ipc"
import { put, take, fork, all, call, takeEvery, takeLeading } from "redux-saga/effects"

import {
    GET_APP_MAXIMIZED,
    GET_APP_VERSION,
    GET_TITLEBAR_HIDE,
    GET_APP_CPU_USAGE,
    GET_APP_SYSTEM_MEMORY,
    GetAppMaximizedAction,
    GetAppVersionAction,
    GetAppTitleBarHideAction,
    GetAppCpuUsageAction,
    GetAppSystemMemoryAction,
    AUTO_UPDATE_AVAILABLE,
    AUTO_UPDATE_DOWNLOADED,
    AUTO_UPDATE_PROGRESS,
    AutoUpdateAvailableAction,
    AutoUpdateDownloadedAction,
    AutoUpdateProgressAction,
    AUTO_UPDATE_DOWNLOAD,
    AUTO_UPDATE_RESTART,
} from "./action"
import { UpdateDownloadProgress, UpdateInfo } from "./model"

function* getAppVersion() {
    try {
        const version = yield call(request, "app.get-versions")
        yield put<GetAppVersionAction>({ type: GET_APP_VERSION.SUCCESS, version })
    } catch (e) {}
}

function* getCPUUsage() {
    try {
        const usage = yield call(request, "app.get-cpuusage")
        yield put<GetAppCpuUsageAction>({ type: GET_APP_CPU_USAGE.SUCCESS, usage })
    } catch (e) {}
}

function* getSystemMemory() {
    try {
        const usage = yield call(request, "app.get-sysmem-info")
        yield put<GetAppSystemMemoryAction>({ type: GET_APP_SYSTEM_MEMORY.SUCCESS, usage })
    } catch (e) {}
}

function* subscribeWindowFullScreen() {
    const chan = yield subscibeChannel("window.fullscreen")
    while (true) {
        const isFullScreen: boolean = yield take(chan)
        yield put<GetAppTitleBarHideAction>({ type: GET_TITLEBAR_HIDE, hide: isFullScreen })
    }
}

function* subscribeWindowMaxmized() {
    const chan = yield subscibeChannel("window.maximized")
    while (true) {
        const maximized: boolean = yield take(chan)
        yield put<GetAppMaximizedAction>({ type: GET_APP_MAXIMIZED, maximized })
    }
}

function* subscribeUpdateAvailable() {
    const chan = yield subscibeChannel("update-available")
    const info: UpdateInfo = yield take(chan)
    yield put<AutoUpdateAvailableAction>({ type: AUTO_UPDATE_AVAILABLE, info })
}

function* subscribeUpdateDownloaded() {
    const chan = yield subscibeChannel("update-downloaded")
    const info: UpdateInfo = yield take(chan)
    yield put<AutoUpdateDownloadedAction>({ type: AUTO_UPDATE_DOWNLOADED, info })
}

function* subscribeUpdateDownloadProgress() {
    const chan = yield subscibeChannel("download-progress")
    while (true) {
        const info: UpdateDownloadProgress = yield take(chan)
        yield put<AutoUpdateProgressAction>({ type: AUTO_UPDATE_PROGRESS, info })
    }
}

function* updateDownload() {
    try {
        yield call(request, "update-download")
    } catch (e) {}
}

function* updateRestart() {
    try {
        yield call(request, "update-restart")
    } catch (e) {}
}

function* sysemConsoleLog() {
    const chan = yield consoleChannel("console.log")
    while (true) {
        const obj: { message: unknown; optionalParams: unknown[] } = yield take(chan)
        if (obj.message || obj.optionalParams.length) {
            console.log(obj.message, ...obj.optionalParams)
        }
    }
}

function* sysemConsoleWarning() {
    const chan = yield consoleChannel("console.warn")
    while (true) {
        const obj: { message: unknown; optionalParams: unknown[] } = yield take(chan)
        if (obj.message || obj.optionalParams.length) {
            console.warn(obj.message, ...obj.optionalParams)
        }
    }
}

function* sysemConsoleError() {
    const chan = yield consoleChannel("console.error")
    while (true) {
        const obj: { message: unknown; optionalParams: unknown[] } = yield take(chan)
        if (obj.message || obj.optionalParams.length) {
            console.error(obj.message, ...obj.optionalParams)
        }
    }
}

function* sysemConsoleClear() {
    const chan = yield consoleChannel("console.clear")
    while (true) {
        yield take(chan)
        console.clear()
    }
}

export default function* sagas() {
    yield takeEvery(GET_APP_VERSION.REQUEST, getAppVersion)
    yield takeEvery(GET_APP_CPU_USAGE.REQUEST, getCPUUsage)
    yield takeEvery(GET_APP_SYSTEM_MEMORY.REQUEST, getSystemMemory)
    yield takeLeading(AUTO_UPDATE_DOWNLOAD, updateDownload)
    yield takeLeading(AUTO_UPDATE_RESTART, updateRestart)
    yield fork(subscribeWindowFullScreen)
    yield fork(subscribeWindowMaxmized)
    yield fork(subscribeUpdateAvailable)
    yield fork(subscribeUpdateDownloaded)
    yield fork(subscribeUpdateDownloadProgress)
    yield fork(sysemConsoleLog)
    yield fork(sysemConsoleWarning)
    yield fork(sysemConsoleError)
    yield fork(sysemConsoleClear)
}
