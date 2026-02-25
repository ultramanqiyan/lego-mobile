import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { shareAPI } from '../../api';
import { Card, Button, Loading, Header } from '../../components/common';
import { COLORS } from '../../utils/constants';

const ShareScreen = ({ route, navigation }) => {
  const { bookId } = route.params || {};
  const { user } = useAuth();
  const toast = useToast();
  
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bookId) {
      generateShareLink();
    }
  }, [bookId]);

  const generateShareLink = async () => {
    setIsLoading(true);
    try {
      const data = await shareAPI.create(bookId, user?.userId);
      setShareUrl(data.shareUrl || `https://lego-story.pages.dev/share/${data.shareId}`);
    } catch (error) {
      toast.error('生成分享链接失败');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(shareUrl);
    toast.success('链接已复制到剪贴板');
  };

  return (
    <View style={styles.container}>
      <Header
        title="📤 分享故事"
        leftButton={<Header.BackButton onPress={() => navigation.goBack()} />}
      />

      <View style={styles.content}>
        <Card style={styles.shareCard}>
          <Text style={styles.shareIcon}>📤</Text>
          <Text style={styles.shareTitle}>分享你的故事</Text>
          <Text style={styles.shareDesc}>
            将你的精彩故事分享给朋友们，让他们一起体验冒险的乐趣！
          </Text>
        </Card>

        {isLoading ? (
          <Loading message="生成分享链接..." />
        ) : shareUrl ? (
          <Card style={styles.linkCard}>
            <Text style={styles.linkLabel}>分享链接</Text>
            <Text style={styles.linkUrl}>{shareUrl}</Text>
            <Button
              title="📋 复制链接"
              onPress={copyToClipboard}
              style={styles.copyButton}
            />
          </Card>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🔗</Text>
            <Text style={styles.emptyText}>选择一个故事来生成分享链接</Text>
          </Card>
        )}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 分享提示</Text>
          <Text style={styles.tipsText}>• 朋友可以通过链接阅读你的故事</Text>
          <Text style={styles.tipsText}>• 分享链接不会暴露你的个人信息</Text>
          <Text style={styles.tipsText}>• 你可以随时删除分享链接</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  shareCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  shareIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  shareTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  shareDesc: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  linkCard: {
    marginBottom: 20,
    padding: 20,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  linkUrl: {
    fontSize: 14,
    color: COLORS.legoBlue,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  copyButton: {
    width: '100%',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  tipsCard: {
    backgroundColor: COLORS.infoLight,
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.info,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});

export default ShareScreen;
