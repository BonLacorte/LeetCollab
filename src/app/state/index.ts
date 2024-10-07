import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateType {
    // user: UserType;
    isDarkMode: boolean;
}

const initialState: InitialStateType = {
    // user: null,
    isDarkMode: false,
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setIsDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
    },
});

export const { setIsDarkMode } = globalSlice.actions;
export default globalSlice.reducer;
