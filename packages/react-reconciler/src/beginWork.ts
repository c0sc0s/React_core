import { mountChildFibers, reconcileChildFibers } from "./childFibers";
import { FiberNode, FiberRootNode } from "./fiber";
import { processUpdateQueue } from "./updateQueue";
import { HostComponent, HostRoot, HostText } from "./workTags";

/**
 * beginWork 会根据 wip.tag 调用不同的 update 方法
 * 返回 wip 的 child
 * @param wip
 * @returns wip.child
 */
export const beginWork = (wip: FiberNode) => {
	const { tag } = wip;

	switch (tag) {
		case HostComponent:
			return updateHostComponent(wip);
		case HostRoot:
			return updateHostRoot(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.error("unknow fiber tag");
			}
			return null;
	}
};

/**
 * updateHostRoot 先 更新 rootFiber.memoizedState 为 <App/>
 * 然后调用 reconcileChildren 生成 <App/> 的 childFiber
 *
 * @param wip
 * @returns rootFiber.child
 */
function updateHostRoot(wip: FiberNode) {
	// mount阶段，baseState 显然为 null
	const baseState = wip.memoizedState;

	const updateQueue = wip.updateQueue as any;
	const pengding = updateQueue.shared.pending;
	updateQueue.shared.pending = null;

	// 此处消费 在 UpdateContainer 中 enqueueUpdate 的 action, 也就是 render() 的参数 <App/>
	const { memoizedState } = processUpdateQueue(baseState, pengding);

	// 在 processUpdateQueue(baseState,pending) 后， wip.momoizedState 为 <App/>
	wip.memoizedState = memoizedState;

	// nextChildren 为 <App/>
	const nextChildren = wip.memoizedState;

	// reconcileChildren 会对比 currentFiberNode 和  reactElement 生成 新的 Fiber
	// 所以说，这行才是核心嘛
	reconcileChildren(wip, nextChildren);

	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;

	const nextChildren = nextProps.children;

	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, nextChildren: any) {
	// 对比 currentFiberNode 和  reactElement 生成 新的 Fiber

	// 注意！
	// rootFiber 的 alternate 在mount阶段不为null(prepareFreshStack中处理了)
	// 因此，会调用 reconcileChildFibers 而不是 mountChildFibers
	// 所以, rootFiber 上追踪了 Effects

	const current = wip.alternate;

	// 这里主要是优化 mount 阶段, 除了 rootFiber 以外的 FiberNode 的 alternate 都为 null
	// 这样，最终只需要把构建好的完整的 domTree PlaceMent 一次即可
	if (current === null) {
		wip.child = mountChildFibers(wip, null, nextChildren);
	} else {
		wip.child = reconcileChildFibers(wip, current, nextChildren);
	}
}
