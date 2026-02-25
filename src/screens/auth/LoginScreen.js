import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button, Card } from '../../components/common';
import { COLORS } from '../../utils/constants';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const toast = useToast();

  const handleLogin = async () => {
    if (!username.trim()) {
      toast.error('请输入你的名字');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(username.trim(), email.trim() || null);
      if (result.success) {
        toast.success(`欢迎，${username}！🎉`);
      } else {
        toast.error(`登录失败：${result.error}`);
      }
    } catch (error) {
      toast.error('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.icon}>🧱</Text>
          <Text style={styles.title}>乐高故事书</Text>
          <Text style={styles.subtitle}>🎮 登录开始你的冒险！</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>🎮 登录 / 注册</Text>
          
          <View style={styles.legoBlocks}>
            <View style={[styles.block, styles.blockYellow]} />
            <View style={[styles.block, styles.blockBlue]} />
            <View style={[styles.block, styles.blockRed]} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>👤 你的名字</Text>
              <TextInput
                style={styles.input}
                placeholder="输入你的冒险者名字"
                placeholderTextColor={COLORS.textMuted}
                value={username}
                onChangeText={setUsername}
                maxLength={20}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>📧 邮箱（可选）</Text>
              <TextInput
                style={styles.input}
                placeholder="输入邮箱地址"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Button
              title="🚀 开始冒险"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              size="lg"
              style={styles.button}
            />
          </View>

          <Text style={styles.hint}>💡 首次登录将自动创建账号</Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  card: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  legoBlocks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  block: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  blockYellow: {
    backgroundColor: COLORS.legoYellow,
  },
  blockBlue: {
    backgroundColor: COLORS.legoBlue,
  },
  blockRed: {
    backgroundColor: COLORS.legoRed,
  },
  form: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 3,
    borderColor: COLORS.legoYellow,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;
