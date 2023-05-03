import { REACT_ELEMENT_TYPE } from "../../shared/ReactSymbols";
import {
	ElementType,
	Key,
	Props,
	ReactElementType,
	Ref,
	Type
} from "shared/ReactTypes";

const ReactElement = (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType => {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: "cosine"
	};

	return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	// 组装
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	// 处理config
	for (const prop in config) {
		const val = config[prop];
		if (prop === "key") {
			if (val !== undefined) {
				key = "" + val;
			}
			continue;
		}
		if (prop === "ref") {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	// 处理children
	const childrenLength = maybeChildren.length;
	if (childrenLength) {
		if (childrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}

	return ReactElement(type, key, ref, props);
};

export const jsxDEV = jsx;

// 虚拟dom --> 真实dom
