import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Send,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { SUPPORT_EMAIL, supportMailto } from "../../config/support";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const backToHomeText = useTranslation("Back to Home");
  const contactUsText = useTranslation("Contact Us");
  const heroDescriptionText = useTranslation(
    "Have a question about FocusGuard AI, your organization, or how the platform can help improve productivity? We'd love to hear from you."
  );

  const getInTouchText = useTranslation("Get In Touch");
  const talkTitleText = useTranslation("Let's talk about FocusGuard AI");
  const talkDescriptionText = useTranslation(
    "Whether you're an individual user, team manager, or organization administrator, our team can help you understand the platform and its capabilities."
  );

  const emailText = useTranslation("Email");
  const responseTimeText = useTranslation("Response Time");
  const responseDescriptionText = useTranslation(
    "We aim to respond within 1–2 business days."
  );
  const locationText = useTranslation("Location");
  const locationDescriptionText = useTranslation(
    "FocusGuard AI — Digital Productivity Platform"
  );
  const organizationNoteText = useTranslation(
    "For organization-related questions, please include your organization name and role so we can better understand your request."
  );

  const sendMessageText = useTranslation("Send A Message");
  const helpTitleText = useTranslation("How can we help?");
  const formDescriptionText = useTranslation(
    "Fill out the form below and tell us what you would like to know."
  );
  const fullNameText = useTranslation("Full Name");
  const fullNamePlaceholderText = useTranslation("Enter your full name");
  const emailAddressText = useTranslation("Email Address");
  const subjectText = useTranslation("Subject");
  const subjectPlaceholderText = useTranslation("What would you like to discuss?");
  const messageText = useTranslation("Message");
  const messagePlaceholderText = useTranslation("Write your message...");
  const successText = useTranslation(
    "Your e-mail app should now open with your message addressed to our support team. If it does not, please write to us directly at"
  );
  const sendButtonText = useTranslation("Send Message");

  const aboutUsText = useTranslation("About Us");
  const privacyPolicyText = useTranslation("Privacy Policy");
  const termsOfServiceText = useTranslation("Terms of Service");
  const copyrightText = useTranslation(
    "© {year} FocusGuard AI. All rights reserved."
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // There is no mail server behind this form: open the visitor's own
    // e-mail app with the message addressed to the support team.
    const form = new FormData(event.currentTarget);

    const body = [
      String(form.get("message") ?? ""),
      "",
      `Name: ${String(form.get("name") ?? "")}`,
      `Reply to: ${String(form.get("email") ?? "")}`,
    ].join("\n");

    window.location.href = supportMailto(
      String(form.get("subject") ?? "FocusGuard AI - Contact"),
      body
    );

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
              F
            </div>
            <span className="truncate text-xl font-bold">FocusGuard AI</span>
          </Link>

          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 sm:px-4"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">{backToHomeText}</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white transition-colors dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <MessageCircle size={32} />
          </div>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {contactUsText}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
            {heroDescriptionText}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-10">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {getInTouchText}
              </span>

              <h2 className="mt-4 text-3xl font-bold">{talkTitleText}</h2>

              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                {talkDescriptionText}
              </p>
            </div>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Mail size={21} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">{emailText}</h3>
                  <a
                    href={supportMailto("FocusGuard AI - Support")}
                    className="mt-1 block break-words text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-cyan-200 hover:bg-cyan-50/40 dark:border-slate-800 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <Clock size={21} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">{responseTimeText}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {responseDescriptionText}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-violet-200 hover:bg-violet-50/40 dark:border-slate-800 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <MapPin size={21} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">{locationText}</h3>
                  <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">
                    {locationDescriptionText}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {organizationNoteText}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-10">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                {sendMessageText}
              </span>

              <h2 className="mt-4 text-3xl font-bold">{helpTitleText}</h2>

              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                {formDescriptionText}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                    {fullNameText}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={fullNamePlaceholderText}
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                    {emailAddressText}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-semibold">
                    {subjectText}
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder={subjectPlaceholderText}
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                    {messageText}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder={messagePlaceholderText}
                    required
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="mt-auto pt-7">
                {submitted && (
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {successText}{" "}
                    <a
                      href={supportMailto("FocusGuard AI - Support")}
                      className="font-semibold underline"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Send size={18} />
                  {sendButtonText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            {copyrightText.replace("{year}", String(new Date().getFullYear()))}
          </p>

          <div className="flex flex-wrap gap-5">
            <Link to="/about" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              {aboutUsText}
            </Link>
            <Link to="/privacy" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              {privacyPolicyText}
            </Link>
            <Link to="/terms" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              {termsOfServiceText}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
