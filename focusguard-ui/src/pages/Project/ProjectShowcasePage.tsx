import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
  Layers3,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  UserCog,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";

import TranslatedText from "../../components/common/TranslatedText";

import { useTranslation } from "../../hooks/useTranslation";

type IconType = LucideIcon;

const ProjectShowcasePage = () => {

  const paragraph1Text = useTranslation(
    "An end-to-end engineering project that combines browser activity tracking, analytics, role-based access control, retrieval-augmented generation and LLM-powered productivity intelligence."
  );

  const paragraph2Text = useTranslation(
    "Traditional productivity tools can show how long someone was active, but activity duration alone does not explain how digital behavior affects attention."
  );

  const paragraph3Text = useTranslation(
    "FocusGuard AI analyzes activity patterns, interruptions, websites, tab switching, user status and planned work to turn digital behavior into actionable productivity intelligence."
  );

  const paragraph4Text = useTranslation(
    "The platform connects the browser, backend, database, analytics, retrieval layer and language models into a single workflow."
  );

  const paragraph5Text = useTranslation(
    "The system combines product engineering, backend development, browser integration, data analytics and generative AI."
  );

  const paragraph6Text = useTranslation(
    "The AI workflow retrieves relevant productivity context before asking the language model to generate a response."
  );

  const paragraph7Text = useTranslation(
    "Different users receive different workflows and permissions while the backend protects role-specific APIs."
  );

  const paragraph8Text = useTranslation(
    "FocusGuard AI covers the engineering layers required to turn an idea into a deployable application \u2014 from authentication and database design to browser integration, analytics and AI-powered intelligence."
  );

  const paragraph9Text = useTranslation(
    "A modern full-stack architecture combining web development, backend services, data infrastructure and generative AI."
  );

  const paragraph10Text = useTranslation(
    "The application is structured as separate frontend, backend and database layers for deployment and scalability."
  );

  const paragraph11Text = useTranslation(
    "FocusGuard AI was developed as an end-to-end engineering project, covering product design, frontend development, backend architecture, database design, browser integration, authentication, RBAC, analytics, AI integration, RAG and cloud deployment."
  );

  const paragraph12Text = useTranslation(
    "Explore the live application, inspect the source code or return to the product landing page."
  );

  const backToHomeText = useTranslation(
    "Back to Home"
  );

  const openApplicationText = useTranslation(
    "Open Application"
  );

  const technicalDemoText = useTranslation(
    "FocusGuard AI \u2014 Technical Demo"
  );

  const humanAttentionText = useTranslation(
    "Human Attention"
  );

  const intelligencePlatformText = useTranslation(
    "Intelligence Platform"
  );

  const tryApplicationText = useTranslation(
    "Try the Application"
  );

  const viewGitHubText = useTranslation(
    "View GitHub"
  );

  const moreThanScreenTimeText = useTranslation(
    "Productivity is more than screen time."
  );

  const activityToInsightsText = useTranslation(
    "From digital activity to intelligent insights."
  );

  const completeApplicationText = useTranslation(
    "A complete application, not just an AI demo."
  );

  const contextBeforeGenerationText = useTranslation(
    "Context before generation."
  );

  const userContextText = useTranslation(
    "User Context"
  );

  const retrievalText = useTranslation(
    "Retrieval"
  );

  const ragContextText = useTranslation(
    "RAG Context"
  );

  const geminiFallbackText = useTranslation(
    "Gemini Fallback"
  );

  const personalizedInsightText = useTranslation(
    "Personalized Insight"
  );

  const rbacText = useTranslation(
    "Role-Based Access Control"
  );

  const superAdminText = useTranslation(
    "SUPER ADMIN"
  );

  const platformAdministrationText = useTranslation(
    "Platform Administration"
  );

  const organizationText = useTranslation(
    "ORGANIZATION"
  );

  const tenantStructureText = useTranslation(
    "Tenant-level structure"
  );

  const subAdminText = useTranslation(
    "SUB ADMIN"
  );

  const organizationManagementText = useTranslation(
    "Organization Management"
  );

  const usersText = useTranslation(
    "USERS"
  );

  const personalProductivityText = useTranslation(
    "Personal Productivity"
  );

  const endToEndText = useTranslation(
    "What makes this an end-to-end project?"
  );

  const technologiesText = useTranslation(
    "Technologies behind the platform."
  );

  const localToCloudText = useTranslation(
    "From local development to cloud deployment."
  );

  const conceptToProductionText = useTranslation(
    "From concept to production."
  );

  const seeInActionText = useTranslation(
    "See FocusGuard AI in action."
  );

  const openLiveApplicationText = useTranslation(
    "Open Live Application"
  );

  const viewSourceCodeText = useTranslation(
    "View Source Code"
  );

  const backToPortfolioText = useTranslation(
    "Back to Portfolio"
  );

  const footerTitleText = useTranslation(
    "FocusGuard AI \u2014 Digital Attention Intelligence Platform"
  );

  const homeText = useTranslation(
    "Home"
  );

  const loginText = useTranslation(
    "Login"
  );
  const capabilities: {
    icon: IconType;
    number: string;
    title: string;
    description: string;
  }[] = [
    {
      number: "01",
      icon: Network,
      title: "Real-Time Activity Tracking",
      description:
        "A Manifest V3 Chrome Extension captures website activity, tab switches, sessions and user status and sends the activity to the backend.",
    },
    {
      number: "02",
      icon: BarChart3,
      title: "Productivity Intelligence",
      description:
        "Activity data is transformed into focus scores, active and idle time, website insights, category analytics and tab-switch patterns.",
    },
    {
      number: "03",
      icon: Target,
      title: "AI Focus Planner",
      description:
        "Users can create focused work plans, track progress and receive intelligent reminders when their activity moves away from the planned category.",
    },
    {
      number: "04",
      icon: BrainCircuit,
      title: "AI Recommendations",
      description:
        "The AI layer uses user activity context to generate personalized productivity recommendations and actionable insights.",
    },
    {
      number: "05",
      icon: Network,
      title: "Retrieval-Augmented Generation",
      description:
        "Relevant productivity context is retrieved before generation so responses can be grounded in the user's available activity context.",
    },
    {
      number: "06",
      icon: ShieldCheck,
      title: "Role-Based Access Control",
      description:
        "Protected workflows separate Super Admin, Sub Admin and User capabilities across the platform.",
    },
  ];

  const roles: {
    icon: IconType;
    title: string;
    subtitle: string;
    description: string;
  }[] = [
    {
      icon: ShieldCheck,
      title: "Super Admin",
      subtitle: "Platform Administration",
      description:
        "Manages organizations, administrators, users, requests and platform-level workflows.",
    },
    {
      icon: UserCog,
      title: "Sub Admin",
      subtitle: "Organization Management",
      description:
        "Manages users within an organization and accesses organization-level productivity analytics and insights.",
    },
    {
      icon: Users,
      title: "User",
      subtitle: "Personal Productivity",
      description:
        "Tracks activity, analyzes productivity, creates focus plans and uses AI-powered productivity features.",
    },
  ];

  const technologies = [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "shadcn/ui",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "SQLAlchemy",
    "pgvector",
    "Sentence Transformers",
    "Groq",
    "Gemini",
    "Chrome Extension",
    "JWT",
    "Vercel",
    "Render",
  ];

  const architecture: {
    icon: IconType;
    title: string;
    description: string;
  }[] = [
    {
      icon: Network,
      title: "Browser Activity",
      description:
        "The Chrome Extension observes relevant digital activity and tab-switch events.",
    },
    {
      icon: Server,
      title: "FastAPI Backend",
      description:
        "REST APIs authenticate users, process activity and expose analytics and productivity services.",
    },
    {
      icon: Database,
      title: "PostgreSQL",
      description:
        "Application and activity data is persisted in PostgreSQL for structured analysis.",
    },
    {
      icon: BarChart3,
      title: "Analytics Layer",
      description:
        "Activity is transformed into focus, website, category and behavior insights.",
    },
    {
      icon: Network,
      title: "RAG Retrieval",
      description:
        "Relevant context is retrieved using vector-based similarity search.",
    },
    {
      icon: BrainCircuit,
      title: "LLM Intelligence",
      description:
        "Groq is used for generation with Gemini available as a fallback.",
    },
    {
      icon: Sparkles,
      title: "Personalized Insight",
      description:
        "The resulting context-aware response becomes an actionable productivity recommendation.",
    },
  ];

  const aiPipeline = [
    {
      number: "01",
      title: "Collect",
      description:
        "Capture relevant activity and productivity signals from the application and browser extension.",
    },
    {
      number: "02",
      title: "Store",
      description:
        "Persist structured activity and productivity information in the application database.",
    },
    {
      number: "03",
      title: "Embed & Retrieve",
      description:
        "Relevant information is represented as embeddings and retrieved according to the current AI request.",
    },
    {
      number: "04",
      title: "Build Context",
      description:
        "Retrieved information is assembled into context for the language model.",
    },
    {
      number: "05",
      title: "Generate",
      description:
        "Groq generates the response, with Gemini available as a fallback model.",
    },
    {
      number: "06",
      title: "Respond",
      description:
        "The user receives a personalized recommendation or productivity insight.",
    },
  ];

  const engineeringHighlights = [
    "End-to-end authentication",
    "JWT access and refresh tokens",
    "Role-based access control",
    "Organization management",
    "Invitation workflows",
    "User and organization deactivation",
    "Activity tracking APIs",
    "Website categorization",
    "Tab-switch tracking",
    "Active / idle user status",
    "Focus analytics",
    "AI Focus Planner",
    "AI recommendations",
    "RAG pipeline",
    "PostgreSQL + pgvector",
    "Cloud deployment",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </div>

            <span>FocusGuard AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost">{backToHomeText}</Button>
            </Link>

            <Link to="/login">
              <Button>
                {openApplicationText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 via-background to-background" />

        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              {technicalDemoText}
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {humanAttentionText}
              <span className="block text-primary">
                {intelligencePlatformText}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {paragraph1Text}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  {tryApplicationText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <a
                href="https://github.com/aditikumari4623/FocusGuard-AI"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {viewGitHubText}
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              {[
                "React + TypeScript",
                "FastAPI",
                "PostgreSQL",
                "Chrome Extension",
                "RAG + LLM",
                "Vercel + Render",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border bg-background/70 px-3 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "Browser", "Real-time digital activity"],
            ["02", "Backend", "FastAPI REST architecture"],
            ["03", "Intelligence", "Analytics + RAG + LLM"],
            ["04", "Security", "JWT + role-based access"],
          ].map(([number, title, description]) => (
            <div key={number} className="rounded-2xl border bg-card p-5">
              <p className="text-sm font-semibold text-primary">{number}</p>
              <p className="mt-2 font-semibold"><TranslatedText text={title} /></p>
              <p className="mt-1 text-sm text-muted-foreground">
                <TranslatedText text={description} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              01 — The Problem
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {moreThanScreenTimeText}
            </h2>

            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {paragraph2Text}
            </p>

            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {paragraph3Text}
            </p>
          </div>

          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Activity", "What is happening?"],
                ["Context", "What is the user working on?"],
                ["Attention", "Where are interruptions occurring?"],
                ["Action", "What should the user do next?"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border bg-background p-5"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>

                  <p className="font-semibold"><TranslatedText text={title} /></p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    <TranslatedText text={text} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              02 — System Architecture
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {activityToInsightsText}
            </h2>

            <p className="mt-4 text-muted-foreground">
              {paragraph4Text}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-6xl">
            <div className="grid gap-4 lg:grid-cols-7">
              {architecture.map(
                ({ icon: Icon, title, description }, index) => (
                  <div key={title} className="relative">
                    <div className="h-full rounded-2xl border bg-card p-5 text-center shadow-sm">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <p className="mt-4 text-sm font-semibold"><TranslatedText text={title} /></p>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        <TranslatedText text={description} />
                      </p>
                    </div>

                    {index < architecture.length - 1 && (
                      <ArrowRight className="mx-auto my-3 h-4 w-4 text-muted-foreground lg:absolute lg:-right-3 lg:top-1/2 lg:my-0 lg:-translate-y-1/2" />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What I Built */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            03 — What I Built
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {completeApplicationText}
          </h2>

          <p className="mt-4 text-muted-foreground">
            {paragraph5Text}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(
            ({ number, icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-3xl border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <span className="text-sm font-bold text-muted-foreground">
                    {number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold"><TranslatedText text={title} /></h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  <TranslatedText text={description} />
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* AI + RAG */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              04 — AI + RAG
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {contextBeforeGenerationText}
            </h2>

            <p className="mt-4 text-muted-foreground">
              {paragraph6Text}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-6xl">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aiPipeline.map(
                ({ number, title, description }, index) => (
                  <div
                    key={number}
                    className="relative rounded-2xl border bg-card p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {number}
                      </div>

                      <h3 className="font-semibold"><TranslatedText text={title} /></h3>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      <TranslatedText text={description} />
                    </p>

                    {index < aiPipeline.length - 1 && (
                      <ArrowRight className="absolute -bottom-5 left-1/2 hidden h-5 w-5 translate-x-1/2 rotate-90 text-muted-foreground lg:block" />
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center text-sm font-medium">
              <span className="rounded-full border px-4 py-2">
                {userContextText}
              </span>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <span className="rounded-full border px-4 py-2">
                {retrievalText}
              </span>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <span className="rounded-full border px-4 py-2">
                {ragContextText}
              </span>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <span className="rounded-full border px-4 py-2">Groq</span>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <span className="rounded-full border px-4 py-2">
                {geminiFallbackText}
              </span>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <span className="rounded-full border px-4 py-2">
                {personalizedInsightText}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RBAC */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            05 — Security & Architecture
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {rbacText}
          </h2>

          <p className="mt-4 text-muted-foreground">
            {paragraph7Text}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl border bg-card px-10 py-6 text-center shadow-sm">
              <ShieldCheck className="mx-auto h-7 w-7 text-primary" />

              <p className="mt-2 font-semibold">{superAdminText}</p>

              <p className="text-sm text-muted-foreground">
                {platformAdministrationText}
              </p>
            </div>

            <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />

            <div className="rounded-2xl border bg-card px-10 py-6 text-center shadow-sm">
              <Layers3 className="mx-auto h-7 w-7 text-primary" />

              <p className="mt-2 font-semibold">{organizationText}</p>

              <p className="text-sm text-muted-foreground">
                {tenantStructureText}
              </p>
            </div>

            <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />

            <div className="rounded-2xl border bg-card px-10 py-6 text-center shadow-sm">
              <UserCog className="mx-auto h-7 w-7 text-primary" />

              <p className="mt-2 font-semibold">{subAdminText}</p>

              <p className="text-sm text-muted-foreground">
                {organizationManagementText}
              </p>
            </div>

            <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />

            <div className="rounded-2xl border bg-card px-10 py-6 text-center shadow-sm">
              <Users className="mx-auto h-7 w-7 text-primary" />

              <p className="mt-2 font-semibold">{usersText}</p>

              <p className="text-sm text-muted-foreground">
                {personalProductivityText}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {roles.map(({ icon: Icon, title, subtitle, description }) => (
            <div
              key={title}
              className="rounded-3xl border bg-card p-7 shadow-sm"
            >
              <Icon className="h-8 w-8 text-primary" />

              <p className="mt-5 text-xl font-semibold"><TranslatedText text={title} /></p>

              <p className="mt-1 text-sm font-medium text-primary">
                <TranslatedText text={subtitle} />
              </p>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                <TranslatedText text={description} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Highlights */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                06 — Engineering Scope
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {endToEndText}
              </h2>

              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                {paragraph8Text}
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-7 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {engineeringHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-xl border bg-background p-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                    <span className="text-sm text-muted-foreground">
                      <TranslatedText text={item} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            07 — Technology Stack
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {technologiesText}
          </h2>

          <p className="mt-4 text-muted-foreground">
            {paragraph9Text}
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-3">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm"
            >
              {technology}
            </span>
          ))}
        </div>
      </section>

      {/* Deployment */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              08 — Deployment
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {localToCloudText}
            </h2>

            <p className="mt-4 text-muted-foreground">
              {paragraph10Text}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                icon: Code2,
                title: "Frontend",
                technology: "React + Vite",
                platform: "Vercel",
                description:
                  "Production frontend with responsive UI and environment-based API configuration.",
              },
              {
                icon: Server,
                title: "Backend",
                technology: "FastAPI",
                platform: "Render",
                description:
                  "REST API service handling authentication, activity, analytics, AI and application workflows.",
              },
              {
                icon: Database,
                title: "Database",
                technology: "PostgreSQL + pgvector",
                platform: "Render",
                description:
                  "Persistent relational storage with vector search support for the RAG workflow.",
              },
            ].map(
              ({
                icon: Icon,
                title,
                technology,
                platform,
                description,
              }) => (
                <div
                  key={title}
                  className="rounded-3xl border bg-card p-7 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <p className="mt-5 text-xl font-semibold"><TranslatedText text={title} /></p>

                  <p className="mt-2 text-sm font-medium text-primary">
                    {technology}
                  </p>

                  <p className="mt-1 text-sm font-medium">{platform}</p>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    <TranslatedText text={description} />
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Engineering Story */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12">
          <Code2 className="mx-auto h-10 w-10 text-primary" />

          <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-primary">
            09 — Engineering Story
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {conceptToProductionText}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {paragraph11Text}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              "Concept",
              "Architecture",
              "Frontend",
              "Backend",
              "Database",
              "Chrome Extension",
              "Analytics",
              "AI",
              "RAG",
              "RBAC",
              "Deployment",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <TranslatedText text={item} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
            <Sparkles className="mx-auto h-8 w-8" />

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {seeInActionText}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
              {paragraph12Text}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  {openLiveApplicationText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <a
                href="https://github.com/aditikumari4623/FocusGuard-AI"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {viewSourceCodeText}
                </Button>
              </a>

              <Link to="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
                >
                  {backToPortfolioText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{footerTitleText}</p>

          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-foreground">
              {homeText}
            </Link>

            <Link to="/login" className="hover:text-foreground">
              {loginText}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectShowcasePage;