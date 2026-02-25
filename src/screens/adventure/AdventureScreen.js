import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { booksAPI, usersAPI } from '../../api';
import { Card, Button, Loading, EmptyState } from '../../components/common';
import { COLORS } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';

const AdventureScreen = ({ navigation }) => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [books, setBooks] = useState([]);
  const [timeUsed, setTimeUsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState(120);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, userData] = await Promise.all([
        booksAPI.getList(user?.userId),
        usersAPI.getUser(user?.userId),
      ]);
      setBooks(booksData.books || []);
      setTimeUsed(userData?.user?.time_used_today || 0);
      setTimeLimit(userData?.user?.daily_time_limit || 120);
    } catch (error) {
      toast.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = Math.min((timeUsed / timeLimit) * 100, 100);

  const renderBookItem = ({ item }) => (
    <Card
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}
    >
      <Text style={styles.bookIcon}>📖</Text>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookChapters}>📚 {item.chapter_count}章</Text>
      </View>
      <Text style={styles.bookArrow}>→</Text>
    </Card>
  );

  if (isLoading) {
    return <Loading fullScreen message="加载冒险..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ 冒险模式</Text>
      </View>

      <Card style={styles.timeCard}>
        <Text style={styles.timeLabel}>⏰ 今日阅读时间</Text>
        <Text style={styles.timeValue}>{formatTime(timeUsed)}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.timeLimit}>每日限额：{formatTime(timeLimit)}</Text>
      </Card>

      <Text style={styles.sectionTitle}>选择一个故事开始冒险</Text>

      {books.length > 0 ? (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.book_id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          icon="🗺️"
          title="还没有故事"
          description="创建你的第一个冒险故事吧"
          action={
            <Button
              title="✨ 创建故事"
              onPress={() => navigation.navigate('Home')}
            />
          }
        />
      )}
    </View>
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
  timeCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.legoBlue,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.legoGreen,
    borderRadius: 4,
  },
  timeLimit: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  bookIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bookChapters: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  bookArrow: {
    fontSize: 24,
    color: COLORS.textMuted,
  },
});

export default AdventureScreen;
