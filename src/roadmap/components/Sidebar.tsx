import { type FC } from "react";
import type { CardLevel, ImportanceLevel } from "../Roadmap.d";
import { styles } from "../styles";

interface Props {
  importance: ImportanceLevel | CardLevel;
  label: string;
  onClose: () => void;
}

export const Sidebar: FC<Props> = ({ importance, label, onClose }) => {
  const mainColor =
    importance === "high" || importance === "essential"
      ? "#F59739"
      : importance === "medium" || importance === "common"
      ? "#16B9BE"
      : "#7191FF";

  return (
    <div
      style={{
        ...styles.sidebarWrapper,
        backgroundColor: `${mainColor}cc`,
        borderLeft: `5px solid ${mainColor}`,
      }}
    >
      Информация про {label}
      <button onClick={onClose} style={styles.sidebarButton}>
        закрыть
      </button>
    </div>
  );
};
