# App Configuration với Expo Constants

Sử dụng `expo-constants` để quản lý app name, version, và key encode default.

## 📁 Cấu trúc Files

```
constants/
  appConfig.ts          # App configuration constants
components/
  AppInfoDisplay.tsx    # Component hiển thị app info
app.json               # Expo configuration với extra configs
utils/secureStorage/
  index.ts             # Updated để sử dụng default key encode
```

## ⚙️ Cấu hình trong app.json

```json
{
  "expo": {
    "name": "tc-wallet",
    "version": "1.0.0",
    "extra": {
      "appConfig": {
        "appName": "TC Wallet",
        "appVersion": "1.0.0", 
        "keyEncodeDefault": "tc-wallet-secure-key-2024"
      }
    }
  }
}
```

## 🔧 Constants Available

### APP_CONFIG
```typescript
import { APP_CONFIG } from '@/constants/appConfig'

APP_CONFIG.appName          // "TC Wallet"
APP_CONFIG.appVersion       // "1.0.0"
APP_CONFIG.slug            // "tc-wallet"
APP_CONFIG.keyEncodeDefault // "tc-wallet-secure-key-2024"
APP_CONFIG.platform        // Platform info
APP_CONFIG.isDevice        // true/false
APP_CONFIG.isDevelopment   // true/false
```

### APP_INFO
```typescript
import { APP_INFO } from '@/constants/appConfig'

APP_INFO.displayName    // "TC Wallet"
APP_INFO.version       // "1.0.0"
APP_INFO.fullVersion   // "1.0.0 (1)"
APP_INFO.identifier    // "com.diencong.tcwallet"
```

### SECURITY_CONFIG
```typescript
import { SECURITY_CONFIG } from '@/constants/appConfig'

SECURITY_CONFIG.defaultKeyEncode     // Default encryption key
SECURITY_CONFIG.minPasswordLength    // 8
SECURITY_CONFIG.sessionTimeout       // 30 minutes
```

## 💻 Sử dụng trong Components

### Basic Usage
```typescript
import { APP_INFO } from '@/constants/appConfig'

const MyComponent = () => {
  return (
    <View>
      <Text>{APP_INFO.displayName}</Text>
      <Text>Version: {APP_INFO.version}</Text>
    </View>
  )
}
```

### Trong Backup Screen
```typescript
const backupObject = {
  app: APP_INFO.displayName,
  version: APP_INFO.version,
  identifier: APP_INFO.identifier,
  // ... other data
}
```

### Trong Security Storage
```typescript
// utils/secureStorage/index.ts
export const getKeyEncode = async () => {
  // ...
  return process.env.EXPO_PUBLIC_KEY_ENCODE_STORAGE || SECURITY_CONFIG.defaultKeyEncode
}
```

## 🎯 Lợi ích

1. **Centralized Config**: Tất cả app config ở một nơi
2. **Type Safety**: Full TypeScript support
3. **Environment Aware**: Tự động detect development/production
4. **Consistent**: Sử dụng cùng một source of truth
5. **Flexible**: Có thể override bằng environment variables

## 🔒 Security Features

- **Default Key Encode**: Fallback key khi không có env variable
- **Environment Variables**: Ưu tiên env vars hơn default values
- **Platform Detection**: Khác biệt behavior theo platform

## 📱 Platform Specific

```typescript
if (APP_CONFIG.platform?.ios) {
  // iOS specific code
} else if (APP_CONFIG.platform?.android) {
  // Android specific code
} else {
  // Web specific code
}
```

## 🚀 Usage Examples

### Header với App Name
```typescript
<HeaderScreen title={APP_INFO.displayName} />
```

### Version Display
```typescript
<Text>Version {APP_INFO.fullVersion}</Text>
```

### Environment Badge
```typescript
{APP_CONFIG.isDevelopment && (
  <Badge>DEV</Badge>
)}
```

### Platform Specific Features
```typescript
const isNativePlatform = APP_CONFIG.platform?.ios || APP_CONFIG.platform?.android
```
