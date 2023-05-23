import { Props, ReactElementType } from "shared/ReactTypes";
import {
	FiberNode,
	createFiberFromElement,
	createWorkInProgress
} from "./fiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { HostText } from "./workTags";
import { ChildDeletion, Placement } from "./fiberFlags";

function ChildReconciler(shouldTrackEffects: boolean) {
	function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
		if (!shouldTrackEffects) {
			return;
		}

		const deletions = returnFiber.deletions;
		if (deletions === null) {
			returnFiber.deletions = [childToDelete];
			returnFiber.flags |= ChildDeletion;
		} else {
			deletions.push(childToDelete);
		}
	}

	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		const key = element.key;

		// todo: 这里关于详细的流程和return要做处理
		if (currentFiber) {
			if (currentFiber.key === key) {
				if (element.$$typeof === REACT_ELEMENT_TYPE) {
					if (element.type === currentFiber.type) {
						// 复用
						const existing = useFiber(currentFiber, element.props);
						existing.return = returnFiber;
						return existing;
					}
					deleteChild(returnFiber, currentFiber);
				} else {
					if (__DEV__) {
						console.warn("尚未定义的reactElement type类型", element);
					}
				}
			} else {
				deleteChild(returnFiber, currentFiber);
			}
		}

		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		if (currentFiber !== null) {
			if (currentFiber.tag === HostText) {
				const existing = useFiber(currentFiber, { content });
				existing.return = returnFiber;
				return existing;
			}
			deleteChild(returnFiber, currentFiber);
		}

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

		// 兜底删除
		currentFiberNode && deleteChild(returnFiber, currentFiberNode);

		if (__DEV__) {
			console.warn("React.createElement: type is invalid.");
		}

		return null;
	};

	function useFiber(fiber: FiberNode, pendingProps: Props): FiberNode {
		const clone = createWorkInProgress(fiber, pendingProps);
		clone.index = 0;
		clone.sibling = null;
		return clone;
	}
}

// mount 阶段的一个优化：
// 在内存中构建离屏的完整一颗 DOM 树
//
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
