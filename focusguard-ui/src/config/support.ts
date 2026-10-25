// The one place that holds the support / contact address.
// Every "Contact us", "Talk to our team", footer and help link uses it.

export const SUPPORT_EMAIL = "support.focusguardai@gmail.com";

// mailto: link that opens the visitor's e-mail app, optionally pre-filled.
export const supportMailto = (
  subject?: string,
  body?: string
): string => {
  const params: string[] = [];

  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }

  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }

  return `mailto:${SUPPORT_EMAIL}${
    params.length ? `?${params.join("&")}` : ""
  }`;
};
