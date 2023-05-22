import { Key, Props, Ref } from "shared/ReactTypes";
import { WorkTag } from "./workTags";
import { NoFlags } from "./fiberFlags";
import { Container } from "hostConfig";
import { UpdateQueue } from "./updateQueue";

export class FiberNode {
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	type: any;

	return: FiberNode | null;
	child: FiberNode | null;
	sibling: FiberNode | null;
	index: number;

	ref: Ref;
	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: number;
	updateQueue: UpdateQueue<any> | null;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.pendingProps = pendingProps;
		this.key = key;
		this.stateNode = null;
		this.type = null;

		this.return = null;
		this.child = null;
		this.sibling = null;
		this.index = 0;

		this.ref = null;
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.alternate = null;

		this.flags = NoFlags;
		this.updateQueue = null;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;

		this.container = container;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		// 清除之前的副作用
		wip.flags = NoFlags;
	}

	wip.type = current.type;
	wip.updateQueue = current.updateQueue;

	return wip;
};
