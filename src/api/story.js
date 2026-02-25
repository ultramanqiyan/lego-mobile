import apiClient from './client';

export const storyAPI = {
  async generate(params) {
    return apiClient.post('/story', {
      characters: params.characters,
      plot: params.plot,
      chapter: params.chapter,
      chapterCharacters: params.chapterCharacters,
      previousSummary: params.previousSummary,
      previousPuzzle: params.previousPuzzle,
      plotSelection: params.plotSelection,
    });
  },
};

export default storyAPI;
