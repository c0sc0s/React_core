import { Container } from "hostConfig";
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from "./updateQueue";
import { ReactElementType } from "shared/ReactTypes";
import { FiberNode, FiberRootNode } from "./fiber";
import { scheduleUpdateOnFiber } from "./workLoop";
import { HostRoot } from "./workTags";

export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, null, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
