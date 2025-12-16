import React, { useMemo, useState } from "react";
import ReactFlow, {
  Controls,
  Position,
  type Node as RFNode,
  type Edge as RFEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Handle,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import type { Card, NewTree } from "./Roadmap.d";
import { mockNewData } from "./mockData";
import { Sidebar } from "./components/Sidebar";

/* ---------- layout configuration ---------- */
const NODE_W = 180;
const NODE_H = 60;

const dagreGraphFactory = () => {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR", // top -> bottom (root on top)
    nodesep: 80, // horizontal spacing between siblings (chapters)
    ranksep: 80, // vertical spacing between levels
  });
  return g;
};

/* simple style helpers */
const chapterStyle: React.CSSProperties = {
  width: NODE_W,
  height: NODE_H,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  background: "#007acc",
};
const rootStyle: React.CSSProperties = {
  width: NODE_W,
  height: NODE_H,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  background: "#222",
};
const levelStyle = (level: Card["level"]): React.CSSProperties =>
  level === "essential"
    ? { background: "#d9534f", color: "#fff" }
    : level === "common"
    ? { background: "#5bc0de", color: "#fff" }
    : { background: "#5cb85c", color: "#fff" };

/* ---------- function that builds nodes & edges and runs dagre ---------- */
function getLayoutedElements(
  tree: NewTree,
  setNodeInfo: (node?: Card) => void
) {
  const g = dagreGraphFactory();

  const nodes: RFNode[] = [];
  const edges: RFEdge[] = [];

  // helper to register node both in array and dagre
  const addNode = (
    id: string,
    label: React.ReactNode,
    style: React.CSSProperties,
    options?: Partial<RFNode>
  ) => {
    nodes.push({
      id,
      data: { label },
      position: { x: 0, y: 0 }, // will be overwritten by dagre
      style,
      // sourcePosition: Position.Bottom,
      // targetPosition: Position.Top,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      ...options,
    });
    g.setNode(id, {
      width: (style.width as number) ?? NODE_W,
      height: (style.height as number) ?? NODE_H,
    });
  };

  const rootId = `root-${tree.id}`;
  addNode(
    rootId,
    <div style={{ fontWeight: 700 }}>
      {tree.name}

      <Handle
        type="source"
        position={Position.Bottom}
        id="root-bottom-handle"
      />
    </div>,
    {
      ...rootStyle,
      width: NODE_W,
      height: NODE_H,
    }
  );

  // build chapters & card chains
  tree.chapter.forEach((chapter, ci) => {
    const chapterId = `chapter-${tree.id}-${ci}`; // ensure uniqueness
    addNode(
      chapterId,
      <div style={{ fontWeight: 600 }}>
        {chapter.name}
        <Handle type="source" position={Position.Left} id="left-handle" />
        <Handle type="source" position={Position.Right} id="right-handle" />
        <Handle type="target" position={Position.Top} id="top-handle" />
        <Handle type="source" position={Position.Bottom} id="bottom-handle" />
      </div>,
      {
        ...chapterStyle,
        width: NODE_W,
        height: NODE_H,
      }
    );

    // edge root -> chapter
    // if (ci !== 0) {
    //   edges.push({
    //     id: `${rootId}->${chapterId}`,
    //     source: rootId,
    //     target: chapterId,
    //     sourceHandle: "root-bottom-handle",
    //     targetHandle: "top-handle",
    //   });
    // }

    // now create linear chain of cards below this chapter
    const prev = chapterId;
    chapter.cards.forEach((card, idx) => {
      // create unique id combining chapter index + card id to avoid collisions across chapters
      const cardId = `card-${tree.id}-${ci}-${card.id}-${idx}`;
      addNode(
        cardId,
        <div style={{ fontWeight: 600 }} onClick={() => setNodeInfo(card)}>
          {card.title}
        </div>,
        {
          width: NODE_W,
          height: NODE_H,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...levelStyle(card.level),
        },
        {
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        }
      );

      edges.push({
        id: `${prev}->${cardId}`,
        source: prev,
        target: cardId,
        sourceHandle: "right-handle",
        targetHandle: "left-handle",
      });
      // prev = cardId;

      if (card?.cards) {
        card.cards.forEach((subcard, index) => {
          const isGroup = subcard?.type === "group";
          const groupPadding = 32;
          const childWidth = 180;
          const childHeight = 48;
          const childGap = 24;
          if (isGroup) {
            const children = subcard.cards ?? [];
            const childCount = children.length;

            // решаем количество колонок/строк для внутренних элементов (простая сетка)
            const cols = Math.min(
              childCount,
              Math.ceil(Math.sqrt(childCount) || 1)
            );
            const rows = Math.max(1, Math.ceil(childCount / cols));

            const groupW =
              Math.max(
                NODE_W,
                groupPadding * 2 + cols * childWidth + (cols - 1) * childGap
              ) | 0;
            const groupH =
              (Math.max(
                NODE_H,
                groupPadding * 2 + rows * childHeight + (rows - 1) * childGap
              ) +
                12) |
              0;
            const groupId = `group-${tree.id}-${ci}-${subcard.id}-${index}`;

            addNode(
              groupId,
              <div
                style={{ fontWeight: 600 }}
                onClick={() => setNodeInfo(subcard)}
              >
                {/* {subcard.title} */}
                <Handle
                  type="source"
                  position={Position.Left}
                  id="left-handle"
                />
                <Handle
                  type="target"
                  position={Position.Right}
                  id="right-handle"
                />
              </div>,
              {
                width: groupW,
                height: groupH,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#cecece",
                color: "#000",
              },
              {
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
              }
            );

            // ребро от parent -> group (dagre)
            if (cardId) {
              edges.push({
                id: `${cardId}-${groupId}`,
                source: cardId,
                target: groupId,
                animated: true,
              });
            }

            // дочерние ноды — НЕ добавляем в dagre, но они должны быть в nodes[]
            children.forEach((child, i) => {
              const col = i % cols;
              const row = Math.floor(i / cols);

              const childX = groupPadding + col * (childWidth + childGap);
              const childY = groupPadding + row * (childHeight + childGap) + 16;

              const childId = `group-child-${child.id}-${i}`;
              addNode(
                childId,
                <div
                  style={{ fontWeight: 600 }}
                  onClick={() => setNodeInfo(child)}
                >
                  {child.title}
                  <Handle
                    type="source"
                    position={Position.Left}
                    id="left-handle"
                  />
                  <Handle
                    type="target"
                    position={Position.Right}
                    id="right-handle"
                  />
                </div>,
                {
                  width: NODE_W,
                  height: NODE_H,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...levelStyle(child.level),
                },
                {
                  position: { x: childX, y: childY },
                  parentId: groupId,
                  extent: "parent",
                  sourcePosition: Position.Left,
                  targetPosition: Position.Right,
                }
              );
            });
          } else {
            const subCardId = `subcard-${tree.id}-${ci}-${subcard.id}-${index}`;
            addNode(
              subCardId,
              <div
                style={{ fontWeight: 600 }}
                onClick={() => setNodeInfo(subcard)}
              >
                {subcard.title}
              </div>,
              {
                width: NODE_W,
                height: NODE_H,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...levelStyle(subcard.level),
              },
              {
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
              }
            );

            edges.push({
              id: `${cardId}->${subCardId}`,
              source: cardId,
              target: subCardId,
              sourceHandle: "right-handle",
              targetHandle: "left-handle",
              animated: true,
            });
          }
        });
      }
    });
  });

  // register edges in dagre (only those whose endpoints are present)
  edges.forEach((e) => {
    if (g.hasNode(e.source) && g.hasNode(e.target)) {
      g.setEdge(e.source, e.target);
    } else {
      // if an endpoint wasn't registered, we log to help debugging
      // (should not happen with this code)
      // console.warn("Edge skipped for dagre, missing node:", e);
    }
  });

  tree.chapter.forEach((_, ci) => {
    const chapterId = `chapter-${tree.id}-${ci}`;
    const prev = `chapter-${tree.id}-${ci - 1}`;
    if (ci === 0) return;

    edges.push({
      id: `${prev}->${chapterId}`,
      source: prev,
      target: chapterId,
      sourceHandle: "bottom-handle",
      targetHandle: "top-handle",
      animated: true,
    });
  });

  // run dagre layout
  dagre.layout(g);

  // read dagre-calculated positions and apply them to nodes array
  nodes.forEach((n) => {
    if (!("parentId" in n)) {
      const dnode = g.node(n.id);
      if (dnode) {
        const w = (n.style && (n.style as React.CSSProperties).width) ?? NODE_W;
        const h =
          (n.style && (n.style as React.CSSProperties).height) ?? NODE_H;
        n.position = { x: dnode.x - Number(w) / 2, y: dnode.y - Number(h) / 2 };
      } else {
        // defensive fallback: leave at 0,0 (rare)
        n.position = { x: 0, y: 0 };
        // console.warn("dagre position not found for", n.id);
      }
    }
  });

  return { nodes, edges };
}

/* ---------- React component ---------- */
export function Roadmap() {
  const [nodeInfo, setNodeInfo] = useState<Card | undefined>();
  const layouted = useMemo(
    () => getLayoutedElements(mockNewData, setNodeInfo),
    []
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges);

  console.log(setNodes, setEdges);

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag
      >
        <Controls />
        <MiniMap />
      </ReactFlow>
      {nodeInfo && (
        <Sidebar
          importance={nodeInfo.level}
          label={nodeInfo.title}
          onClose={() => setNodeInfo(undefined)}
        />
      )}
    </div>
  );
}
