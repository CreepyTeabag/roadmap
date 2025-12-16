import { MarkerType } from "reactflow";
import type { TreeNode } from "./Roadmap.d";

type Styles = {
  [key: string]: React.CSSProperties;
};

export const styles: Styles = {
  sidebarWrapper: {
    position: "fixed",
    right: 0,
    top: 0,
    height: "100%",
    width: "300px",
    zIndex: 5,
    color: "#edf7ff",
    padding: "20px",
  },
  sidebarButton: {
    display: "block",
    border: "1px solid black",
    marginTop: "20px",
  },
  groupImportanceNode: {
    padding: 13,
    backgroundColor: "#ffffff",
    color: "#000000 !important",
  },
  highImportanceNode: {
    padding: 13,
    backgroundColor: "#F59739",
    color: "white",
  },
  mediumImportanceNode: {
    backgroundColor: "#16B9BE",
    color: "white",
  },
  lowImportanceNode: {
    padding: 8,
    backgroundColor: "#7191FF",
    color: "white",
  },
};

export const edgeStyles = {
  groupImportanceEdge: {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 13,
      height: 13,
      color: "#FFFFFF",
    },
    style: {
      strokeWidth: 3,
      stroke: "#FFFFFF",
    },
  },
  highImportanceEdge: {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 13,
      height: 13,
      color: "#F59739",
    },
    style: {
      strokeWidth: 3,
      stroke: "#F59739",
    },
  },
  mediumImportanceEdge: {
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
  },
  lowImportanceEdge: {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 5,
      height: 5,
      color: "#7191FF",
    },
    style: {
      strokeWidth: 0.5,
      stroke: "#7191FF",
    },
  },
};

export const nodeStyleByImportance = (level: TreeNode["importanceLevel"]) => {
  if (level === "group") return styles.groupImportanceNode;
  if (level === "high") return styles.highImportanceNode;
  if (level === "medium") return styles.mediumImportanceNode;
  return styles.lowImportanceNode;
};
export const edgeStyleByImportance = (level: TreeNode["importanceLevel"]) => {
  if (level === "group") return edgeStyles.groupImportanceEdge;
  if (level === "high") return edgeStyles.highImportanceEdge;
  if (level === "medium") return edgeStyles.mediumImportanceEdge;
  return edgeStyles.lowImportanceEdge;
};
