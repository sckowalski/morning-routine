import { Capacitor } from '@capacitor/core'

async function getPlugin() {
  if (!Capacitor.isNativePlatform()) return null
  try {
    const { ForegroundService } = await import(
      '@capawesome-team/capacitor-android-foreground-service'
    )
    return ForegroundService
  } catch {
    return null
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  const plugin = await getPlugin()
  if (!plugin) return false

  try {
    const { display } = await plugin.checkPermissions()
    if (display === 'granted') return true

    const result = await plugin.requestPermissions()
    return result.display === 'granted'
  } catch (e) {
    console.error('[Notification] Failed to request permission:', e)
    return false
  }
}

export async function startRunNotification(routineName: string, stepIcon: string) {
  const plugin = await getPlugin()
  if (!plugin) return

  try {
    await plugin.startForegroundService({
      id: 1,
      title: `${stepIcon} ${routineName}`,
      body: 'Starting run...',
      smallIcon: 'ic_stat_timer',
    })
  } catch (e) {
    console.error('[Notification] Failed to start foreground notification:', e)
  }
}

export async function updateRunNotification(
  stepName: string,
  stepIcon: string,
  completed: number,
  total: number,
) {
  const plugin = await getPlugin()
  if (!plugin) return

  try {
    await plugin.startForegroundService({
      id: 1,
      title: `${stepIcon} ${stepName}`,
      body: `Step ${completed + 1} of ${total}`,
      smallIcon: 'ic_stat_timer',
    })
  } catch (e) {
    console.error('[Notification] Failed to update foreground notification:', e)
  }
}

export async function stopRunNotification() {
  const plugin = await getPlugin()
  if (!plugin) return

  try {
    await plugin.stopForegroundService()
  } catch (e) {
    console.error('[Notification] Failed to stop foreground notification:', e)
  }
}
