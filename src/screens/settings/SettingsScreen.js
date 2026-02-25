import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../utils/storage';
import { Card, Button } from '../../components/common';
import { COLORS } from '../../utils/constants';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { themeId, themes, changeTheme } = useTheme();
  const toast = useToast();

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              toast.success('已退出登录');
            }
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除所有缓存数据吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            await storage.clearAll();
            toast.success('缓存已清除');
          },
        },
      ]
    );
  };

  const handleThemeChange = (newThemeId) => {
    changeTheme(newThemeId);
    toast.success('主题已切换');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ 设置</Text>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>👤 账户信息</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.username || '冒险者'}</Text>
          <Text style={styles.userId}>ID: {user?.userId?.substring(0, 8) || '未知'}</Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>👨‍👩‍👧 家长控制</Text>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('ParentControl')}
        >
          <Text style={styles.settingLabel}>⏰ 时间管理与阅读统计</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 主题风格</Text>
        <View style={styles.themeGrid}>
          {themes.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.themeOption,
                themeId === t.id && styles.themeOptionActive,
                { borderColor: t.colors.primary },
              ]}
              onPress={() => handleThemeChange(t.id)}
            >
              <View style={[styles.themeColor, { backgroundColor: t.colors.primary }]} />
              <Text style={styles.themeName}>{t.name}</Text>
              {themeId === t.id && <Text style={styles.themeCheck}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>📊 数据管理</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
          <Text style={styles.settingLabel}>🗑️ 清除缓存</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ 关于</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>版本</Text>
          <Text style={styles.aboutValue}>1.1.0</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>开发者</Text>
          <Text style={styles.aboutValue}>乐高故事书团队</Text>
        </View>
      </Card>

      <Button
        title="🚪 退出登录"
        variant="danger"
        size="lg"
        onPress={handleLogout}
        style={styles.logoutButton}
      />

      <Text style={styles.footer}>乐高故事书 © 2024 - 让想象力飞翔</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  section: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userId: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeOption: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
  },
  themeOptionActive: {
    borderWidth: 3,
  },
  themeColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  themeName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  themeCheck: {
    fontSize: 16,
    color: COLORS.legoGreen,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  settingArrow: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  aboutValue: {
    fontSize: 14,
    color: COLORS.text,
  },
  logoutButton: {
    margin: 20,
    marginTop: 8,
  },
  footer: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: 20,
  },
});

export default SettingsScreen;
