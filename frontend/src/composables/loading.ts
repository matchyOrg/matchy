export const asyncLoading = <T extends (...args: any[]) => Promise<any>>(
  handler: T
) => {
  const loading = ref(false);
  return reactive({
    loading: loading,
    handler: ((...args: any[]) => {
      loading.value = true;
      return handler(...args).finally(() => {
        loading.value = false;
      });
    }) as T,
  });
};
