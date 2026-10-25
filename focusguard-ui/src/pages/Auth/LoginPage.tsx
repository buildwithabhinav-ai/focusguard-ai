import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 transition-colors duration-300 dark:bg-slate-950">
      <LoginForm />
    </div>
  );
};

export default LoginPage;