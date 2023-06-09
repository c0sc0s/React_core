import { Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";
import { createUpdate, createUpdateQueue, enqueueUpdate } from "./updateQueue";
import { ReactElementType } from "shared/ReactTypes";
import { scheduleUpdateOnFiber } from "./workLoop";

export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);

	const root = new FiberRootNode(container, hostRootFiber);

	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;

	// mount阶段，element作为 Update 的 action
	const update = createUpdate<ReactElementType | null>(element);

	enqueueUpdate(update, hostRootFiber.updateQueue!);

	scheduleUpdateOnFiber(hostRootFiber);

	return element;
}
