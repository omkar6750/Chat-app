import { create } from "zustand";
import { createAuthSlice } from "./slice/auth-Slice";

export const useAppStore = create()((...a) =>({
    ...createAuthSlice(...a),

}));

