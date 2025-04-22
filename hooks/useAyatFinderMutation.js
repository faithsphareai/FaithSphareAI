import { useMutation } from '@tanstack/react-query';
import { getAyatAnswer } from '../utils/services/apis';

export const useAyatFinderMutation = () => {
  return useMutation({
    mutationFn: (question) => getAyatAnswer(question),
    onError: (error) => {
      console.error('Ayat Finder Mutation Error:', error);
      return error.message;
    }
  });
};