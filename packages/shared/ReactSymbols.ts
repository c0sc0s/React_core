const supportStymulus = typeof Symbol === "function";
export const REACT_ELEMENT_TYPE = supportStymulus
	? Symbol.for("react.element")
	: 0xfac1;
