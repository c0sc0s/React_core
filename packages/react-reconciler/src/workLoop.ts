import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode, createWorkInProgress } from "./fiber";

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberRootNode) {
	workInProgress = createWorkInProgress(fiber.current, {});
}

function markUpdarteFromFiberToRoot(fiber: FiberNode): FiberRootNode {
	while (fiber.return) {
		fiber = fiber.return;
	}

	return fiber.stateNode;
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	const root = markUpdarteFromFiberToRoot(fiber);
	renderRoot(root);
}

function renderRoot(root: FiberRootNode) {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.error(e);
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		// 为什么要传呢？不是全局变量吗？存疑
		performUnitOfWork();
	}
}

function performUnitOfWork() {
	const next = beginWork(workInProgress);
	workInProgress.memoizedProps = workInProgress.pendingProps;

	if (next !== null) {
		workInProgress = next;
	} else {
		completeUnitOfWork(workInProgress);
	}
}

function completeUnitOfWork(node: FiberNode | null) {
	while (node) {
		completeWork(node);

		const sibling = node.sibling;

		if (sibling) {
			work;
		}
	}
}
