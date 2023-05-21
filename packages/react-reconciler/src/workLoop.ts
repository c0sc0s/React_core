import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode } from "./fiber";

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber) {
	workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
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
