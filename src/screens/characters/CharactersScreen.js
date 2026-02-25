import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { charactersAPI } from '../../api';
import { Card, Button, Loading, EmptyState, Modal } from '../../components/common';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';

const CharactersScreen = () => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: '',
    speakingStyle: '',
  });

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const data = await charactersAPI.getList(user?.userId);
      setCharacters(data.characters || []);
    } catch (error) {
      toast.error('加载失败，请下拉刷新');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCharacters();
    setRefreshing(false);
  }, []);

  const presetCharacters = characters.filter((c) => c.creator_id === 'system');
  const userCharacters = characters.filter((c) => c.creator_id !== 'system');

  const openCreateModal = () => {
    setEditingCharacter(null);
    setFormData({ name: '', description: '', personality: '', speakingStyle: '' });
    setModalVisible(true);
  };

  const openEditModal = (character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name || '',
      description: character.description || '',
      personality: character.personality || '',
      speakingStyle: character.speaking_style || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('请输入角色名称');
      return;
    }

    try {
      if (editingCharacter) {
        await charactersAPI.update(editingCharacter.character_id, formData);
        toast.success('角色更新成功！✨');
      } else {
        await charactersAPI.create({
          ...formData,
          creatorId: user?.userId || 'user',
        });
        toast.success('角色创建成功！🎉');
      }
      setModalVisible(false);
      loadCharacters();
    } catch (error) {
      toast.error(`操作失败：${error.message}`);
    }
  };

  const handleDelete = async (character) => {
    try {
      const result = await charactersAPI.delete(character.character_id);
      if (result.needsConfirm) {
        toast.warning(`该角色已在 ${result.usageCount} 个故事中使用`);
      } else {
        toast.success('角色已删除！🗑️');
        loadCharacters();
      }
    } catch (error) {
      toast.error(`删除失败：${error.message}`);
    }
  };

  const renderCharacterItem = ({ item, index, isPreset }) => (
    <Card style={styles.characterCard}>
      <Text style={styles.characterEmoji}>
        {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
      </Text>
      <Text style={styles.characterName}>{item.name}</Text>
      <Text style={styles.characterDesc} numberOfLines={2}>
        {item.description || '神秘角色'}
      </Text>
      <Text style={styles.characterPersonality}>
        性格：{item.personality || '神秘'}
      </Text>
      <Text style={styles.characterSpeaking} numberOfLines={1}>
        "{item.speaking_style || '独特风格'}"
      </Text>
      {isPreset ? (
        <View style={styles.presetBadge}>
          <Text style={styles.presetBadgeText}>⭐ 系统预设</Text>
        </View>
      ) : (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => openEditModal(item)}
          >
            <Text style={styles.btnText}>✏️ 编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.btnText}>🗑️ 删除</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  if (isLoading) {
    return <Loading fullScreen message="加载角色..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎭 人仔角色</Text>
        <Button title="➕ 创建人仔" onPress={openCreateModal} size="sm" />
      </View>

      <FlatList
        data={[{ type: 'section', title: '预设人仔' }, ...presetCharacters, { type: 'section', title: '我的人仔' }, ...userCharacters]}
        keyExtractor={(item, index) => item.character_id || `section-${index}`}
        renderItem={({ item, index }) => {
          if (item.type === 'section') {
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {item.title === '预设人仔' ? '⭐ 预设人仔' : '🎨 我的人仔'}
                </Text>
              </View>
            );
          }
          const isPreset = item.creator_id === 'system';
          const itemIndex = isPreset 
            ? presetCharacters.indexOf(item) 
            : userCharacters.indexOf(item);
          return renderCharacterItem({ item, index: itemIndex, isPreset });
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🎭"
            title="还没有角色"
            description="创建你的第一个角色吧"
            action={<Button title="➕ 创建人仔" onPress={openCreateModal} />}
          />
        }
      />

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingCharacter ? '✏️ 编辑人仔' : '🎭 创建新人仔'}
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>👤 名称</Text>
            <TextInput
              style={styles.input}
              placeholder="给角色起个名字"
              placeholderTextColor={COLORS.textMuted}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              maxLength={20}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📝 描述</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="描述一下这个角色"
              placeholderTextColor={COLORS.textMuted}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>💫 性格</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：勇敢、善良"
              placeholderTextColor={COLORS.textMuted}
              value={formData.personality}
              onChangeText={(text) => setFormData({ ...formData, personality: text })}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🗣️ 说话风格</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：亲切友好"
              placeholderTextColor={COLORS.textMuted}
              value={formData.speakingStyle}
              onChangeText={(text) => setFormData({ ...formData, speakingStyle: text })}
            />
          </View>
          <Button
            title={editingCharacter ? '💾 保存修改' : '✨ 创建'}
            onPress={handleSave}
            size="lg"
            style={styles.saveButton}
          />
        </View>
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
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.legoBlue,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  characterCard: {
    marginBottom: 12,
    alignItems: 'center',
    padding: 16,
  },
  characterEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  characterDesc: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
  characterPersonality: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  characterSpeaking: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  presetBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.legoGreen,
    borderRadius: 12,
  },
  presetBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.legoBlue,
    borderRadius: 12,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.error,
    borderRadius: 12,
  },
  btnText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 8,
  },
});

export default CharactersScreen;
