import { useState } from "react";

import {
  Bot,
  Send,
  User,
  Sparkles,
  X,
} from "lucide-react";

import MarkdownText from "../common/MarkdownText";
import { useAIChat } from "../../hooks/useAIChat";
import { useTranslation } from "../../hooks/useTranslation";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

/* -----------------------------------------
   AI Message

   Dynamic AI responses are translated here.
----------------------------------------- */

interface AIMessageProps {
  text: string;
}

const AIMessage = ({
  text,
}: AIMessageProps) => {
  const translatedText =
    useTranslation(text);

  return (
    <div
      className="
        min-w-0
        max-w-[calc(100%-44px)]
        overflow-hidden
        break-words
        rounded-2xl
        rounded-bl-md
        border
        border-slate-200
        bg-white
        px-3
        py-2.5
        text-sm
        leading-6
        text-slate-700
        shadow-sm

        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-200

        sm:max-w-[78%]
        sm:px-4
        sm:py-3
      "
    >
      <MarkdownText text={translatedText} />
    </div>
  );
};

const Chatbot = () => {
  const [open, setOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const chatMutation =
    useAIChat();

  /* -----------------------------------------
     Static UI translations
  ----------------------------------------- */

  const productivityAssistantText =
    useTranslation(
      "Productivity Assistant"
    );

  const closeAssistantText =
    useTranslation(
      "Close FocusGuard AI"
    );

  const openAssistantText =
    useTranslation(
      "Open FocusGuard AI Assistant"
    );

  const thinkingText =
    useTranslation("Thinking...");

  const inputPlaceholder =
    useTranslation(
      "Ask FocusGuard AI..."
    );

  const sendMessageText =
    useTranslation("Send message");

  // Kept in English; AIMessage translates every AI message.
  const initialMessage =
    "Hi! I'm the FocusGuard AI Assistant. Ask me about your productivity, focus score, activity, reports, or recommendations.";

  // Kept in English; AIMessage translates every AI message.
  const errorMessageText =
    "Sorry, I couldn't process your request right now.";

  const [messages, setMessages] =
    useState<Message[]>([
      {
        id: 1,
        sender: "ai",
        text: initialMessage,
      },
    ]);

  /* -----------------------------------------
     Send Message
  ----------------------------------------- */

  const handleSend = async () => {
    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");

    try {
      const result =
        await chatMutation.mutateAsync({
          message: trimmedMessage,
          history: messages
            .slice(1)
            .map(({ sender, text }) => ({
              sender,
              text,
            })),
        });

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: result.response,
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);
    } catch (error: any) {
      // Validation errors return a list, not a message.
      const detail =
        error?.response?.data?.detail;

      const backendError =
        typeof detail === "string"
          ? detail
          : undefined;

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text:
          backendError ??
          errorMessageText,
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    }
  };

  /* -----------------------------------------
     Enter Key
  ----------------------------------------- */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={openAssistantText}
          className="
            fixed
            bottom-4
            right-4
            z-[70]

            flex
            h-14
            w-14
            items-center
            justify-center

            rounded-full
            bg-violet-600
            text-white
            shadow-xl

            transition
            duration-200
            hover:scale-105
            hover:bg-violet-700
            active:scale-95

            sm:bottom-5
            sm:right-5
            sm:h-16
            sm:w-16

            md:bottom-6
            md:right-6
          "
        >
          <Bot
            size={26}
            className="sm:h-7 sm:w-7"
          />
        </button>
      )}

      {/* Mobile Backdrop */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[60]

            bg-slate-900/30
            backdrop-blur-[1px]

            dark:bg-black/50

            sm:hidden
          "
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* Chat Window */}

      {open && (
        <div
          className="
            fixed
            z-[70]

            flex
            flex-col
            overflow-hidden

            border
            border-slate-200
            bg-white
            shadow-2xl

            dark:border-slate-700
            dark:bg-slate-900

            inset-x-2
            bottom-2

            h-[calc(100dvh-16px)]
            max-h-[850px]

            rounded-2xl

            sm:inset-x-auto
            sm:bottom-5
            sm:right-5

            sm:h-[min(600px,calc(100dvh-40px))]

            sm:w-[min(380px,calc(100vw-40px))]

            sm:rounded-3xl

            md:bottom-6
            md:right-6

            md:h-[600px]
            md:w-[380px]
          "
        >
          {/* Header */}

          <div
            className="
              flex
              min-h-[64px]
              shrink-0
              items-center
              justify-between
              gap-3
              bg-violet-600
              px-4
              py-3
              text-white

              sm:px-5
              sm:py-4
            "
          >
            <div
              className="
                flex
                min-w-0
                flex-1
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/20

                  sm:h-10
                  sm:w-10
                "
              >
                <Bot
                  size={20}
                  className="sm:h-[22px] sm:w-[22px]"
                />
              </div>

              <div className="min-w-0">
                <h2
                  className="
                    truncate
                    text-sm
                    font-bold
                    sm:text-base
                  "
                >
                  FocusGuard AI
                </h2>

                <p
                  className="
                    truncate
                    text-[11px]
                    text-violet-100
                    sm:text-xs
                  "
                >
                  {productivityAssistantText}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              aria-label={
                closeAssistantText
              }
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                transition
                hover:bg-white/20
                active:bg-white/30
              "
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overflow-x-hidden
              bg-slate-50
              p-3

              dark:bg-slate-950

              sm:p-4
            "
          >
            <div className="space-y-4">
              {messages.map(
                (item) => (
                  <div
                    key={item.id}
                    className={`
                      flex
                      min-w-0
                      items-end
                      gap-2

                      ${
                        item.sender ===
                        "user"
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >
                    {item.sender ===
                      "ai" && (
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-violet-100
                          text-violet-600

                          dark:bg-violet-950/70
                          dark:text-violet-400
                        "
                      >
                        <Sparkles
                          size={16}
                        />
                      </div>
                    )}

                    {item.sender ===
                    "ai" ? (
                      <AIMessage
                        text={item.text}
                      />
                    ) : (
                      <div
                        className="
                          min-w-0
                          max-w-[calc(100%-44px)]
                          overflow-hidden
                          break-words
                          whitespace-pre-wrap
                          rounded-2xl
                          rounded-br-md
                          bg-violet-600
                          px-3
                          py-2.5
                          text-sm
                          leading-6
                          text-white

                          sm:max-w-[78%]
                          sm:px-4
                          sm:py-3
                        "
                      >
                        {item.text}
                      </div>
                    )}

                    {item.sender ===
                      "user" && (
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-slate-200
                          text-slate-600

                          dark:bg-slate-700
                          dark:text-slate-200
                        "
                      >
                        <User
                          size={16}
                        />
                      </div>
                    )}
                  </div>
                )
              )}

              {chatMutation.isPending && (
                <div className="flex items-end gap-2">
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-violet-100
                      text-violet-600

                      dark:bg-violet-950/70
                      dark:text-violet-400
                    "
                  >
                    <Sparkles
                      size={16}
                    />
                  </div>

                  <div
                    className="
                      rounded-2xl
                      rounded-bl-md
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-500
                      shadow-sm

                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-slate-400
                    "
                  >
                    {thinkingText}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}

          <div
            className="
              shrink-0
              border-t
              border-slate-200
              bg-white
              p-3

              dark:border-slate-700
              dark:bg-slate-900

              sm:p-4
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
              "
            >
              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder={
                  inputPlaceholder
                }
                disabled={
                  chatMutation.isPending
                }
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition

                  placeholder:text-slate-400

                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100

                  disabled:bg-slate-100

                  dark:border-slate-600
                  dark:bg-slate-800
                  dark:text-white
                  dark:placeholder:text-slate-500

                  dark:focus:border-violet-500
                  dark:focus:ring-violet-950

                  dark:disabled:bg-slate-800

                  sm:px-4
                  sm:py-3
                "
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={
                  !message.trim() ||
                  chatMutation.isPending
                }
                aria-label={
                  sendMessageText
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-600
                  text-white
                  transition
                  hover:bg-violet-700
                  active:bg-violet-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  sm:h-11
                  sm:w-11
                "
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;