import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";

export const NOTIFICATIONS_FEATURE_KEY = "notifications";

export interface Notification {
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

let SYNTHETIC_ID = 0;
export const getNewNotificationId = () => {
  return SYNTHETIC_ID++;
};

/*
 * Update these interfaces according to your requirements.
 */
export interface NotificationsEntity extends Notification {
  id: number;
}

export const notificationsAdapter = createEntityAdapter<NotificationsEntity>({
  selectId: (notification) => notification.id,
});

export const initialNotificationsState: EntityState<NotificationsEntity> =
  notificationsAdapter.getInitialState({});

export const notificationsSlice = createSlice({
  name: NOTIFICATIONS_FEATURE_KEY,
  initialState: initialNotificationsState,
  reducers: {
    add: notificationsAdapter.addOne,
    remove: notificationsAdapter.removeOne,
  },
});

/*
 * Export reducer for store configuration.
 */
export const notificationsReducer = notificationsSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(notificationsActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const notificationsActions = notificationsSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllNotifications);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = notificationsAdapter.getSelectors();

export const getNotificationsState = (rootState: {
  [NOTIFICATIONS_FEATURE_KEY]: EntityState<NotificationsEntity>;
}): EntityState<NotificationsEntity> => rootState[NOTIFICATIONS_FEATURE_KEY];

export const selectAllNotifications = createSelector(
  getNotificationsState,
  selectAll
);

export const selectNotificationsEntities = createSelector(
  getNotificationsState,
  selectEntities
);
