import { Ref, ref, watch } from 'vue';

export default function useLoading(loading: boolean) {
  const loadingRef = ref(loading);

  watch(() => loading, (newValue) => {
    loadingRef.value = newValue;
  });

  return {
    loadingRef
  };
} 