import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { booksAPI, charactersAPI, bookCharactersAPI, storyAPI, chaptersAPI } from '../../api';
import { Card, Button, Loading, EmptyState, StepIndicator, Modal } from '../../components/common';
import { COLORS, PLOT_TYPES, CHARACTER_EMOJIS, ROLE_TYPES } from '../../utils/constants';

const StoryCreateScreen = ({ navigation }) => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [books, setBooks] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, charsData] = await Promise.all([
        booksAPI.getList(user?.userId),
        charactersAPI.getList(user?.userId),
      ]);
      setBooks(booksData.books || []);
      setCharacters(charsData.characters || []);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const selectBook = (book) => {
    setSelectedBook(book);
    setCurrentStep(1);
  };

  const createNewBook = async () => {
    if (!newBookTitle.trim()) {
      toast.error('请输入书籍名称');
      return;
    }

    try {
      const data = await booksAPI.create(user?.userId, newBookTitle.trim());
      setSelectedBook({ book_id: data.bookId, title: newBookTitle, chapter_count: 0 });
      setNewBookTitle('');
      setCurrentStep(1);
      toast.success('书籍创建成功！');
    } catch (error) {
      toast.error(`创建失败：${error.message}`);
    }
  };

  const selectPlot = (plot) => {
    setSelectedPlot(plot);
    setCurrentStep(2);
  };

  const toggleCharacter = (character) => {
    const isSelected = selectedCharacters.some((c) => c.character_id === character.character_id);
    if (isSelected) {
      setSelectedCharacters(selectedCharacters.filter((c) => c.character_id !== character.character_id));
    } else {
      const hasProtagonist = selectedCharacters.some((c) => c.roleType === 'protagonist');
      setSelectedCharacters([
        ...selectedCharacters,
        {
          ...character,
          roleType: hasProtagonist ? 'supporting' : 'protagonist',
          customName: character.name,
        },
      ]);
    }
  };

  const updateCharacterRole = (characterId, roleType) => {
    if (roleType === 'protagonist') {
      setSelectedCharacters(selectedCharacters.map((c) => ({
        ...c,
        roleType: c.roleType === 'protagonist' ? 'supporting' : c.roleType,
      })));
    }
    setSelectedCharacters(selectedCharacters.map((c) =>
      c.character_id === characterId ? { ...c, roleType } : c
    ));
  };

  const updateCharacterName = (characterId, customName) => {
    setSelectedCharacters(selectedCharacters.map((c) =>
      c.character_id === characterId ? { ...c, customName } : c
    ));
  };

  const handleCreate = async () => {
    const hasProtagonist = selectedCharacters.some((c) => c.roleType === 'protagonist');
    if (!hasProtagonist) {
      toast.error('请至少选择一个主角');
      return;
    }

    const hasEmptyName = selectedCharacters.some((c) => !c.customName.trim());
    if (hasEmptyName) {
      toast.error('请为所有角色填写名称');
      return;
    }

    setIsCreating(true);
    try {
      for (const char of selectedCharacters) {
        await bookCharactersAPI.add(
          selectedBook.book_id,
          char.character_id,
          char.customName.trim(),
          char.roleType
        );
      }

      const charactersData = selectedCharacters.map((c) => ({
        character_id: c.character_id,
        custom_name: c.customName.trim(),
        personality: c.personality || '神秘',
        speaking_style: c.speaking_style || '正常',
      }));

      const storyData = await storyAPI.generate({
        characters: charactersData,
        plot: selectedPlot.name,
        chapter: 1,
        chapterCharacters: charactersData,
      });

      await chaptersAPI.create(
        selectedBook.book_id,
        storyData.title || '第一章',
        storyData.content,
        storyData.puzzle
      );

      toast.success('故事创建成功！🎉');
      setTimeout(() => {
        navigation.replace('BookDetail', { bookId: selectedBook.book_id });
      }, 1000);
    } catch (error) {
      toast.error(`创建失败：${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="加载中..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ 创建新故事</Text>
      </View>

      <StepIndicator currentStep={currentStep} totalSteps={4} />

      <ScrollView style={styles.content}>
        {currentStep === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>第一步：选择书籍</Text>
            <Text style={styles.stepDesc}>选择一个已有书籍继续创作，或创建新书籍</Text>

            {books.map((book) => (
              <Card
                key={book.book_id}
                style={[
                  styles.bookCard,
                  selectedBook?.book_id === book.book_id && styles.bookCardSelected,
                ]}
                onPress={() => selectBook(book)}
              >
                <Text style={styles.bookIcon}>📖</Text>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookChapters}>📚 {book.chapter_count}章</Text>
                </View>
              </Card>
            ))}

            <View style={styles.newBookSection}>
              <Text style={styles.newBookLabel}>或者创建新书籍</Text>
              <View style={styles.newBookInput}>
                <TextInput
                  style={styles.input}
                  placeholder="输入新书籍名称"
                  placeholderTextColor={COLORS.textMuted}
                  value={newBookTitle}
                  onChangeText={setNewBookTitle}
                  maxLength={50}
                />
                <Button title="📖 创建新书籍" onPress={createNewBook} />
              </View>
            </View>
          </View>
        )}

        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>第二步：选择故事类型</Text>
            <Text style={styles.stepDesc}>选择一个你喜欢的冒险类型！</Text>

            <View style={styles.plotGrid}>
              {PLOT_TYPES.map((plot) => (
                <Card
                  key={plot.id}
                  style={[
                    styles.plotCard,
                    selectedPlot?.id === plot.id && styles.plotCardSelected,
                  ]}
                  onPress={() => selectPlot(plot)}
                >
                  <Text style={styles.plotIcon}>{plot.icon}</Text>
                  <Text style={styles.plotName}>{plot.name}</Text>
                  <Text style={styles.plotDesc}>{plot.desc}</Text>
                </Card>
              ))}
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>第三步：选择角色</Text>
            <Text style={styles.stepDesc}>选择故事中的角色，必须选择一个主角！</Text>

            <Card variant="primary" style={styles.selectedSection}>
              <Text style={styles.selectedTitle}>
                📋 已选角色 ({selectedCharacters.length})
              </Text>
              {selectedCharacters.length === 0 ? (
                <Text style={styles.emptyText}>点击下方人仔添加角色</Text>
              ) : (
                selectedCharacters.map((char, index) => (
                  <View key={char.character_id} style={styles.selectedCharacter}>
                    <Text style={styles.selectedEmoji}>
                      {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
                    </Text>
                    <View style={styles.selectedInfo}>
                      <Text style={styles.selectedName}>{char.name}</Text>
                      <View style={styles.roleSelector}>
                        {ROLE_TYPES.map((role) => (
                          <TouchableOpacity
                            key={role.value}
                            style={[
                              styles.roleOption,
                              char.roleType === role.value && styles.roleOptionActive,
                            ]}
                            onPress={() => updateCharacterRole(char.character_id, role.value)}
                          >
                            <Text style={styles.roleOptionText}>{role.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => toggleCharacter(char)}
                    >
                      <Text style={styles.removeText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </Card>

            <Text style={styles.sectionTitle}>🎭 可选人仔</Text>
            <View style={styles.characterGrid}>
              {characters.map((char, index) => {
                const isSelected = selectedCharacters.some((c) => c.character_id === char.character_id);
                return (
                  <Card
                    key={char.character_id}
                    style={[styles.characterCard, isSelected && styles.characterCardDisabled]}
                    onPress={() => !isSelected && toggleCharacter(char)}
                  >
                    <Text style={styles.characterEmoji}>
                      {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
                    </Text>
                    <Text style={styles.characterName}>{char.name}</Text>
                    <Text style={styles.characterDesc} numberOfLines={1}>
                      {char.description || '神秘角色'}
                    </Text>
                  </Card>
                );
              })}
            </View>

            {selectedCharacters.some((c) => c.roleType === 'protagonist') && (
              <Button
                title="下一步"
                onPress={() => setCurrentStep(3)}
                size="lg"
                style={styles.nextButton}
              />
            )}
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>第四步：确认创建</Text>
            
            <Card variant="primary" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>📖 书籍：{selectedBook?.title}</Text>
              <Text style={styles.summaryItem}>🎭 类型：{selectedPlot?.name}</Text>
              <Text style={styles.summaryItem}>
                👥 角色：{selectedCharacters.map((c) => c.customName).join('、')}
              </Text>
            </Card>

            <Button
              title="🚀 开始创作"
              onPress={handleCreate}
              loading={isCreating}
              disabled={isCreating}
              size="lg"
              style={styles.createButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

import { TextInput } from 'react-native';

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
  content: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  bookCardSelected: {
    borderColor: COLORS.legoGreen,
    borderWidth: 3,
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
  newBookSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: COLORS.legoYellow,
  },
  newBookLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
    textAlign: 'center',
  },
  newBookInput: {
    gap: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.legoYellow,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  plotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  plotCard: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
  },
  plotCardSelected: {
    borderColor: COLORS.legoGreen,
    borderWidth: 3,
  },
  plotIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  plotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  plotDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  selectedSection: {
    marginBottom: 20,
    padding: 16,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: 20,
  },
  selectedCharacter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  roleOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.borderLight,
    borderRadius: 8,
  },
  roleOptionActive: {
    backgroundColor: COLORS.legoYellow,
  },
  roleOptionText: {
    fontSize: 10,
    color: COLORS.text,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  characterCard: {
    width: '47%',
    alignItems: 'center',
    padding: 12,
  },
  characterCardDisabled: {
    opacity: 0.5,
  },
  characterEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  characterDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 20,
  },
  summaryCard: {
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  createButton: {
    marginTop: 20,
  },
});

export default StoryCreateScreen;
