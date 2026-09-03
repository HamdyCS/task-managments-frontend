import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations";
import type WorkSpaceUserDto from "../../../../dtos/workspace/WorkSpaceUserDto";

interface Props {
  members: WorkSpaceUserDto[];
  effectiveMemberId: string | null;
  onSelect: (memberId: string) => void;
}

export default function MemberSelector({
  members,
  effectiveMemberId,
  onSelect,
}: Props) {
  const { t } = useTranslation();

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        {t("dashboard.reports.selectMember")}
      </label>
      <select
        value={effectiveMemberId ?? ""}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full sm:w-auto bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
      >
        {members.map((member) => (
          <option key={member.userId} value={member.userId}>
            {member.fullName}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
