# 乐高故事书 React Native 移动端应用规格说明

## 1. 项目概述

### 1.1 项目背景
将现有的乐高故事书Web应用迁移到React Native框架，创建跨平台移动应用（iOS/Android）。后端API继续使用已部署在Cloudflare Page Functions上的现有服务。

### 1.2 项目目标
- 创建React Native移动端应用，复用现有后端API
- 实现与Web端相同的核心功能
- 提供原生移动应用体验
- 代码统一管理在新建的`lego-mobile`目录下

### 1.3 技术栈
- **前端框架**: React Native (Expo)
- **状态管理**: React Context / Zustand
- **导航**: React Navigation 6
- **UI组件**: React Native Paper / 自定义组件
- **网络请求**: Axios / Fetch
- **存储**: AsyncStorage
- **后端API**: Cloudflare Page Functions (现有)

---

## 2. 目录结构

```
lego-mobile/
├── src/
│   ├── api/                    # API服务层
│   │   ├── client.js           # API客户端配置
│   │   ├── characters.js       # 角色相关API
│   │   ├── books.js            # 书籍相关API
│   │   ├── chapters.js         # 章节相关API
│   │   ├── story.js            # 故事生成API
│   │   ├── puzzle.js           # 谜题相关API
│   │   ├── users.js            # 用户相关API
│   │   └── index.js            # API导出
│   ├── components/             # 可复用组件
│   │   ├── common/             # 通用组件
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Modal.js
│   │   │   ├── Loading.js
│   │   │   ├── Toast.js
│   │   │   └── Header.js
│   │   ├── character/          # 角色相关组件
│   │   │   ├── CharacterCard.js
│   │   │   ├── CharacterList.js
│   │   │   └── CharacterForm.js
│   │   ├── book/               # 书籍相关组件
│   │   │   ├── BookCard.js
│   │   │   ├── BookList.js
│   │   │   └── ChapterList.js
│   │   ├── story/              # 故事相关组件
│   │   │   ├── StoryContent.js
│   │   │   ├── PlotSelector.js
│   │   │   └── CharacterSelector.js
│   │   └── puzzle/             # 谜题相关组件
│   │       ├── PuzzleCard.js
│   │       └── PuzzleOptions.js
│   ├── screens/                # 页面组件
│   │   ├── auth/
│   │   │   └── LoginScreen.js
│   │   ├── home/
│   │   │   └── HomeScreen.js
│   │   ├── bookshelf/
│   │   │   └── BookshelfScreen.js
│   │   ├── characters/
│   │   │   └── CharactersScreen.js
│   │   ├── story/
│   │   │   ├── StoryCreateScreen.js
│   │   │   └── BookDetailScreen.js
│   │   ├── chapter/
│   │   │   └── ChapterScreen.js
│   │   ├── adventure/
│   │   │   └── AdventureScreen.js
│   │   ├── settings/
│   │   │   └── SettingsScreen.js
│   │   └── share/
│   │       └── ShareScreen.js
│   ├── navigation/             # 导航配置
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── context/                # Context Provider
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── ToastContext.js
│   ├── hooks/                  # 自定义Hooks
│   │   ├── useAuth.js
│   │   ├── useAPI.js
│   │   └── useTheme.js
│   ├── utils/                  # 工具函数
│   │   ├── storage.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── styles/                 # 样式
│   │   ├── theme.js
│   │   ├── colors.js
│   │   └── typography.js
│   └── App.js                  # 应用入口
├── assets/                     # 静态资源
│   ├── images/
│   ├── fonts/
│   └── icons/
├── tests/                      # 测试文件
│   ├── unit/
│   └── integration/
├── docs/                       # 文档
│   ├── spec.md
│   ├── task_list.md
│   └── checklist.md
├── app.json                    # Expo配置
├── package.json
├── babel.config.js
├── metro.config.js
└── README.md
```

---

## 3. 功能模块详细设计

### 3.1 用户认证模块

#### 3.1.1 登录页面 (LoginScreen)
**功能描述**:
- 用户名输入
- 邮箱输入（可选）
- 登录/注册按钮
- 自动登录（记住用户）

**API调用**:
- `POST /api/users` - 创建/登录用户

**UI设计**:
- 乐高主题背景
- 动画加载效果
- 表单验证

#### 3.1.2 认证状态管理
- 使用AsyncStorage存储userId
- AuthContext管理全局认证状态
- 自动检查登录状态

---

### 3.2 首页模块

#### 3.2.1 首页 (HomeScreen)
**功能描述**:
- 欢迎信息展示
- 热门人仔展示
- 最近故事展示
- 快速入口导航

