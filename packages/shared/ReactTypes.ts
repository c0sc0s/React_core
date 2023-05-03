export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export type ReactElementType = {
	$$typeof: Symbol | number;
	type: ElementType;
	key: Key;
	ref: Ref;
	props: Props;
};

export type Action<State> = State | ((preState: State) => State);
