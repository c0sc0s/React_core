import { Action } from "shared/ReactTypes";

export interface Dispatcher {
	useState: <T>(initialState: (() => T) | T) => [T, Dispatch<T>];
	// useEffect: any;
}

export type Dispatch<State> = (action: Action<State>) => void;

const currentDispatcher: { current: Dispatcher | null } = {
	current: null
};

export default currentDispatcher;

export const resolveDispatcher = (): Dispatcher => {
	const dispatcher = currentDispatcher.current;
	if (dispatcher === null) {
		throw new Error(
			"Hooks can only be called inside the body of a function component. (https://fb.me/react-invalid-hook-call)"
		);
	}
	return dispatcher;
};