**API调用**:
- `GET /api/characters` - 获取热门人仔
- `GET /api/books?userId={userId}` - 获取最近故事

**UI设计**:
- 卡片式布局
- 横向滚动列表
- 乐高主题色彩

---

### 3.3 书架模块

#### 3.3.1 书架页面 (BookshelfScreen)
**功能描述**:
- 展示用户所有书籍
- 书籍卡片点击进入详情
- 创建新故事入口

**API调用**:
- `GET /api/books?userId={userId}` - 获取书籍列表

**UI设计**:
- 卡片堆叠效果
- 下拉刷新
- 空状态提示

---

### 3.4 角色管理模块

#### 3.4.1 角色列表页面 (CharactersScreen)
**功能描述**:
- 预设人仔展示
- 用户创建人仔展示
- 创建新人仔
- 编辑人仔
- 删除人仔

**API调用**:
- `GET /api/characters?userId={userId}` - 获取角色列表
- `POST /api/characters` - 创建角色
- `PUT /api/characters` - 更新角色
- `DELETE /api/characters?id={id}` - 删除角色

**UI设计**:
- 分组展示（预设/用户）
- 卡片翻转动画
- 弹窗表单

---

### 3.5 故事创建模块

#### 3.5.1 创建故事页面 (StoryCreateScreen)
**功能描述**:
- 步骤1: 选择/创建书籍
- 步骤2: 选择故事类型
- 步骤3: 选择角色并设置角色类型
- 步骤4: 确认创建

**API调用**:
- `GET /api/books?userId={userId}` - 获取已有书籍
- `POST /api/books` - 创建新书籍
- `GET /api/characters` - 获取可选角色
- `POST /api/book-characters` - 添加书籍角色
- `POST /api/story` - 生成故事
- `POST /api/chapters` - 保存章节

**UI设计**:
- 步骤指示器
- 卡片选择器
- 角色拖拽排序
- 加载动画

---

### 3.6 书籍详情模块

#### 3.6.1 书籍详情页面 (BookDetailScreen)
**功能描述**:
- 展示书籍角色
- 添加新角色
- 编辑角色
- 删除角色
- 展示章节列表
- 添加新章节
- 阅读章节

**API调用**:
- `GET /api/books?bookId={bookId}` - 获取书籍详情
- `POST /api/book-characters` - 添加角色
- `PUT /api/book-characters` - 更新角色
- `DELETE /api/book-characters?id={id}` - 删除角色
- `POST /api/story` - 生成新章节
- `POST /api/chapters` - 保存章节

**UI设计**:
- Tab切换（角色/章节）
- 角色卡片网格
- 章节列表
- 情节选择弹窗

---

### 3.7 章节阅读模块

#### 3.7.1 章节阅读页面 (ChapterScreen)
**功能描述**:
- 章节内容展示
- 关键词高亮
- 谜题展示
- 谜题作答
- 生成下一章

**API调用**:
- `GET /api/chapters?id={chapterId}` - 获取章节内容
- `POST /api/puzzle` - 提交谜题答案
- `POST /api/chapters-complete/books/{bookId}/chapters/{chapterId}` - 完成章节
- `GET /api/plot-options` - 获取情节选项
- `POST /api/chapters-generate/books/{bookId}` - 生成新章节

**UI设计**:
- 沉浸式阅读模式
- 谜题卡片动画
- 答题反馈
- 情节选择弹窗

---

### 3.8 冒险模式模块

#### 3.8.1 冒险模式页面 (AdventureScreen)
**功能描述**:
- 阅读时间统计
- 故事选择
- 章节阅读
- 谜题挑战

**API调用**:
- `GET /api/users?userId={userId}` - 获取阅读时间
- `GET /api/books?userId={userId}` - 获取书籍列表
- `GET /api/chapters?id={chapterId}` - 获取章节

**UI设计**:
- 时间进度条
- 故事选择卡片
- 谜题互动界面

---

### 3.9 分享模块

#### 3.9.1 分享页面 (ShareScreen)
**功能描述**:
- 生成分享链接
- 分享到社交平台
- 查看分享记录

**API调用**:
- `POST /api/share` - 创建分享
- `GET /api/share?bookId={bookId}` - 获取分享信息

**UI设计**:
- 分享预览
- 平台选择
- 二维码生成

---

### 3.10 设置模块

#### 3.10.1 设置页面 (SettingsScreen)
**功能描述**:
- 主题切换
- 字体大小调整
- 清除缓存
- 关于信息
- 退出登录

**UI设计**:
- 列表式设置项
- 开关控件
- 滑块控件

---

