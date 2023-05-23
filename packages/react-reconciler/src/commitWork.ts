import {
	Container,
	appendChildToContainer,
	commitUpdate,
	removeChild
} from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import {
	ChildDeletion,
	MutationMask,
	NoFlags,
	Placement,
	Update
} from "./fiberFlags";
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from "./workTags";

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

	if ((flags & Update) !== NoFlags) {
		commitUpdate(finishedWork);
		finishedWork.flags &= ~Update;
	}

	if ((flags & ChildDeletion) !== NoFlags) {
		const deletions = finishedWork.deletions;
		if (deletions !== null) {
			deletions.forEach((childToDeletion) => {
				commitDeletion(childToDeletion);
			});
		}

		finishedWork.flags &= ~ChildDeletion;
	}
}

function commitPlacement(finishedWork: FiberNode) {
	const hostParent = getHostParent(finishedWork);
	if (hostParent) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
}

function commitDeletion(childToDelete: FiberNode) {
	let rootHostNode: FiberNode | null = null;

	commitNestedComponent(childToDelete, (unmountFiber: FiberNode) => {
		switch (unmountFiber.tag) {
			case HostComponent:
				if (rootHostNode === null) {
					rootHostNode = unmountFiber;
				}
				// TODO: 解绑ref
				return;
			case HostText:
				if (rootHostNode === null) {
					rootHostNode = unmountFiber;
				}
				return;
			case FunctionComponent:
				// TODO unmount
				return;
			default:
				if (__DEV__) {
					console.error("unknow fiber tag");
				}
				return;
		}
	});

	if (rootHostNode !== null) {
		const hostParent = getHostParent(childToDelete);
		if (hostParent) {
			removeChild(rootHostNode, hostParent);
		}
	}
	childToDelete.return = null;
	childToDelete.child = null;

	// 移除 DOM 节点

	function commitNestedComponent(
		root: FiberNode,
		onCommitUnmount: (fiber: FiberNode) => void
	) {
		let node = root;
		while (true) {
			onCommitUnmount(node);
			if (node.child !== null) {
				//todo: 这一行代码的必要性在哪？
				node.child.return = node;
				node = node.child;
				continue;
			}

			if (node === root) return;

			while (node.sibling === null) {
				if (node.return === null || node.return === root) {
					return;
				}
				node = node.return;
			}

			// todo: 这一行代码的必要性在哪？
			node.sibling.return = node.return;
			node = node.sibling;
		}
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
