import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../animations";
import { useAllUsers } from "../../hooks/admin/useAdminUsers";
import UsersPageHeader from "../../components/Dashboard/users/UsersPageHeader";
import AdminsSection from "../../components/Dashboard/users/AdminsSection";
import UsersSection from "../../components/Dashboard/users/UsersSection";
import RegisterAdminModal from "../../components/Dashboard/users/RegisterAdminModal";
import UsersSkeleton from "../../components/Dashboard/users/UsersSkeleton";

export default function AdminUsersPage() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const {
    admins,
    regularUsers,
    allUsers,
    isLoading,
    isLoadingMore,
    hasNextPage,
    fetchNextPage,
  } = useAllUsers();

  if (isLoading) {
    return <UsersSkeleton />;
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-6"
    >
      <UsersPageHeader
        onRegisterAdminClick={() => setRegisterModalOpen(true)}
      />

      <AdminsSection
        users={admins}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasNextPage={hasNextPage ?? false}
        onLoadMore={fetchNextPage}
      />

      <UsersSection
        regularUsers={regularUsers}
        allUsers={allUsers}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasNextPage={hasNextPage ?? false}
        onLoadMore={fetchNextPage}
      />

      <RegisterAdminModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </motion.div>
  );
}
