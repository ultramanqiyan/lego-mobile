import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, FlatList, RefreshControl, Image, Modal, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  background: '#FFF8E7',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  legoYellow: '#FFD100',
  legoBlue: '#006BA6',
  legoRed: '#E3000B',
  legoGreen: '#00A651',
  legoOrange: '#FF6B00',
  legoPurple: '#8B5CF6',
  white: '#FFFFFF',
  border: '#E0E0E0',
  error: '#E74C3C',
  success: '#27AE60',
};

const API_BASE = 'http://localhost:8788/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || '请求失败');
  }
  return data;
}

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (username, email = null) => {
    try {
      const data = await apiRequest('/users', { method: 'POST', body: { username, email } });
      setUser({ userId: data.userId, username });
      return { success: true, userId: data.userId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setUser(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim()) return;
    setIsLoading(true);
    const result = await login(username.trim());
    setIsLoading(false);
    if (!result.success) {
      Alert.alert('登录失败', result.error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.icon}>🧱</Text>
          <Text style={styles.title}>乐高故事书</Text>
          <Text style={styles.subtitle}>🎮 登录开始你的冒险！</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎮 登录 / 注册</Text>
          <View style={styles.legoBlocks}>
            <View style={[styles.block, { backgroundColor: COLORS.legoYellow }]} />
            <View style={[styles.block, { backgroundColor: COLORS.legoBlue }]} />
            <View style={[styles.block, { backgroundColor: COLORS.legoRed }]} />
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
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color={COLORS.text} /> : <Text style={styles.buttonText}>🚀 开始冒险</Text>}
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>💡 首次登录将自动创建账号</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [charsData, booksData] = await Promise.all([
        apiRequest('/characters'),
        user?.userId ? apiRequest(`/books?userId=${user.userId}`) : { books: [] },
      ]);
      setCharacters((charsData.characters || []).slice(0, 4));
      setBooks((booksData.books || []).slice(0, 4));
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.legoYellow} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={false} onRefresh={loadData} />}>
      <View style={styles.homeHeader}>
        <Text style={styles.greeting}>你好，{user?.username || '冒险者'}！</Text>
        <Text style={styles.subGreeting}>今天想听什么故事？</Text>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>欢迎来到乐高故事世界</Text>
        <Text style={styles.welcomeDesc}>在这里，你可以：</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>🎭 选择你喜欢的乐高人仔作为故事角色</Text>
          <Text style={styles.featureItem}>📖 创建属于你自己的冒险故事</Text>
          <Text style={styles.featureItem}>🧩 解答有趣的谜题推进剧情</Text>
          <Text style={styles.featureItem}>📤 与朋友分享你的故事</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StoryCreate')}>
          <Text style={styles.buttonText}>🎮 开始冒险</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 热门人仔</Text>
        {characters.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {characters.map((item) => (
              <TouchableOpacity key={item.character_id} style={styles.characterCard} onPress={() => navigation.navigate('StoryCreate')}>
                <Text style={styles.characterEmoji}>🎭</Text>
                <Text style={styles.characterName} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>暂无人仔</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 最近故事</Text>
        {books.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {books.map((item) => (
              <TouchableOpacity key={item.book_id} style={styles.bookCard} onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}>
                <Text style={styles.bookIcon}>📖</Text>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bookChapters}>{item.chapter_count || 0} 章</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>还没有故事，快去创建吧！</Text>
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function BookshelfScreen({ navigation }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      if (user?.userId) {
        const data = await apiRequest(`/books?userId=${user.userId}`);
        setBooks(data.books || []);
      }
    } catch (error) {
      console.error('Load books error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.legoYellow} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.homeHeader}>
        <Text style={styles.greeting}>📚 我的故事书架</Text>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.book_id}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bookshelfItem} onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}>
            <Text style={styles.bookIcon}>📖</Text>
            <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.bookChapters}>{item.chapter_count || 0} 章</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>还没有故事书</Text>}
      />
    </View>
  );
}

function CharactersScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const data = await apiRequest('/characters');
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Load characters error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.legoYellow} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.homeHeader}>
        <Text style={styles.greeting}>🎭 角色列表</Text>
      </View>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.character_id}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.characterCardLarge} onPress={() => navigation.navigate('StoryCreate', { selectedCharacter: item })}>
            <Text style={styles.characterEmojiLarge}>🎭</Text>
            <Text style={styles.characterNameLarge} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.characterDesc} numberOfLines={2}>{item.description || '神秘角色'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>暂无角色</Text>}
      />
    </View>
  );
}

function SettingsScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.homeHeader}>
        <Text style={styles.greeting}>⚙️ 设置</Text>
      </View>
      <View style={styles.settingsContent}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>当前用户</Text>
          <Text style={styles.settingValue}>{user?.username || '未登录'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>🚪 退出登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PLOT_OPTIONS = [
  { id: 'adventure', name: '🏰 冒险探险', desc: '探索神秘世界' },
  { id: 'mystery', name: '🔍 神秘解谜', desc: '解开谜团' },
  { id: 'friendship', name: '🤝 友情故事', desc: '友谊的力量' },
  { id: 'rescue', name: '🦸 英雄救援', desc: '拯救世界' },
];

function StoryCreateScreen({ navigation, route }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [plot, setPlot] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const preselectedCharacter = route?.params?.selectedCharacter;

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    if (preselectedCharacter && !selectedCharacters.find(c => c.character_id === preselectedCharacter.character_id)) {
      setSelectedCharacters([preselectedCharacter]);
    }
  }, [preselectedCharacter]);

  const loadCharacters = async () => {
    try {
      const data = await apiRequest('/characters');
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Load characters error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCharacter = (char) => {
    const exists = selectedCharacters.find(c => c.character_id === char.character_id);
    if (exists) {
      setSelectedCharacters(selectedCharacters.filter(c => c.character_id !== char.character_id));
    } else if (selectedCharacters.length < 3) {
      setSelectedCharacters([...selectedCharacters, char]);
    }
  };

  const handleCreateStory = async () => {
    if (selectedCharacters.length === 0 || !plot || !bookTitle.trim()) return;
    
    setIsCreating(true);
    try {
      const storyCharacters = selectedCharacters.map(c => ({
        original_id: c.character_id,
        original_name: c.name,
        custom_name: c.name,
        personality: c.personality,
        speaking_style: c.speaking_style
      }));

      const storyData = await apiRequest('/story', {
        method: 'POST',
        body: {
          characters: storyCharacters,
          plot: plot.desc
        }
      });

      if (storyData.success) {
        const bookData = await apiRequest('/books', {
          method: 'POST',
          body: {
            userId: user.userId,
            title: bookTitle.trim(),
            characterIds: selectedCharacters.map(c => c.character_id)
          }
        });

        if (bookData.success) {
          const chapterData = await apiRequest('/chapters', {
            method: 'POST',
            body: {
              bookId: bookData.bookId,
              chapterNumber: 1,
              title: storyData.title,
              content: storyData.content,
              puzzle: storyData.puzzle
            }
          });

          navigation.replace('BookDetail', { bookId: bookData.bookId, newChapter: chapterData });
        }
      }
    } catch (error) {
      Alert.alert('创建失败', error.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.legoYellow} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.createTitle}>创建故事</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.progressBar}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={[styles.progressStep, step >= s && styles.progressStepActive]}>
            <Text style={[styles.progressText, step >= s && styles.progressTextActive]}>{s}</Text>
          </View>
        ))}
      </View>

      {step === 1 && (
        <ScrollView style={styles.createContent}>
          <Text style={styles.stepTitle}>🎭 选择角色 ({selectedCharacters.length}/3)</Text>
          <Text style={styles.stepDesc}>选择1-3个角色来开始你的故事</Text>
          <View style={styles.characterGrid}>
            {characters.map((char) => {
              const isSelected = selectedCharacters.find(c => c.character_id === char.character_id);
              return (
                <TouchableOpacity
                  key={char.character_id}
                  style={[styles.characterSelectCard, isSelected && styles.characterSelectCardActive]}
                  onPress={() => toggleCharacter(char)}
                >
                  <Text style={styles.characterEmojiLarge}>🎭</Text>
                  <Text style={styles.characterNameLarge} numberOfLines={1}>{char.name}</Text>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.button, selectedCharacters.length === 0 && styles.buttonDisabled]}
            onPress={() => selectedCharacters.length > 0 && setStep(2)}
            disabled={selectedCharacters.length === 0}
          >
            <Text style={styles.buttonText}>下一步</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {step === 2 && (
        <ScrollView style={styles.createContent}>
          <Text style={styles.stepTitle}>📖 选择故事类型</Text>
          <Text style={styles.stepDesc}>选择一个你喜欢的冒险类型</Text>
          <View style={styles.plotGrid}>
            {PLOT_OPTIONS.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.plotCard, plot?.id === p.id && styles.plotCardActive]}
                onPress={() => setPlot(p)}
              >
                <Text style={styles.plotName}>{p.name}</Text>
                <Text style={styles.plotDesc}>{p.desc}</Text>
                {plot?.id === p.id && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.button, !plot && styles.buttonDisabled]}
            onPress={() => plot && setStep(3)}
            disabled={!plot}
          >
            <Text style={styles.buttonText}>下一步</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {step === 3 && (
        <KeyboardAvoidingView style={styles.createContent} behavior="padding">
          <Text style={styles.stepTitle}>✏️ 给故事起个名字</Text>
          <Text style={styles.stepDesc}>为你的冒险故事取一个独特的名字</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="输入故事名称..."
            placeholderTextColor={COLORS.textMuted}
            value={bookTitle}
            onChangeText={setBookTitle}
            maxLength={30}
          />
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>故事预览</Text>
            <Text style={styles.summaryItem}>🎭 角色: {selectedCharacters.map(c => c.name).join('、')}</Text>
            <Text style={styles.summaryItem}>📖 类型: {plot?.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, (!bookTitle.trim() || isCreating) && styles.buttonDisabled]}
            onPress={handleCreateStory}
            disabled={!bookTitle.trim() || isCreating}
          >
            {isCreating ? <ActivityIndicator color={COLORS.text} /> : <Text style={styles.buttonText}>🚀 开始创作</Text>}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

function BookDetailScreen({ navigation, route }) {
  const { bookId, newChapter } = route.params || {};
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadBookData();
  }, [bookId]);

  const loadBookData = async () => {
    try {
      const bookData = await apiRequest(`/books?bookId=${bookId}`);
      setBook(bookData.book);
      setChapters(bookData.chapters || []);
    } catch (error) {
      console.error('Load book error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateChapter = async () => {
    setIsGenerating(true);
    try {
      const lastChapter = chapters[chapters.length - 1];
      
      const bookCharsData = await apiRequest(`/book-characters?bookId=${bookId}`);
      const storyCharacters = (bookCharsData.characters || []).map(c => ({
        original_id: c.character_id,
        original_name: c.original_name,
        custom_name: c.custom_name || c.original_name,
        personality: c.personality,
        speaking_style: c.speaking_style
      }));

      const storyData = await apiRequest('/story', {
        method: 'POST',
        body: {
          characters: storyCharacters,
          plot: '继续冒险',
          previousSummary: lastChapter?.content?.substring(0, 200),
          previousPuzzle: lastChapter?.puzzle
        }
      });

      if (storyData.success) {
        const chapterData = await apiRequest('/chapters', {
          method: 'POST',
          body: {
            bookId: bookId,
            chapterNumber: chapters.length + 1,
            title: storyData.title,
            content: storyData.content,
            puzzle: storyData.puzzle
          }
        });

        loadBookData();
      }
    } catch (error) {
      Alert.alert('生成失败', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.legoYellow} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.createTitle} numberOfLines={1}>{book?.title || '故事详情'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.createContent}>
        <View style={styles.bookInfoCard}>
          <Text style={styles.bookInfoTitle}>{book?.title}</Text>
          <Text style={styles.bookInfoMeta}>共 {chapters.length} 章</Text>
        </View>

        <Text style={styles.sectionTitle}>📖 章节列表</Text>
        {chapters.map((chapter, index) => (
          <TouchableOpacity
            key={chapter.chapter_id}
            style={styles.chapterItem}
            onPress={() => navigation.navigate('ChapterRead', { chapter, bookTitle: book?.title })}
          >
            <View style={styles.chapterNumber}>
              <Text style={styles.chapterNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.chapterInfo}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              {chapter.puzzle && <Text style={styles.puzzleBadge}>🧩 有谜题</Text>}
            </View>
            <Text style={styles.chapterArrow}>→</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, isGenerating && styles.buttonDisabled]}
          onPress={handleGenerateChapter}
          disabled={isGenerating}
        >
          {isGenerating ? <ActivityIndicator color={COLORS.text} /> : <Text style={styles.buttonText}>✨ 生成下一章</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function ChapterReadScreen({ navigation, route }) {
  const { chapter, bookTitle } = route.params || {};
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === chapter.puzzle?.answer);
    setShowResult(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.createTitle} numberOfLines={1}>{chapter?.title}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.readContent}>
        <Text style={styles.chapterContentTitle}>{chapter?.title}</Text>
        <Text style={styles.chapterContentText}>{chapter?.content}</Text>

        {chapter?.puzzle && !showResult && (
          <View style={styles.puzzleCard}>
            <Text style={styles.puzzleTitle}>🧩 谜题挑战</Text>
            <Text style={styles.puzzleQuestion}>{chapter.puzzle.question}</Text>
            {chapter.puzzle.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.puzzleOption}
                onPress={() => handleAnswer(option.charAt(0))}
              >
                <Text style={styles.puzzleOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showResult && (
          <View style={[styles.resultCard, isCorrect ? styles.resultCorrect : styles.resultWrong]}>
            <Text style={styles.resultTitle}>{isCorrect ? '🎉 回答正确！' : '😅 答错了'}</Text>
            <Text style={styles.resultText}>
              {isCorrect ? '太棒了！你成功解开了谜题！' : `正确答案是 ${chapter.puzzle.answer}，继续加油！`}
            </Text>
            {chapter.puzzle.hint && <Text style={styles.hintText}>💡 提示: {chapter.puzzle.hint}</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = { Home: '🏠', Bookshelf: '📚', Characters: '🎭', Settings: '⚙️' };
          return <Text style={{ fontSize: 24 }}>{icons[route.name]}</Text>;
        },
        tabBarActiveTintColor: COLORS.legoBlue,
        tabBarInactiveTintColor: COLORS.textMuted,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '首页' }} />
      <Tab.Screen name="Bookshelf" component={BookshelfScreen} options={{ tabBarLabel: '书架' }} />
      <Tab.Screen name="Characters" component={CharactersScreen} options={{ tabBarLabel: '角色' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '设置' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.legoYellow} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="StoryCreate" component={StoryCreateScreen} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen name="ChapterRead" component={ChapterReadScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 32 },
  icon: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 18, color: COLORS.textLight },
  card: { backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 2, borderColor: COLORS.legoYellow, padding: 24 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 24 },
  legoBlocks: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  block: { width: 40, height: 40, borderRadius: 8, marginHorizontal: 4 },
  form: { marginBottom: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  input: { backgroundColor: COLORS.background, borderWidth: 3, borderColor: COLORS.legoYellow, borderRadius: 16, padding: 16, fontSize: 16, color: COLORS.text },
  button: { backgroundColor: COLORS.legoYellow, borderRadius: 16, borderWidth: 3, borderColor: COLORS.legoOrange, paddingVertical: 16, paddingHorizontal: 32, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: COLORS.border, borderColor: COLORS.border },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  hint: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 16 },
  homeHeader: { padding: 20, paddingTop: 60 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  subGreeting: { fontSize: 16, color: COLORS.textLight, marginTop: 4 },
  welcomeCard: { backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 2, borderColor: COLORS.legoYellow, margin: 20, marginTop: 0, padding: 24 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  welcomeDesc: { fontSize: 16, color: COLORS.textLight, marginBottom: 12 },
  featureList: { marginBottom: 20 },
  featureItem: { fontSize: 15, color: COLORS.text, lineHeight: 28 },
  section: { marginTop: 8, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  characterCard: { width: 120, backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginRight: 12, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  characterEmoji: { fontSize: 40, marginBottom: 8 },
  characterName: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  characterCardLarge: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 16, margin: 6, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  characterEmojiLarge: { fontSize: 60, marginBottom: 8 },
  characterNameLarge: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  characterDesc: { fontSize: 12, color: COLORS.textLight, textAlign: 'center' },
  bookCard: { width: 140, backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginRight: 12, borderWidth: 2, borderColor: COLORS.border },
  bookIcon: { fontSize: 32, marginBottom: 8 },
  bookTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  bookChapters: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  bookshelfItem: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 16, margin: 6, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  emptyText: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center', padding: 40 },
  loadingText: { fontSize: 16, color: COLORS.textLight, marginTop: 16 },
  settingsContent: { padding: 20 },
  settingItem: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: COLORS.border },
  settingLabel: { fontSize: 14, color: COLORS.textLight, marginBottom: 4 },
  settingValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  logoutButton: { backgroundColor: COLORS.error, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  logoutText: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  createHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 60, backgroundColor: COLORS.white, borderBottomWidth: 2, borderBottomColor: COLORS.border },
  backButton: { fontSize: 16, color: COLORS.legoBlue, fontWeight: '600' },
  createTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  progressBar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: COLORS.white },
  progressStep: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 },
  progressStepActive: { backgroundColor: COLORS.legoYellow },
  progressText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMuted },
  progressTextActive: { color: COLORS.text },
  createContent: { flex: 1, padding: 20 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  stepDesc: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  characterGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  characterSelectCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: 12, padding: 16, margin: '1%', alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  characterSelectCardActive: { borderColor: COLORS.legoYellow, backgroundColor: '#FFFDE7' },
  checkMark: { position: 'absolute', top: 8, right: 8, fontSize: 20, color: COLORS.success },
  plotGrid: { marginBottom: 20 },
  plotCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 12, borderWidth: 2, borderColor: COLORS.border },
  plotCardActive: { borderColor: COLORS.legoYellow, backgroundColor: '#FFFDE7' },
  plotName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  plotDesc: { fontSize: 14, color: COLORS.textLight },
  titleInput: { backgroundColor: COLORS.white, borderWidth: 3, borderColor: COLORS.legoYellow, borderRadius: 16, padding: 20, fontSize: 18, color: COLORS.text, marginBottom: 20 },
  summaryCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 20, borderWidth: 2, borderColor: COLORS.border },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  summaryItem: { fontSize: 15, color: COLORS.text, marginBottom: 8 },
  bookInfoCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, marginBottom: 20, borderWidth: 2, borderColor: COLORS.legoYellow },
  bookInfoTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  bookInfoMeta: { fontSize: 16, color: COLORS.textLight },
  chapterItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: COLORS.border },
  chapterNumber: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.legoYellow, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  chapterNumberText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  chapterInfo: { flex: 1 },
  chapterTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  puzzleBadge: { fontSize: 12, color: COLORS.legoPurple, marginTop: 4 },
  chapterArrow: { fontSize: 20, color: COLORS.textMuted },
  readContent: { flex: 1, padding: 20 },
  chapterContentTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 20, textAlign: 'center' },
  chapterContentText: { fontSize: 18, color: COLORS.text, lineHeight: 32, marginBottom: 24 },
  puzzleCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, borderWidth: 2, borderColor: COLORS.legoPurple },
  puzzleTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.legoPurple, marginBottom: 16 },
  puzzleQuestion: { fontSize: 18, color: COLORS.text, marginBottom: 20 },
  puzzleOption: { backgroundColor: COLORS.background, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: COLORS.border },
  puzzleOptionText: { fontSize: 16, color: COLORS.text },
  resultCard: { borderRadius: 16, padding: 24, marginBottom: 20 },
  resultCorrect: { backgroundColor: '#E8F5E9', borderWidth: 2, borderColor: COLORS.success },
  resultWrong: { backgroundColor: '#FFEBEE', borderWidth: 2, borderColor: COLORS.error },
  resultTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  resultText: { fontSize: 16, color: COLORS.text },
  hintText: { fontSize: 14, color: COLORS.textLight, marginTop: 12, fontStyle: 'italic' },
});
