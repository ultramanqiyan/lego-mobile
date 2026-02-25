import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { charactersAPI, booksAPI } from '../../api';
import { Card, Button, Loading, EmptyState } from '../../components/common';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [popularCharacters, setPopularCharacters] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [charsData, booksData] = await Promise.all([
        charactersAPI.getList(user?.userId),
        user?.userId ? booksAPI.getList(user.userId) : Promise.resolve({ books: [] }),
      ]);

      const presetChars = (charsData.characters || [])
        .filter((c) => c.creator_id === 'system')
        .slice(0, 4);
      setPopularCharacters(presetChars);

      const recent = (booksData.books || []).slice(0, 4);
      setRecentBooks(recent);
    } catch (error) {
      toast.error('加载失败，请下拉刷新');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const renderCharacterItem = ({ item, index }) => (
    <Card
      style={styles.characterCard}
      onPress={() => navigation.navigate('Characters')}
    >
      <Text style={styles.characterEmoji}>
        {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
      </Text>
      <Text style={styles.characterName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.characterDesc} numberOfLines={2}>
        {item.description || '神秘角色'}
      </Text>
    </Card>
  );

  const renderBookItem = ({ item, index }) => {
    const colors = [COLORS.legoBlue, COLORS.legoPurple, COLORS.legoGreen, COLORS.legoOrange];
    const color = colors[index % colors.length];
    
    return (
      <Card
        style={[styles.bookCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
        onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}
      >
        <Text style={styles.bookIcon}>📖</Text>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.bookChapters}>📚 {item.chapter_count}章</Text>
      </Card>
    );
  };

  if (isLoading) {
    return <Loading fullScreen message="加载中..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>你好，{user?.username || '冒险者'}！</Text>
        <Text style={styles.subGreeting}>今天想听什么故事？</Text>
      </View>

      <Card variant="primary" style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>欢迎来到乐高故事世界</Text>
        <Text style={styles.welcomeDesc}>在这里，你可以：</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>🎭 选择你喜欢的乐高人仔作为故事角色</Text>
          <Text style={styles.featureItem}>📖 创建属于你自己的冒险故事</Text>
          <Text style={styles.featureItem}>🧩 解答有趣的谜题推进剧情</Text>
          <Text style={styles.featureItem}>📤 与朋友分享你的故事</Text>
        </View>
        <Button
          title="🎮 开始冒险"
          onPress={() => navigation.navigate('StoryCreate')}
          size="lg"
          style={styles.startButton}
        />
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 热门人仔</Text>
          <Button
            title="查看全部"
            variant="outline"
            size="sm"
            onPress={() => navigation.navigate('Characters')}
          />
        </View>
        {popularCharacters.length > 0 ? (
          <FlatList
            data={popularCharacters}
            renderItem={renderCharacterItem}
            keyExtractor={(item) => item.character_id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <EmptyState
            icon="🎭"
            title="暂无热门人仔"
            description="快去创建你的第一个角色吧"
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📚 最近故事</Text>
          <Button
            title="查看全部"
            variant="outline"
            size="sm"
            onPress={() => navigation.navigate('Bookshelf')}
          />
        </View>
        {recentBooks.length > 0 ? (
          <FlatList
            data={recentBooks}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.book_id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
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

      <View style={styles.bottomSpace} />
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
  welcomeCard: {
    margin: 20,
    marginTop: 0,
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  welcomeDesc: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 28,
  },
  startButton: {
    marginTop: 8,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  horizontalList: {
    paddingRight: 20,
  },
  characterCard: {
    width: 140,
    marginRight: 12,
    alignItems: 'center',
    padding: 16,
  },
  characterEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  characterDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  bookCard: {
    width: 160,
    marginRight: 12,
    padding: 16,
  },
  bookIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  bottomSpace: {
    height: 100,
  },
});

export default HomeScreen;
