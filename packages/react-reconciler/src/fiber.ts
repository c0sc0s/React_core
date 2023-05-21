import { Key, Props, Ref } from "shared/ReactTypes";
import { WorkTag } from "./workTags";

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
	}
}
