import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { FiSave, FiUser } from "react-icons/fi";
import useCurrentUser from "../../hooks/auth/useCurrentUser";
import useUpdateProfile from "../../hooks/auth/useUpdateProfile";

export default function PersonalInformationSection() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();

  const updateProfileMutation = useUpdateProfile({
    onSuccess: () => {
      toast.success(t("dashboard.accountSettings.personalInfo.success"));
    },
    onError: () => {
      toast.error(t("dashboard.accountSettings.personalInfo.error"));
    },
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string().required(
        t("dashboard.accountSettings.validation.firstNameRequired"),
      ),
      lastName: Yup.string().required(
        t("dashboard.accountSettings.validation.lastNameRequired"),
      ),
      dateOfBirth: Yup.string()
        .required(
          t("dashboard.accountSettings.validation.dateOfBirthRequired"),
        )
        .test(
          "age",
          t("dashboard.accountSettings.validation.ageMinimum"),
          (value) => {
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
              age--;
            }
            return age >= 18;
          },
        ),
    }),
    onSubmit: (values) => {
      updateProfileMutation.mutateAsync(values);
    },
  });

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiUser className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {t("dashboard.accountSettings.personalInfo.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.accountSettings.personalInfo.description")}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              {t("dashboard.accountSettings.personalInfo.firstName")}
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              className="w-full px-3.5 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-1.5 text-xs text-destructive">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              {t("dashboard.accountSettings.personalInfo.lastName")}
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              className="w-full px-3.5 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-1.5 text-xs text-destructive">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("dashboard.accountSettings.personalInfo.dateOfBirth")}
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dateOfBirth}
            className="w-full px-3.5 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <p className="mt-1.5 text-xs text-destructive">
              {formik.errors.dateOfBirth}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProfileMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <FiSave className="w-4 h-4" />
            )}
            {t("dashboard.accountSettings.personalInfo.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
