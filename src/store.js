import { configureStore } from "@reduxjs/toolkit";
import countReducer from "./features/counter/CounterSlice"


export const store = configureStore({
    reducer: {
        counter: countReducer
    }
})