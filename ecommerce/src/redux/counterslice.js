import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name:"counter",
    initialState : {
        value:0
    },
    reducers : {
        increment : function(state, action){
        },
        decrement : function(state, action){
        },
    }
});
export {increment , decrement} = counterSlice.actions;
export default counterSlice