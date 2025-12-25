import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'

TaskManager.defineTask<Notifications.NotificationTaskPayload>(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
  if (error) {
    return
  }

  try {
    const dataNoti = (data as any)?.data
    if (!dataNoti?.body) return

    const dataOnly = JSON.parse(dataNoti.body)
    await Notifications.setBadgeCountAsync(1)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: dataOnly?.title || 'TC Wallet',
        body: dataOnly?.body || '',
        priority: Notifications.AndroidNotificationPriority.MAX,
        sound: 'music_noti_1.wav',
      },
      // Important: Link to the channel created in hooks/notification
      trigger: {
        // type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        // seconds: 2,
        channelId: 'tc-wallet',
      } as any,
      // trigger: null,
    })
  } catch (err) {
    console.error('Error parsing notification data:', err)
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Bạn có tin nhắn mới', body: 'Mở app để xem chi tiết' },
      trigger: null,
    })
  }
})

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
})
