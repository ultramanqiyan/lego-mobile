import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { booksAPI, bookCharactersAPI, chaptersAPI, charactersAPI, storyAPI, plotOptionsAPI } from '../../api';
import { Card, Button, Loading, EmptyState, Modal, Header } from '../../components/common';
import { COLORS, CHARACTER_EMOJIS, ROLE_TYPES, PLOT_ICONS } from '../../utils/constants';
import { getRoleLabel, getPlotNameDisplay } from '../../utils/helpers';

const BookDetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { user } = useAuth();
  const toast = useToast();
  
  const [book, setBook] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chapters');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [plotModalVisible, setPlotModalVisible] = useState(false);
  const [plotOptions, setPlotOptions] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState({
    weather: null,
    adventureType: null,
    terrain: null,
    equipment: null,
  });
  const [newCharacter, setNewCharacter] = useState({
    characterId: null,
    customName: '',
    roleType: 'supporting',
  });

  useEffect(() => {
    loadData();
  }, [bookId]);

  const loadData = async () => {
    try {
      const [bookData, charsData] = await Promise.all([
        booksAPI.getDetail(bookId, user?.userId),
        charactersAPI.getList(user?.userId),
      ]);
      
      setBook(bookData.book);
      setCharacters(bookData.characters || []);
      setChapters(bookData.chapters || []);
      setAllCharacters(charsData.characters || []);
    } catch (error) {
      toast.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const availableCharacters = allCharacters.filter(
    (c) => !characters.some((bc) => bc.character_id === c.character_id)
  );

  const handleAddCharacter = async () => {
    if (!newCharacter.characterId || !newCharacter.customName.trim()) {
      toast.error('请填写完整信息');
      return;
    }

    try {
      await bookCharactersAPI.add(
        bookId,
        newCharacter.characterId,
        newCharacter.customName.trim(),
        newCharacter.roleType
      );
      toast.success('角色添加成功！');
      setAddModalVisible(false);
      setNewCharacter({ characterId: null, customName: '', roleType: 'supporting' });
      loadData();
    } catch (error) {
      toast.error(`添加失败：${error.message}`);
    }
  };

  const handleDeleteCharacter = async (id) => {
    try {
      await bookCharactersAPI.delete(id);
      toast.success('角色删除成功！');
      loadData();
    } catch (error) {
      toast.error(`删除失败：${error.message}`);
    }
  };

  const openPlotModal = async () => {
    if (!plotOptions) {
      try {
        const data = await plotOptionsAPI.get();
        setPlotOptions(data.plotOptions);
      } catch (error) {
        console.error('Failed to load plot options');
      }
    }
    setPlotModalVisible(true);
  };

  const handleGenerateChapter = async () => {
    if (!selectedPlot.weather || !selectedPlot.adventureType || !selectedPlot.terrain || !selectedPlot.equipment) {
      toast.error('请选择所有情节选项');
      return;
    }

    setPlotModalVisible(false);
    try {
      await chaptersAPI.generate(bookId, user?.userId, selectedPlot);
      toast.success('章节生成成功！');
      loadData();
    } catch (error) {
      toast.error(`生成失败：${error.message}`);
    }
  };

  const renderChapterItem = ({ item, index }) => (
    <Card
      style={styles.chapterCard}
      onPress={() => navigation.navigate('Chapter', { chapterId: item.chapter_id, bookId })}
    >
      <View style={styles.chapterInfo}>
        <Text style={styles.chapterNumber}>第{item.chapter_number}章</Text>
        <Text style={styles.chapterTitle}>{item.title}</Text>
      </View>
      {item.has_puzzle && (
        <Text style={styles.puzzleIcon}>
          {item.puzzle_result === 1 ? '✅' : item.puzzle_result === 0 ? '❌' : '🧩'}
        </Text>
      )}
    </Card>
  );

  const renderCharacterItem = ({ item, index }) => (
    <Card style={styles.characterCard}>
      <Text style={styles.characterEmoji}>
        {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
      </Text>
      <Text style={styles.characterName}>{item.custom_name}</Text>
      <Text style={styles.characterRole}>{getRoleLabel(item.role_type)}</Text>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDeleteCharacter(item.id)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </Card>
  );

  if (isLoading) {
    return <Loading fullScreen message="加载书籍..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={book?.title || '故事详情'}
        leftButton={<Header.BackButton onPress={() => navigation.goBack()} />}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chapters' && styles.tabActive]}
          onPress={() => setActiveTab('chapters')}
        >
          <Text style={[styles.tabText, activeTab === 'chapters' && styles.tabTextActive]}>
            📚 章节
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'characters' && styles.tabActive]}
          onPress={() => setActiveTab('characters')}
        >
          <Text style={[styles.tabText, activeTab === 'characters' && styles.tabTextActive]}>
            🎭 角色
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'chapters' ? (
        <FlatList
          data={chapters}
          renderItem={renderChapterItem}
          keyExtractor={(item) => item.chapter_id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="📚"
              title="还没有章节"
              description="点击下方按钮添加章节"
            />
          }
        />
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacterItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.characterRow}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="🎭"
              title="还没有角色"
              description="点击下方按钮添加角色"
            />
          }
        />
      )}

      <View style={styles.bottomBar}>
        {activeTab === 'chapters' ? (
          <Button
            title="➕ 添加章节"
            onPress={openPlotModal}
            size="lg"
            style={styles.bottomButton}
          />
        ) : (
          <Button
            title="➕ 添加角色"
            onPress={() => setAddModalVisible(true)}
            size="lg"
            style={styles.bottomButton}
          />
        )}
      </View>

      <Modal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        title="➕ 添加角色"
      >
        <View style={styles.modalForm}>
          <Text style={styles.label}>选择人仔</Text>
          <View style={styles.characterSelector}>
            {availableCharacters.map((char) => (
              <TouchableOpacity
                key={char.character_id}
                style={[
                  styles.characterOption,
                  newCharacter.characterId === char.character_id && styles.characterOptionActive,
                ]}
                onPress={() => setNewCharacter({ ...newCharacter, characterId: char.character_id })}
              >
                <Text style={styles.characterOptionText}>{char.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>自定义名称</Text>
          <TextInput
            style={styles.input}
            placeholder="为角色取个名字"
            placeholderTextColor={COLORS.textMuted}
            value={newCharacter.customName}
            onChangeText={(text) => setNewCharacter({ ...newCharacter, customName: text })}
            maxLength={20}
          />
          <Text style={styles.label}>角色类型</Text>
          <View style={styles.roleSelector}>
            {ROLE_TYPES.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.roleOption,
                  newCharacter.roleType === role.value && styles.roleOptionActive,
                ]}
                onPress={() => setNewCharacter({ ...newCharacter, roleType: role.value })}
              >
                <Text style={styles.roleOptionText}>{role.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="✅ 保存" onPress={handleAddCharacter} size="lg" />
        </View>
      </Modal>

      <Modal
        visible={plotModalVisible}
        onClose={() => setPlotModalVisible(false)}
        title="🎭 选择故事情节"
      >
        <ScrollView style={styles.plotModalContent}>
          {plotOptions && Object.entries(plotOptions).map(([category, options]) => (
            <View key={category} style={styles.plotSection}>
              <Text style={styles.plotSectionTitle}>
                {category === 'weather' && '☀️ 天气'}
                {category === 'adventureType' && '🗺️ 冒险类型'}
                {category === 'terrain' && '🌲 地形'}
                {category === 'equipment' && '🪄 装备与道具'}
              </Text>
              <View style={styles.plotOptions}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.plotOption,
                      selectedPlot[category] === option.id && styles.plotOptionActive,
                    ]}
                    onPress={() => setSelectedPlot({ ...selectedPlot, [category]: option.id })}
                  >
                    <Text style={styles.plotOptionIcon}>{option.icon}</Text>
                    <Text style={styles.plotOptionName}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <Button title="✨ 确认生成" onPress={handleGenerateChapter} size="lg" />
        </ScrollView>
      </Modal>
    </View>
  );
};

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.legoYellow,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  tabTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterNumber: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  puzzleIcon: {
    fontSize: 24,
  },
  characterRow: {
    justifyContent: 'space-between',
  },
  characterCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  characterEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  characterRole: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  deleteText: {
    fontSize: 20,
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomButton: {
    width: '100%',
  },
  modalForm: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  characterSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  characterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  characterOptionActive: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  characterOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.legoYellow,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleOptionActive: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  roleOptionText: {
    fontSize: 12,
    color: COLORS.text,
  },
  plotModalContent: {
    maxHeight: 400,
  },
  plotSection: {
    marginBottom: 20,
  },
  plotSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  plotOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  plotOption: {
    width: '23%',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  plotOptionActive: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  plotOptionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  plotOptionName: {
    fontSize: 10,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default BookDetailScreen;
