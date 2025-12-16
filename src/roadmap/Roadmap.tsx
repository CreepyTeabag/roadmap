import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { useEffect, useMemo, useState } from "react";
import type { CoordinateExtent, Edge, Node } from "reactflow";
import ReactFlow, {
  Controls,
  MarkerType,
  MiniMap,
  Position,
  getNodesBounds,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import type { ImportanceLevel, NodeInfo, TreeNode } from "./Roadmap.d";
import { Sidebar } from "./components/Sidebar";
// import { mockDifficultRoadmap } from "./mockData";
import { mockDifficultRoadmap, mockSimpleRoadmap } from "./mockData";
import { edgeStyleByImportance, nodeStyleByImportance } from "./styles";

// const mockData = mockDifficultRoadmap;
const mockData = mockSimpleRoadmap;

// Dagre layout setup
const nodeWidth = 180;
const nodeHeight = 60;
const childWidth = 140;
const childHeight = 48;
const groupPadding = 16;
const childGap = 12;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
// dagreGraph.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 100 });
dagreGraph.setGraph({ rankdir: "LR", nodesep: 50, ranksep: 100 });

// === новая функция layout ===
function getLayoutedElements(
  data: TreeNode,
  setNode: (node?: { label: string; importanceLevel: ImportanceLevel }) => void
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Создаём свежий dagre graph каждый раз
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  // отступы между нодами
  // g.setGraph({ rankdir: "TB", nodesep: 120, ranksep: 60 });
  g.setGraph({ rankdir: "LR", nodesep: 120, ranksep: 60 });

  function traverse(node: TreeNode, parentId?: string) {
    const isGroup = node.type === "group";

    if (isGroup) {
      const children = node.children ?? [];
      const childCount = children.length;

      // решаем количество колонок/строк для внутренних элементов (простая сетка)
      const cols = Math.min(childCount, Math.ceil(Math.sqrt(childCount) || 1));
      const rows = Math.max(1, Math.ceil(childCount / cols));

      const groupW =
        Math.max(
          nodeWidth,
          groupPadding * 2 + cols * childWidth + (cols - 1) * childGap
        ) | 0;
      const groupH =
        (Math.max(
          nodeHeight,
          groupPadding * 2 + rows * childHeight + (rows - 1) * childGap
        ) +
          12) |
        0;

      // контейнер (group) — top-level node, попадает в dagre
      nodes.push({
        id: node.id,
        data: {
          label: (
            <div style={{ fontWeight: "600", textAlign: "center" }}>
              {node.label}
            </div>
          ),
        },
        position: { x: 0, y: 0 }, // dagre установит
        style: {
          width: groupW,
          height: groupH,
          border: "2px dashed #999",
          background: "#f4f9ff",
          borderRadius: 10,
          padding: 6,
        },
        // sourcePosition: Position.Bottom,
        // targetPosition: Position.Top,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      // ребро от parent -> group (dagre)
      if (parentId) {
        console.log(node);
        edges.push({
          id: `${parentId}-${node.id}`,
          source: parentId,
          target: node.id,
          animated: true,
          ...edgeStyleByImportance(node.importanceLevel),
        });
      }

      // дочерние ноды — НЕ добавляем в dagre, но они должны быть в nodes[]
      children.forEach((child, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);

        const childX = groupPadding + col * (childWidth + childGap);
        const childY = groupPadding + row * (childHeight + childGap) + 16;

        nodes.push({
          id: child.id,
          data: {
            label: (
              <div
                style={{
                  textAlign: "center",
                  color: nodeStyleByImportance(child.importanceLevel).color,
                  fontWeight: 600,
                  cursor: "pointer",
                  height: "100%",
                }}
                onClick={() => {
                  if (child.importanceLevel === "group") {
                    setNode(undefined);
                    return;
                  }

                  setNode({
                    label: child.label,
                    importanceLevel: child.importanceLevel,
                  });
                }}
              >
                {child.label}
              </div>
            ),
          },
          // позиция — относительная к parentNode (extent: 'parent')
          position: { x: childX, y: childY },
          parentNode: node.id,
          extent: "parent",
          style: {
            width: childWidth,
            height: childHeight,
            borderRadius: 8,
            padding: 6,
            ...nodeStyleByImportance(child.importanceLevel),
          },
          // sourcePosition: Position.Bottom,
          // targetPosition: Position.Top,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        });
      });

      // не рекурсируем по детям в dagre — они уже обработаны
      return;
    }

    // обычная (top-level) нода
    nodes.push({
      id: node.id,
      data: {
        label: (
          <div
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              textAlign: "center",
              cursor: "pointer",
              padding: 10,
              borderRadius: 10,
              width: "100%",
              height: "100%",
              color: nodeStyleByImportance(node.importanceLevel).color,
            }}
            onClick={() => {
              if (node.importanceLevel === "group") {
                setNode(undefined);
                return;
              }

              setNode({
                label: node.label,
                importanceLevel: node.importanceLevel,
              });
            }}
          >
            {node.label}
          </div>
        ),
      },
      position: { x: 0, y: 0 }, // dagre установит
      style: {
        ...nodeStyleByImportance(node.importanceLevel),
        width: nodeWidth,
        height: nodeHeight,
        padding: 0,
        borderRadius: 10,
      },
      // sourcePosition: Position.Bottom,
      // targetPosition: Position.Top,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        animated: true,
        ...edgeStyleByImportance(node.importanceLevel),
      });
    }

    edges.push({
      id: `${"a1"}-${"step-2"}`,
      source: "a1",
      target: "step-2",
      animated: true,

      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 9,
        height: 9,
        color: "#16B9BE",
      },
      style: {
        strokeWidth: 2,
        stroke: "#16B9BE",
      },
    });

    node.children?.forEach((child) => traverse(child, node.id));
  }

  // построим полное дерево (nodes[] и edges[])
  traverse(data);

  // dagre должен получать только топ-левел ноды (без parentNode)
  const topLevelNodes = nodes.filter((n) => !("parentNode" in n));
  const topLevelIds = new Set(topLevelNodes.map((n) => n.id));

  topLevelNodes.forEach((n) => {
    const width =
      (n.style && (n.style as React.CSSProperties).width) ?? nodeWidth;
    const height =
      (n.style && (n.style as React.CSSProperties).height) ?? nodeHeight;
    g.setNode(n.id, { width: Number(width), height: Number(height) });
  });

  // добавляем в dagre только те рёбрa, у которых source и target — top-level
  edges.forEach((e) => {
    if (topLevelIds.has(e.source) && topLevelIds.has(e.target)) {
      g.setEdge(e.source, e.target);
    }
  });

  // layout
  dagre.layout(g);

  // записываем позиции только для топ-левел нод (дети остаются относительными)
  nodes.forEach((node) => {
    if (!("parentNode" in node)) {
      const dnode = g.node(node.id);
      if (dnode) {
        const w =
          (node.style && (node.style as React.CSSProperties).width) ??
          nodeWidth;
        const h =
          (node.style && (node.style as React.CSSProperties).height) ??
          nodeHeight;
        node.position = {
          x: dnode.x - Number(w) / 2,
          y: dnode.y - Number(h) / 2,
        };
      }
    }
  });

  return { nodes, edges };
}