## 4. API接口规范

### 4.1 基础配置
```javascript
const API_BASE = 'https://your-cloudflare-pages-url.pages.dev/api';
```

### 4.2 请求头
```javascript
{
  'Content-Type': 'application/json'
}
```

### 4.3 接口列表

| 接口 | 方法 | 描述 |
|------|------|------|
| `/users` | POST | 创建/登录用户 |
| `/users` | GET | 获取用户信息 |
| `/characters` | GET | 获取角色列表 |
| `/characters` | POST | 创建角色 |
| `/characters` | PUT | 更新角色 |
| `/characters` | DELETE | 删除角色 |
| `/books` | GET | 获取书籍列表/详情 |
| `/books` | POST | 创建书籍 |
| `/books` | PUT | 更新书籍 |
| `/books` | DELETE | 删除书籍 |
| `/book-characters` | POST | 添加书籍角色 |
| `/book-characters` | PUT | 更新书籍角色 |
| `/book-characters` | DELETE | 删除书籍角色 |
| `/chapters` | GET | 获取章节详情 |
| `/chapters` | POST | 创建章节 |
| `/chapters-generate/books/{bookId}` | POST | 生成新章节 |
| `/chapters-complete/books/{bookId}/chapters/{chapterId}` | POST | 完成章节 |
| `/story` | POST | 生成故事 |
| `/puzzle` | POST | 提交谜题答案 |
| `/plot-options` | GET | 获取情节选项 |
| `/share` | POST | 创建分享 |
| `/share` | GET | 获取分享信息 |

---

## 5. 数据存储

### 5.1 本地存储 (AsyncStorage)
- `userId` - 用户ID
- `username` - 用户名
- `theme` - 主题设置
- `fontSize` - 字体大小设置

### 5.2 缓存策略
- 角色列表缓存（5分钟）
- 书籍列表缓存（5分钟）
- 情节选项缓存（1小时）

---

## 6. UI/UX设计规范

### 6.1 色彩方案
```javascript
const colors = {
  legoRed: '#E3000B',
  legoBlue: '#006BA6',
  legoYellow: '#FFD100',
  legoGreen: '#00A651',
  legoOrange: '#FF6B00',
  legoPurple: '#8B5CF6',
  background: '#FFF8E7',
  text: '#333333',
  textLight: '#666666',
  error: '#E74C3C',
  success: '#27AE60',
};
```

### 6.2 字体
- 主标题: Noto Sans SC Bold
- 正文: Noto Sans SC Regular
- 数字/特殊: Rajdhani

### 6.3 组件规范
- 圆角: 15px
- 阴影: 0 4px 15px rgba(0,0,0,0.1)
- 按钮高度: 48px
- 输入框高度: 50px

---

## 7. 测试计划

### 7.1 单元测试
- API服务层测试
- 工具函数测试
- 组件测试

### 7.2 集成测试
- 用户流程测试
- API集成测试

### 7.3 E2E测试
- 完整用户流程测试
- 跨平台兼容性测试

---

## 8. 部署计划

### 8.1 开发环境
- Expo开发服务器
- iOS模拟器
- Android模拟器

### 8.2 构建发布
- Expo EAS Build
- iOS App Store
- Android Google Play

### 8.3 版本管理
- 语义化版本号
- Git标签管理
- GitHub仓库: lego-mobile

---

## 9. 风险与依赖

### 9.1 技术风险
- React Native版本兼容性
- 第三方库维护状态
- API接口稳定性

### 9.2 依赖项
- Expo SDK
- React Navigation
- React Native Paper
- AsyncStorage
- Axios

---

## 10. 里程碑

| 阶段 | 内容 | 预计时间 |
|------|------|----------|
| Phase 1 | 项目初始化、基础架构 | 1周 |
| Phase 2 | 核心功能开发（认证、书架、角色） | 2周 |
| Phase 3 | 故事功能开发（创建、阅读、谜题） | 2周 |
| Phase 4 | 辅助功能开发（分享、设置） | 1周 |
| Phase 5 | 测试与优化 | 1周 |
| Phase 6 | 部署与发布 | 1周 |

---

## 11. 验收标准

### 11.1 功能验收
- 所有核心功能正常运行
- API调用正确
- 数据持久化正常

### 11.2 性能验收
- 应用启动时间 < 3秒
- 页面加载时间 < 1秒
- 无明显卡顿

### 11.3 兼容性验收
- iOS 13+ 正常运行
- Android 8+ 正常运行
- 不同屏幕尺寸适配

### 11.4 代码质量
- 代码规范统一
- 无严重Bug
- 测试覆盖率 > 60%
