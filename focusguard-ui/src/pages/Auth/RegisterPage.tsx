import { useState } from "react";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Calendar,
  UserPlus,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  useRegister,
} from "../../hooks/useAuth";


import { useTranslation } from "../../hooks/useTranslation";

const RegisterPage = () => {

  const navigate = useNavigate();

  const fillAllFieldsText = useTranslation(
    "Please fill in all fields."
  );

  const passwordLengthText = useTranslation(
    "Password must be at least 6 characters."
  );

  const passwordsMismatchText = useTranslation(
    "Passwords do not match."
  );

  const validAgeText = useTranslation(
    "Please enter a valid age."
  );

  const registrationSuccessText = useTranslation(
    "Registration successful."
  );

  const registrationFailedText = useTranslation(
    "Registration failed. Please try again."
  );

  const heroTitleText = useTranslation(
    "Build a more focused and productive organization."
  );

  const heroDescriptionText = useTranslation(
    "Create your FocusGuard account and start improving your focus, productivity and digital attention."
  );

  const organizationManagementText = useTranslation(
    "Organization management"
  );

  const productivityAnalyticsText = useTranslation(
    "Productivity analytics"
  );

  const aiRecommendationsText = useTranslation(
    "AI-powered recommendations"
  );

  const createYourAccountText = useTranslation(
    "Create Your Account"
  );

  const formDescriptionText = useTranslation(
    "Create your FocusGuard account and start your productivity journey."
  );

  const fullNameText = useTranslation(
    "Full Name"
  );

  const fullNamePlaceholder = useTranslation(
    "Enter your full name"
  );

  const emailText = useTranslation(
    "Email"
  );

  const emailPlaceholder = useTranslation(
    "Enter your email"
  );

  const ageText = useTranslation(
    "Age"
  );

  const agePlaceholder = useTranslation(
    "Age"
  );

  const occupationText = useTranslation(
    "Occupation"
  );

  const occupationPlaceholder = useTranslation(
    "Occupation"
  );

  const passwordText = useTranslation(
    "Password"
  );

  const passwordPlaceholder = useTranslation(
    "Create a password"
  );

  const confirmPasswordText = useTranslation(
    "Confirm Password"
  );

  const confirmPasswordPlaceholder = useTranslation(
    "Confirm your password"
  );

  const creatingAccountText = useTranslation(
    "Creating Account..."
  );

  const createAccountText = useTranslation(
    "Create Account"
  );

  const alreadyHaveAccountText = useTranslation(
    "Already have an account?"
  );

  const loginText = useTranslation(
    "Login"
  );

  const registerMutation =
    useRegister();


  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [age, setAge] =
    useState("");

  const [occupation, setOccupation] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();


    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !age ||
      !occupation.trim()
    ) {

      toast.error(
        fillAllFieldsText
      );

      return;
    }


    if (password.length < 6) {

      toast.error(
        passwordLengthText
      );

      return;
    }


    if (password !== confirmPassword) {

      toast.error(
        passwordsMismatchText
      );

      return;
    }


    const numericAge =
      Number(age);


    if (
      !Number.isInteger(numericAge) ||
      numericAge <= 0 ||
      numericAge > 120
    ) {

      toast.error(
        validAgeText
      );

      return;
    }


    try {

      const response =
        await registerMutation.mutateAsync({

          full_name:
            fullName.trim(),

          email:
            email.trim(),

          password,

          age:
            numericAge,

          occupation:
            occupation.trim(),

        });


      toast.success(
        response.message ??
        registrationSuccessText
      );


      setTimeout(() => {

        navigate("/login");

      }, 800);


    } catch (error: any) {

      const errorMessage =
        error?.response?.data?.detail ??
        registrationFailedText;

      toast.error(
        errorMessage
      );

    }

  };


  const inputClassName = `
    h-12
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    pl-11
    pr-4
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-indigo-500
    focus:ring-2
    focus:ring-indigo-100
    dark:border-slate-700
    dark:bg-slate-800
    dark:text-slate-100
    dark:placeholder:text-slate-500
    dark:focus:border-indigo-400
    dark:focus:ring-indigo-500/20
  `;


  const labelClassName = `
    mb-2
    block
    text-sm
    font-semibold
    text-slate-700
    dark:text-slate-300
  `;


  return (

    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">

      <div className="flex min-h-screen">


        {/* ================================= */}
        {/* Left Branding Section */}
        {/* ================================= */}

        <div className="hidden w-1/2 bg-indigo-600 lg:flex dark:bg-indigo-700">

          <div className="flex w-full flex-col justify-center px-16 text-white">

            <div className="mb-8 flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">

                <UserPlus
                  size={30}
                />

              </div>

              <h1 className="text-3xl font-bold">
                FocusGuard AI
              </h1>

            </div>


            <h2 className="max-w-xl text-5xl font-bold leading-tight">

              {heroTitleText}

            </h2>


            <p className="mt-6 max-w-lg text-lg leading-8 text-indigo-100">

              {heroDescriptionText}

            </p>


            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3">

                <div className="h-2 w-2 rounded-full bg-white" />

                {organizationManagementText}

              </div>


              <div className="flex items-center gap-3">

                <div className="h-2 w-2 rounded-full bg-white" />

                {productivityAnalyticsText}

              </div>


              <div className="flex items-center gap-3">

                <div className="h-2 w-2 rounded-full bg-white" />

                {aiRecommendationsText}

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* Registration Form */}
        {/* ================================= */}

        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">

          <div className="w-full max-w-lg">


            {/* Header */}

            <div className="mb-8">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/20">

                <UserPlus
                  size={24}
                  className="text-indigo-600 dark:text-indigo-400"
                />

              </div>


              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {createYourAccountText}
              </h1>


              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {formDescriptionText}
              </p>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* Full Name */}

              <div>

                <label className={labelClassName}>

                  {fullNameText}

                </label>


                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
                  />


                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    placeholder={fullNamePlaceholder}
                    className={inputClassName}
                  />

                </div>

              </div>


              {/* Email */}

              <div>

                <label className={labelClassName}>

                  {emailText}

                </label>


                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
                  />


                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder={emailPlaceholder}
                    className={inputClassName}
                  />

                </div>

              </div>


              {/* Age + Occupation */}

              <div className="grid gap-5 sm:grid-cols-2">


                {/* Age */}

                <div>

                  <label className={labelClassName}>

                    {ageText}

                  </label>


                  <div className="relative">

                    <Calendar
                      size={18}
                      className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
                    />


                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(event) =>
                        setAge(
                          event.target.value
                        )
                      }
                      placeholder={agePlaceholder}
                      className={inputClassName}
                    />

                  </div>

                </div>


                {/* Occupation */}

                <div>

                  <label className={labelClassName}>

                    {occupationText}

                  </label>


                  <div className="relative">

                    <Briefcase
                      size={18}
                      className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
                    />


                    <input
                      type="text"
                      value={occupation}
                      onChange={(event) =>
                        setOccupation(
                          event.target.value
                        )
                      }
                      placeholder={occupationPlaceholder}
                      className={inputClassName}
                    />

                  </div>

                </div>

              </div>


              {/* Password */}

              <div>

                <label className={labelClassName}>

                  {passwordText}

                </label>


                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
                  />


                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder={passwordPlaceholder}
                    className={`${inputClassName} pr-12`}
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-3 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* Confirm Password */}

              <div>

                <label className={labelClassName}>

                  {confirmPasswordText}

                </label>


                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
                  />


                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder={confirmPasswordPlaceholder}
                    className={`${inputClassName} pr-12`}
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-3 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* Submit */}

              <button
                type="submit"
                disabled={
                  registerMutation.isPending
                }
                className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >

                {registerMutation.isPending
                  ? creatingAccountText
                  : createAccountText}

              </button>


            </form>


            {/* Login */}

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">

              {alreadyHaveAccountText}{" "}

              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {loginText}
              </Link>

            </p>


            {/* Notice */}

            


          </div>

        </div>

      </div>

    </div>
  );
};


export default RegisterPage;