export function Roadmap() {
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | undefined>();
  const [{ nodes: initialNodes, edges: initialEdges }] = useState(() =>
    // getLayoutedElements(mockData, setNodeInfo)
    getLayoutedElements(mockDifficultRoadmap, setNodeInfo)
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    // You can rerun layout on backend data change
    // const { nodes, edges } = getLayoutedElements(mockData, setNodeInfo);
    const { nodes, edges } = getLayoutedElements(
      mockDifficultRoadmap,
      setNodeInfo
    );
    setNodes(nodes);
    setEdges(edges);
  }, []);

  const translateExtent: CoordinateExtent = useMemo(() => {
    const bounds = getNodesBounds(nodes);
    return [
      [bounds.x, bounds.y],
      [bounds.x + bounds.width, bounds.y + bounds.height],
    ];
  }, [nodes]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",

        outline: "1px solid grey",
        cursor: "default",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        translateExtent={translateExtent}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        // zoomOnScroll={false}
        zoomOnScroll={true}
        // zoomOnPinch={false}
        zoomOnPinch={true}
        panOnDrag
        // panOnScroll
        style={{ backgroundColor: "#d7f2ff" }}
      >
        {/* <Background /> */}
        <Controls />
        <MiniMap />
      </ReactFlow>
      {nodeInfo && (
        <Sidebar
          importance={nodeInfo.importanceLevel}
          label={nodeInfo.label}
          onClose={() => setNodeInfo(undefined)}
        />
      )}
    </div>
  );
}
