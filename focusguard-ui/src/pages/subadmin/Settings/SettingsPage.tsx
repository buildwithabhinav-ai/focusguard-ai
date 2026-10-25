import AppLayout from "../../../layouts/AppLayout";

import {
  User,
  Mail,
  Briefcase,
  Calendar,
  ShieldCheck,
} from "lucide-react";

import Card from "../../../components/common/Card";
import Skeleton from "../../../components/common/Skeleton";

import { useCurrentUser } from "../../../hooks/useAuth";
import ChangePassword from "../../../components/common/ChangePassword";
import SupportCard from "../../../components/common/SupportCard";

import { useTranslation } from "../../../hooks/useTranslation";


const SettingsPage = () => {

  const {
    data,
    isLoading,
  } = useCurrentUser();


  // =========================================================
  // TRANSLATIONS
  // =========================================================

  const settingsText = useTranslation("Settings");

  const settingsDescriptionText = useTranslation(
    "Manage your account information"
  );

  const profileInformationText = useTranslation(
    "Profile Information"
  );

  const accountDetailsText = useTranslation(
    "Your account details"
  );

  const fullNameText = useTranslation(
    "Full Name"
  );

  const emailText = useTranslation(
    "Email"
  );

  const ageText = useTranslation(
    "Age"
  );

  const occupationText = useTranslation(
    "Occupation"
  );

  const notProvidedText = useTranslation(
    "Not provided"
  );

  const accountText = useTranslation(
    "Account"
  );

  const accessLevelText = useTranslation(
    "Your access level"
  );

  const roleTextLabel = useTranslation(
    "Role"
  );

  const accountDescriptionText = useTranslation(
    "You can manage and monitor users belonging to your organization while accessing your own productivity analytics."
  );


  // =========================================================
  // ROLE TRANSLATION
  // =========================================================

  const roleSource = data?.role
    ? data.role
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character: string) =>
          character.toUpperCase()
        )
    : "Sub Admin";

  const translatedRoleText = useTranslation(
    roleSource
  );


  // =========================================================
  // LOADING STATE
  // =========================================================

  if (isLoading) {

    return (
      <AppLayout>

        <div className="mb-6 sm:mb-8">

          <Skeleton
            className="
              h-8
              w-40
            "
          />

          <Skeleton
            className="
              mt-2
              h-4
              w-full
              max-w-xs

              sm:w-72
            "
          />

        </div>


        <div
          className="
            grid
            w-full
            min-w-0
            gap-5

            sm:gap-6

            xl:grid-cols-3
          "
        >

          <Card
            className="
              min-w-0
              xl:col-span-2
            "
          >

            <Skeleton className="h-6 w-40" />

            <Skeleton
              className="
                mt-6
                h-12
                w-full
              "
            />

            <Skeleton
              className="
                mt-4
                h-12
                w-full
              "
            />

            <Skeleton
              className="
                mt-4
                h-12
                w-full
              "
            />

          </Card>


          <Card className="min-w-0">

            <Skeleton
              className="
                h-6
                w-32
              "
            />

            <Skeleton
              className="
                mt-6
                h-20
                w-20
                rounded-full
              "
            />

            <Skeleton
              className="
                mt-4
                h-4
                w-32
              "
            />

          </Card>

        </div>

      </AppLayout>
    );
  }


  // =========================================================
  // SETTINGS PAGE
  // =========================================================

  return (
    <AppLayout>

      {/* Header */}

      <div className="mb-6 sm:mb-8">

        <h1
          className="
            text-2xl
            font-bold
            text-slate-900
            dark:text-white

            sm:text-3xl
          "
        >
          {settingsText}
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {settingsDescriptionText}
        </p>

      </div>


      {/* Main Settings */}

      <div
        className="
          grid
          w-full
          min-w-0
          gap-5

          sm:gap-6

          xl:grid-cols-3
        "
      >

        {/* Profile Information */}

        <Card
          className="
            min-w-0
            xl:col-span-2
          "
        >

          <div
            className="
              mb-6
              flex
              items-start
              gap-3
            "
          >

            <div
              className="
                shrink-0
                rounded-xl
                bg-indigo-100
                p-3

                dark:bg-indigo-950/50
              "
            >

              <User
                size={22}
                className="
                  text-indigo-600
                  dark:text-indigo-400
                "
              />

            </div>


            <div className="min-w-0">

              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {profileInformationText}
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {accountDetailsText}
              </p>

            </div>

          </div>


          <div
            className="
              grid
              min-w-0
              gap-4

              sm:gap-5

              md:grid-cols-2
            "
          >

            {/* Full Name */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                p-4

                dark:border-slate-700
              "
            >

              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >

                <User
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <div className="min-w-0">

                  <p
                    className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    {fullNameText}
                  </p>

                  <p
                    className="
                      mt-1
                      break-words
                      font-medium
                      text-slate-800
                      dark:text-slate-100
                    "
                  >
                    {data?.full_name || notProvidedText}
                  </p>

                </div>

              </div>

            </div>


            {/* Email */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                p-4

                dark:border-slate-700
              "
            >

              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >

                <Mail
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <div className="min-w-0">

                  <p
                    className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    {emailText}
                  </p>

                  <p
                    className="
                      mt-1
                      break-all
                      font-medium
                      text-slate-800
                      dark:text-slate-100
                    "
                  >
                    {data?.email || notProvidedText}
                  </p>

                </div>

              </div>

            </div>


            {/* Age */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                p-4

                dark:border-slate-700
              "
            >

              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >

                <Calendar
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <div className="min-w-0">

                  <p
                    className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    {ageText}
                  </p>

                  <p
                    className="
                      mt-1
                      font-medium
                      text-slate-800
                      dark:text-slate-100
                    "
                  >
                    {data?.age ?? notProvidedText}
                  </p>

                </div>

              </div>

            </div>


            {/* Occupation */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                p-4

                dark:border-slate-700
              "
            >

              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >

                <Briefcase
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <div className="min-w-0">

                  <p
                    className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    {occupationText}
                  </p>

                  <p
                    className="
                      mt-1
                      break-words
                      font-medium
                      text-slate-800
                      dark:text-slate-100
                    "
                  >
                    {data?.occupation || notProvidedText}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </Card>


        {/* Account Role */}

        <Card className="min-w-0">

          <div
            className="
              mb-6
              flex
              items-start
              gap-3
            "
          >

            <div
              className="
                shrink-0
                rounded-xl
                bg-green-100
                p-3

                dark:bg-green-950/50
              "
            >

              <ShieldCheck
                size={22}
                className="
                  text-green-600
                  dark:text-green-400
                "
              />

            </div>


            <div className="min-w-0">

              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {accountText}
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {accessLevelText}
              </p>

            </div>

          </div>


          <div
            className="
              rounded-2xl
              bg-green-50
              p-5

              dark:bg-green-950/30
            "
          >

            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-green-700
                dark:text-green-400
              "
            >
              {roleTextLabel}
            </p>

            <p
              className="
                mt-2
                break-words
                text-xl
                font-bold
                text-green-800
                dark:text-green-300
              "
            >
              {translatedRoleText}
            </p>

          </div>


          <div
            className="
              mt-5
              rounded-2xl
              border
              border-slate-200
              p-4

              dark:border-slate-700
            "
          >

            <p
              className="
                text-sm
                leading-6
                text-slate-600
                dark:text-slate-300
              "
            >
              {accountDescriptionText}
            </p>

          </div>

        </Card>

      </div>


      {/* Change Password */}

      <ChangePassword />

      <SupportCard />

    </AppLayout>
  );
};


export default SettingsPage;