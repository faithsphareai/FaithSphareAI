import { useMutation } from '@tanstack/react-query';
import { getHadithAnswer } from '../utils/services/apis';

export const useHadithFinderMutation = () => {
  return useMutation({
    mutationFn: (question) => getHadithAnswer(question),
    onError: (error) => {
      console.error('Hadith Finder Mutation Error:', error);
      return error.message;
    }
  });
};