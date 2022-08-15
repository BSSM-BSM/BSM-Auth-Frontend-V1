export const localStorageEffect = (key: string, isJson: boolean) =>
  ({ setSelf, onSet }: any) => {
    const localStorage = typeof window !== 'undefined'? window.localStorage: null;
    const savedValue = localStorage && localStorage.getItem(key);
    if (savedValue !== null) {
        setSelf(isJson? JSON.parse(savedValue): savedValue);
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
        ?localStorage && localStorage.removeItem(key)
        :localStorage && localStorage.setItem(key, isJson? JSON.stringify(newValue): newValue);
    });
};