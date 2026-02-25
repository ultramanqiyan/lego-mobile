# 乐高故事书 - React Native 移动端

乐高故事书的React Native移动端应用，支持iOS和Android平台。

## 功能特性

- 用户登录/注册
- 书架管理
- 角色创建与管理
- 故事创建与阅读
- 谜题互动
- 多主题切换

## 技术栈

- React Native (Expo)
- React Navigation
- Zustand (状态管理)
- AsyncStorage (本地存储)
- Cloudflare Page Functions (后端API)

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 运行特定平台

```bash
# iOS
npm run ios

# Android
npm run android
```

## 项目结构

```
lego-mobile/
├── src/
│   ├── api/           # API服务层
│   ├── components/    # 可复用组件
│   ├── screens/       # 页面组件
│   ├── navigation/    # 导航配置
│   ├── context/       # Context Provider
│   ├── hooks/         # 自定义Hooks
│   ├── utils/         # 工具函数
│   └── styles/        # 样式
├── assets/            # 静态资源
├── tests/             # 测试文件
└── docs/              # 文档
```

## API配置

应用使用Cloudflare Page Functions作为后端API，基础URL配置在`app.json`中：

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://lego-story.pages.dev/api"
    }
  }
}
```

## 构建

使用EAS Build进行构建：

```bash
# 安装EAS CLI
npm install -g eas-cli

# 配置项目
eas build:configure

# 构建iOS
eas build --platform ios

# 构建Android
eas build --platform android
```

## 许可证

MIT
