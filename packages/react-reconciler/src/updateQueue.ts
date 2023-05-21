import { Action } from "shared/ReactTypes";

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	return { shared: { pending: null } };
};

export const enqueueUpdate = <State>(
	update: Update<State>,
	updateQueue: UpdateQueue<State>
): void => {
	updateQueue.shared.pending = update;
};

export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): {
	memoizedState: State;
} => {
	let memoizedState = baseState;

	const { action } = pendingUpdate || {};

	if (action instanceof Function) {
		// 用instanceof进行类型保护
		memoizedState = action(memoizedState);
	} else if (action !== undefined) {
		memoizedState = action;
	}

	return {
		memoizedState
	};
};
