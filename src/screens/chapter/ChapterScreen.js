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
import { chaptersAPI, puzzleAPI, plotOptionsAPI } from '../../api';
import { Card, Button, Loading, Modal, Header } from '../../components/common';
import { COLORS } from '../../utils/constants';

const ChapterScreen = ({ route, navigation }) => {
  const { chapterId, bookId } = route.params;
  const { user } = useAuth();
  const toast = useToast();
  
  const [chapter, setChapter] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [plotModalVisible, setPlotModalVisible] = useState(false);
  const [plotOptions, setPlotOptions] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState({
    weather: null,
    adventureType: null,
    terrain: null,
    equipment: null,
  });

  useEffect(() => {
    loadChapter();
  }, [chapterId]);

  const loadChapter = async () => {
    try {
      const data = await chaptersAPI.getDetail(chapterId, user?.userId);
      setChapter(data.chapter);
      if (data.chapter.has_puzzle && data.puzzle) {
        setPuzzle(data.puzzle);
        if (data.puzzleRecord) {
          setIsCorrect(data.puzzleRecord.is_correct === 1);
        }
      }
    } catch (error) {
      toast.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (selectedAnswer || isCorrect) return;

    setSelectedAnswer(answer);
    try {
      const result = await puzzleAPI.submit(puzzle.puzzle_id, user?.userId, answer);
      setAttempts(result.attempts);
      
      if (result.isCorrect) {
        setIsCorrect(true);
        toast.success('🎉 回答正确！');
        await chaptersAPI.complete(bookId, chapterId, user?.userId);
      } else {
        toast.error(`❌ 答案错误，还有 ${3 - result.attempts} 次机会`);
        if (result.hint) {
          toast.info(`💡 提示：${result.hint}`);
        }
        setTimeout(() => setSelectedAnswer(null), 1000);
      }
    } catch (error) {
      toast.error('提交失败');
      setSelectedAnswer(null);
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

  const handleGenerateNext = async () => {
    if (!selectedPlot.weather || !selectedPlot.adventureType || !selectedPlot.terrain || !selectedPlot.equipment) {
      toast.error('请选择所有情节选项');
      return;
    }

    setPlotModalVisible(false);
    try {
      await chaptersAPI.generate(bookId, user?.userId, selectedPlot);
      toast.success('新章节生成成功！');
      navigation.goBack();
    } catch (error) {
      toast.error(`生成失败：${error.message}`);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="加载章节..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={`第${chapter?.chapter_number}章`}
        subtitle={chapter?.title}
        leftButton={<Header.BackButton onPress={() => navigation.goBack()} />}
      />

      <ScrollView style={styles.content}>
        <Card style={styles.storyCard}>
          <Text style={styles.chapterTitle}>{chapter?.title}</Text>
          <Text style={styles.storyContent}>{chapter?.content}</Text>
        </Card>

        {puzzle && !isCorrect && (
          <Card variant="warning" style={styles.puzzleCard}>
            <Text style={styles.puzzleTitle}>❓ 互动谜题</Text>
            <Text style={styles.puzzleQuestion}>{puzzle.question}</Text>
            
            <View style={styles.optionsGrid}>
              {JSON.parse(puzzle.options).map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option.charAt(0) && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleAnswer(option.charAt(0))}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={styles.optionText}>
                    {String.fromCharCode(65 + index)}. {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.attemptsText}>
              尝试次数: {attempts} / 3
            </Text>
          </Card>
        )}

        {isCorrect && (
          <Card variant="success" style={styles.resultCard}>
            <Text style={styles.resultIcon}>✅</Text>
            <Text style={styles.resultTitle}>太棒了！</Text>
            <Text style={styles.resultText}>你成功解开了谜题，可以继续冒险了！</Text>
          </Card>
        )}

        {(isCorrect || !puzzle) && (
          <Button
            title="✨ 继续生成故事"
            onPress={openPlotModal}
            size="lg"
            style={styles.continueButton}
          />
        )}
      </ScrollView>

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
          <Button title="✨ 确认生成" onPress={handleGenerateNext} size="lg" />
        </ScrollView>
      </Modal>
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
  storyCard: {
    marginBottom: 20,
    padding: 20,
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  storyContent: {
    fontSize: 18,
    lineHeight: 32,
    color: COLORS.text,
  },
  puzzleCard: {
    marginBottom: 20,
    padding: 20,
  },
  puzzleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  puzzleQuestion: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
  },
  optionsGrid: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  attemptsText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
  resultCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  resultIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
  },
  continueButton: {
    marginBottom: 40,
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

export default ChapterScreen;
