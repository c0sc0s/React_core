import { ReactElementType } from "shared/ReactTypes";
import { FiberNode, createFiberFromElement } from "./fiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { HostText } from "./workTags";
import { Placement } from "./fiberFlags";

function ChildReconciler(shouldTrackEffects: boolean) {
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiberNode: FiberNode | null,
		newChild?: ReactElementType
	) {
		if (newChild && typeof newChild === "object") {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiberNode, newChild)
					);
				default:
					if (__DEV__) {
						console.warn("React.createElement: type is invalid.");
					}
					return null;
			}
		}

		if (typeof newChild === "string" || typeof newChild === "number") {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiberNode, newChild)
			);
		}

		if (__DEV__) {
			console.warn("React.createElement: type is invalid.");
		}

		return null;
	};
}

// mount 阶段的一个优化：
// 在内存中构建离屏的完整一颗 DOM 树
//
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
