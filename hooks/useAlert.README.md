# useAlert Hook

Hook `useAlert` cung cấp API đơn giản để hiển thị thông báo trong ứng dụng.

## Import

```typescript
import useAlert from '@/hooks/useAlert'
```

## Sử dụng cơ bản

```typescript
const MyComponent = () => {
  const { showSuccess, showError, showInfo, showAlert, hideAlert } = useAlert()

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!')
  }

  const handleError = () => {
    showError('Something went wrong!')
  }

  const handleInfo = () => {
    showInfo('Here is some information')
  }

  const handleCustomAlert = () => {
    showAlert({
      text: 'Custom alert message',
      duration: 5000
    })
  }

  return (
    // Your component JSX
  )
}
```

## API Reference

### showSuccess(text: string, duration?: number)
Hiển thị thông báo thành công.
- `text`: Nội dung thông báo
- `duration`: Thời gian hiển thị (mặc định: 3000ms)

### showError(text: string, duration?: number)
Hiển thị thông báo lỗi.
- `text`: Nội dung thông báo
- `duration`: Thời gian hiển thị (mặc định: 4000ms)

### showInfo(text: string, duration?: number)
Hiển thị thông báo thông tin.
- `text`: Nội dung thông báo
- `duration`: Thời gian hiển thị (mặc định: 3000ms)

### showAlert(alert: MyAlert)
Hiển thị thông báo tùy chỉnh.
- `alert`: Object chứa `text` và `duration`

### hideAlert()
Ẩn thông báo hiện tại.

## Ví dụ nâng cao

```typescript
const BackupScreen = () => {
  const { showSuccess, showError } = useAlert()

  const handleBackup = async () => {
    try {
      // Backup logic here
      await createBackup()
      showSuccess('Backup created successfully!')
    } catch (error) {
      showError('Failed to create backup')
    }
  }

  return (
    <TouchableOpacity onPress={handleBackup}>
      <Text>Create Backup</Text>
    </TouchableOpacity>
  )
}
```

## Migration từ dispatch

### Trước (cũ):
```typescript
import { useDispatch } from 'react-redux'
import { showAlert } from '@/redux/slices/alertSlice'

const MyComponent = () => {
  const dispatch = useDispatch()
  
  const handleAction = () => {
    dispatch(showAlert({
      text: 'Success!',
      duration: 3000
    }))
  }
}
```

### Sau (mới):
```typescript
import useAlert from '@/hooks/useAlert'

const MyComponent = () => {
  const { showSuccess } = useAlert()
  
  const handleAction = () => {
    showSuccess('Success!')
  }
}
```

## Lợi ích

1. **Đơn giản hóa**: Không cần import useDispatch và action
2. **Type Safety**: TypeScript support đầy đủ
3. **Convenience Methods**: showSuccess, showError, showInfo
4. **Consistent API**: Cùng một interface cho toàn bộ app
5. **Cleaner Code**: Ít boilerplate code hơn
