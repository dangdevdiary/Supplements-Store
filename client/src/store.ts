import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userReducer from './slices/user.slice';
import cartReducer from './slices/cart.slice';
import navigationReducer from './slices/navigation.slice';
import modalReducer from './slices/modal.slice';
import productReducer from './slices/product.slice';
import authReducer from './slices/auth.slice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// ...
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authReducer'],
};

const rootReducer = combineReducers({
  userReducer,
  cartReducer,
  navigationReducer,
  modalReducer,
  productReducer,
  authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
