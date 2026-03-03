import { Capacitor } from '@capacitor/core'

async function getPlugin() {
  console.log('[Notification] getPlugin — platform:', Capacitor.getPlatform(), 'isNative:', Capacitor.isNativePlatform())
  if (!Capacitor.isNativePlatform()) {
    console.log('[Notification] Not native platform, returning null')
    return null
  }
  try {
    const { ForegroundService } = await import(
      '@capawesome-team/capacitor-android-foreground-service'
    )
    console.log('[Notification] ForegroundService plugin loaded successfully')
    return ForegroundService
  } catch (e) {
    console.error('[Notification] Failed to load ForegroundService plugin:', e)
    return null
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  console.log('[Notification] requestNotificationPermission called')
  const plugin = await getPlugin()
  if (!plugin) {
    console.log('[Notification] No plugin available, skipping permission request')
    return false
  }

  try {
    const perms = await plugin.checkPermissions()
    console.log('[Notification] checkPermissions result:', JSON.stringify(perms))
    if (perms.display === 'granted') return true

    console.log('[Notification] Requesting permissions...')
    const result = await plugin.requestPermissions()
    console.log('[Notification] requestPermissions result:', JSON.stringify(result))
    return result.display === 'granted'
  } catch (e) {
    console.error('[Notification] Failed to request permission:', e)
    return false
  }
}

export async function startRunNotification(routineName: string, stepIcon: string) {
  console.log('[Notification] startRunNotification called —', stepIcon, routineName)
  const plugin = await getPlugin()
  if (!plugin) return

  try {
    const opts = {
      id: 1,
      title: `${stepIcon} ${routineName}`,
      body: 'Starting run...',
      smallIcon: 'ic_stat_timer',
    }
    console.log('[Notification] startForegroundService with:', JSON.stringify(opts))
    await plugin.startForegroundService(opts)
    console.log('[Notification] startForegroundService succeeded')
  } catch (e) {
    console.error('[Notification] startForegroundService FAILED:', e)
  }
}

export async function updateRunNotification(
  stepName: string,
  stepIcon: string,
  completed: number,
  total: number,
) {
  console.log('[Notification] updateRunNotification called —', stepIcon, stepName, `(${completed}/${total})`)
  const plugin = await getPlugin()
  if (!plugin) return

  try {
    const opts = {
      id: 1,
      title: `${stepIcon} ${stepName}`,
      body: `Step ${completed + 1} of ${total}`,
      smallIcon: 'ic_stat_timer',
    }
    console.log('[Notification] startForegroundService (update) with:', JSON.stringify(opts))
    await plugin.startForegroundService(opts)
    console.log('[Notification] startForegroundService (update) succeeded')
  } catch (e) {
    console.error('[Notification] startForegroundService (update) FAILED:', e)
  }
}

export async function stopRunNotification() {
  console.log('[Notification] stopRunNotification called')
  const plugin = await getPlugin()
  if (!plugin) return

  try {
    console.log('[Notification] stopForegroundService...')
    await plugin.stopForegroundService()
    console.log('[Notification] stopForegroundService succeeded')
  } catch (e) {
    console.error('[Notification] stopForegroundService FAILED:', e)
  }
}
