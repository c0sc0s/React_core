import { Props, Key, Ref } from "shared/ReactTypes";
import { WorkTag } from "./workTags";
import { Flags, NoFlags } from "./fiberFlags";
import { Container } from "hostConfig";

export class FiberNode {
	type: any;
	tag: WorkTag;
	key: Key;
	stateNode: any;
	Key: Key;
	child: FiberNode | null;
	sibling: FiberNode | null;
	return: FiberNode | null;
	index: number;
	ref: Ref;
	pendingProps: Props | null;
	memoizedProps: Props | null;
	memoizedState: any;
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例：
		this.tag = tag;
		this.stateNode = null;
		this.key = key;
		this.type = null;

		// 节点间的关系：
		this.child = null;
		this.sibling = null;
		this.return = null;
		this.index = 0;

		this.ref = null;

		// 工作单元：
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;

		// 用于双缓存技术：
		this.alternate = null;

		// 副作用
		this.flags = NoFlags;

		// 用于更新队列
		this.updateQueue = null;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;

		hostRootFiber.stateNode = this;

		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let workInProgress = current.alternate;

	if (workInProgress === null) {
		// mount
		workInProgress = new FiberNode(current.tag, pendingProps, current.key);
		workInProgress.type = current.type;
		workInProgress.stateNode = current.stateNode;
		workInProgress.alternate = current;
		current.alternate = workInProgress;
	} else {
		// update
		workInProgress.pendingProps = pendingProps;
		workInProgress.flags = NoFlags;
	}

	workInProgress.type = current.type;
	workInProgress.updateQueue = current.updateQueue;
	workInProgress.child = current.child;

	return workInProgress;
};
