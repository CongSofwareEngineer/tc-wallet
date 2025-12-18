import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'

TaskManager.defineTask<Notifications.NotificationTaskPayload>(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
  console.log({ data, error, executionInfo })

  const isNotificationResponse = 'actionIdentifier' in data
  if (isNotificationResponse) {
    // Do something with the notification response from user
  } else {
    // Do something with the data from notification that was received
  }
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Look at that notification',
      body: "I'm so proud of myself!",
    },
    trigger: null,
  })
})

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
