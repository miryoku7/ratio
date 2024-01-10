// localStorageに保存する関数
export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
}

// localStorageから取得する関数
export const getLocalStorage = <T>(key: string) => {
  const item = localStorage.getItem(key);
  if (item === null) {
    return null;
  }
  return JSON.parse(item) as T;
}
