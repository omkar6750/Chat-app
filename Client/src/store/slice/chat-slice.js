export const createChatSlice = (set, get) => ({
    selecedChatType:undefined;
    selecedChatData:undefined;
    setSelecedChatType:(selecedChatType) => set({selecedChatType}),
    setSelecedChatData:(selecedChatData) =>set({selecedChatData}),
})