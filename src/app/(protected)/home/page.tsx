"use client";

import { useQuery } from "@apollo/client";
import { useRef, useState, useCallback, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	DndContext,
	MouseSensor,
	TouchSensor,
	KeyboardSensor,
	useSensor,
	useSensors,
	closestCenter,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { GET_CONTENT_NODES } from "~/lib/graphql/queries/get-content-nodes";
import { LoadingSpinner } from "~/lib/components/spinners/loading-spinnter";

interface ContentNode {
	node: {
		structureDefinition: {
			title: string;
		};
	};
}

interface SortableNodeProps {
	title: string;
	id: number;
	style: React.CSSProperties;
}

const SortableNode: React.FC<SortableNodeProps> = ({ title, id, style }) => {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const dynamicStyle: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		...style,
	};

	return (
		<div
			ref={setNodeRef}
			style={dynamicStyle}
			className={`p-4 bg-white rounded-lg shadow-sm mb-4 flex items-center justify-between border border-gray-200 hover:shadow-md transition-all duration-200 ${
				isDragging ? "opacity-70 shadow-lg" : "opacity-100"
			}`}
		>
			<div
				className="text-gray-800 font-medium leading-tight truncate flex-1 mr-4"
				title={title}
			>
				{title}
			</div>
			<button
				{...attributes}
				{...listeners}
				className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
				aria-label="Drag Handle"
			>
				<GripVertical className="h-5 w-5 text-gray-400" />
			</button>
		</div>
	);
};

export default function HomePage() {
	const parentRef = useRef<HTMLDivElement>(null);
	const [nodes, setNodes] = useState<ContentNode[]>([]);
	const [cursor, setCursor] = useState<string | null>(null);
	const [hasNextPage, setHasNextPage] = useState<boolean>(true);

	const { loading, data, fetchMore } = useQuery(GET_CONTENT_NODES, {
		variables: { cursor },
		onCompleted: (response) => {
			const newNodes = response.Admin.Tree.GetContentNodes.edges;
			setNodes((prev) => [...prev, ...newNodes]);
			setCursor(response.Admin.Tree.GetContentNodes.pageInfo.endCursor);
			setHasNextPage(response.Admin.Tree.GetContentNodes.pageInfo.hasNextPage);
		},
	});

	const rowVirtualizer = useVirtualizer({
		count: nodes.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 72,
		overscan: 5,
	});

	const handleLazyLoad = useCallback(async () => {
		if (hasNextPage) {
			await fetchMore({
				variables: { cursor },
			});
		}
	}, [hasNextPage, fetchMore, cursor]);

	useEffect(() => {
		const virtualizer = rowVirtualizer;
		const onScroll = () => {
			const lastItemIndex = virtualizer.getVirtualItems().pop()?.index || 0;

			if (lastItemIndex >= nodes.length - 1 && hasNextPage) {
				handleLazyLoad();
			}
		};

		const scroller = parentRef.current;
		if (scroller) scroller.addEventListener("scroll", onScroll);
		return () => {
			if (scroller) scroller.removeEventListener("scroll", onScroll);
		};
	}, [rowVirtualizer, nodes.length, handleLazyLoad, hasNextPage]);

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor),
	);

	const moveNode = useCallback((dragIndex: number, hoverIndex: number) => {
		setNodes((prevNodes) => arrayMove(prevNodes, dragIndex, hoverIndex));
	}, []);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (over) {
			const oldIndex = active.id as number;
			const newIndex = over.id as number;
			if (oldIndex !== newIndex) {
				moveNode(oldIndex, newIndex);
			}
		}
	};

	if (loading && !nodes.length) {
		return <LoadingSpinner />;
	}

	if (!loading && nodes.length === 0) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-md">
					<h2 className="text-2xl font-semibold mb-2">
						No Content Nodes Found!
					</h2>
				</div>
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<div className="max-w-4xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">Content Nodes</h1>
				<div
					ref={parentRef}
					className="h-[calc(100vh-180px)] overflow-auto rounded-xl border border-gray-200 bg-gray-50 shadow-inner"
				>
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						<SortableContext
							items={nodes.map((_, index) => index)}
							strategy={verticalListSortingStrategy}
						>
							{rowVirtualizer.getVirtualItems().map((virtualItem) => {
								const node = nodes[virtualItem.index];
								const title =
									node.node.structureDefinition.title ||
									`Node ${virtualItem.index + 1}`;

								return (
									<div
										key={virtualItem.index}
										data-index={virtualItem.index}
										className="absolute top-0 left-0 w-full px-4"
										style={{
											height: `${virtualItem.size}px`,
											transform: `translateY(${virtualItem.start}px)`,
										}}
									>
										<SortableNode
											id={virtualItem.index}
											title={title}
											style={{ height: `${virtualItem.size}px` }}
										/>
									</div>
								);
							})}
						</SortableContext>
					</div>
				</div>
			</div>
		</DndContext>
	);
}
