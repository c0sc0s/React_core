import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode, createWorkInProgress } from "./fiber";

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberRootNode) {
	// 刷新栈帧

	workInProgress = createWorkInProgress(fiber.current, {});
}

function markUpdateFromFiberToRoot(fiber: FiberNode): FiberRootNode {
	while (fiber.return) {
		fiber = fiber.return;
	}

	return fiber.stateNode;
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// root 是 React 应用的 根节点 FiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);

	// 可以看到，react 整个更新是从应用的根节点作为基点的
	renderRoot(root);
}

function renderRoot(root: FiberRootNode) {
	// 一个新的更新，刷新栈帧
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.error(e);
			}
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// commit 入口
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {}

function workLoop() {
	while (workInProgress !== null) {
		// 为什么要传呢？不是全局变量吗？存疑
		performUnitOfWork();
	}
}

function performUnitOfWork() {
	if (workInProgress === null) {
		return;
	}

	// beginWork 返回当前 workInProgress 的 child
	const next = beginWork(workInProgress as FiberNode);

	// 经过beginWork 后
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
			workInProgress = sibling;
			return;
		} else {
			node = node.return;
		}
	}
}
