import { Container, appendChildToContainer } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	while (nextEffect !== null) {
		const child: FiberNode | null = nextEffect.child;

		if ((nextEffect.flags & MutationMask) !== NoFlags && child) {
			nextEffect = child;
		} else {
			// label
			up: while (nextEffect !== null) {
				const sibling: FiberNode | null = nextEffect.sibling;

				commitMutationEffectsOnFiber(nextEffect);

				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
	const flags = finishedWork.flags;

	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}

	// if ((flags & Update) !== NoFlags) {
	// commitWork(finishedWork);
	// }
}

function commitPlacement(finishedWork: FiberNode) {
	const hostParent = getHostParent(finishedWork);
	if (hostParent) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
}

function getHostParent(fiber: FiberNode): Container | null {
	// 从当前节点开始，向上遍历，直到找到一个有 DOM 节点的父节点
	let parent = fiber.return;
	while (parent) {
		const parentTag = parent.tag;
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		} else if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		} else {
			parent = parent.return;
		}
	}
	return null;
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(finishedWork.stateNode, hostParent);
		return;
	}

	let child = finishedWork.child;

	if (child !== null) {
		appendChildToContainer(hostParent, child.stateNode);
		let sibling = child.sibling;
		while (sibling !== null) {
			appendChildToContainer(hostParent, sibling.stateNode);
			sibling = sibling.sibling;
		}
	}
}
