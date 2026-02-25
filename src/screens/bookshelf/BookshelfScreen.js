import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { booksAPI } from '../../api';
import { Card, Button, Loading, EmptyState } from '../../components/common';
import { COLORS } from '../../utils/constants';

const BookshelfScreen = ({ navigation }) => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await booksAPI.getList(user?.userId);
      setBooks(data.books || []);
    } catch (error) {
      toast.error('加载失败，请下拉刷新');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  }, []);

  const renderBookItem = ({ item, index }) => {
    const colors = [COLORS.legoBlue, COLORS.legoPurple, COLORS.legoGreen, COLORS.legoOrange, COLORS.legoRed];
    const color = colors[index % colors.length];
    
    return (
      <Card
        style={[styles.bookCard, { backgroundColor: color }]}
        onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}
      >
        <Text style={styles.bookIcon}>📖</Text>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookChapters}>📚 {item.chapter_count}章</Text>
      </Card>
    );
  };

  if (isLoading) {
    return <Loading fullScreen message="加载书架..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 我的书架</Text>
        <Button
          title="➕ 创建故事"
          onPress={() => navigation.navigate('StoryCreate')}
          size="sm"
        />
      </View>

      {books.length > 0 ? (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.book_id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState
          icon="📚"
          title="还没有故事"
          description="创建你的第一个冒险故事吧"
          action={
            <Button
              title="✨ 创建故事"
              onPress={() => navigation.navigate('StoryCreate')}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  row: {
    justifyContent: 'space-between',
  },
  bookCard: {
    flex: 1,
    margin: 8,
    aspectRatio: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  bookIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  bookChapters: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
});

export default BookshelfScreen;
