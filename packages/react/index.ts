import { jsx } from "./src/jsx";
import { Dispatcher, resolveDispatcher } from "./src/currentDispatcher";
import currentDispatcher from "./src/currentDispatcher";

export const useState: Dispatcher["useState"] = (initialState: any) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};

// 内部数据共享层
export const _SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
	currentDispatcher
};

export default {
	version: "0.0.0",
	createReactElement: jsx
};
