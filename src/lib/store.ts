import { type Action, action, createStore, persist } from "easy-peasy";

export type DebugScreenState = "hidden" | "minimized" | "visible";

export interface DebugScreenModel {
  state: DebugScreenState;
  setState: Action<DebugScreenModel, Exclude<DebugScreenState, "hidden">>;
}

export interface StoreModel {
  debugScreen: DebugScreenModel;
}

export const store = createStore<StoreModel>({
  debugScreen: persist<DebugScreenModel>({
    state: "hidden",
    setState: action((state, nextState) => {
      state.state = nextState;
    }),
  }),
});
