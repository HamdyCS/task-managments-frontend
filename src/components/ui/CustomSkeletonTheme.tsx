import { SkeletonTheme } from "react-loading-skeleton";
import { useAppSelector } from "../../store/hooks";

const SKELETON_COLORS = {
  light: {
    base: "#e5e5ea",
    highlight: "#f4f4f6",
  },
  dark: {
    base: "#26262c",
    highlight: "#36363f",
  },
} as const;

interface CustomSkeletonThemeProps {
  children: React.ReactNode;
}

export default function CustomSkeletonTheme({
  children,
}: CustomSkeletonThemeProps) {
  const theme = useAppSelector((state) => state.theme);
  const colors = SKELETON_COLORS[theme];

  return (
    <SkeletonTheme baseColor={colors.base} highlightColor={colors.highlight}>
      {children}
    </SkeletonTheme>
  );
}
