// Which backend the extension talks to.
//
// true  -> the backend running on this computer (./focusguard.sh, port 8000)
// false -> the deployed backend on Render
//
// Set this to false before publishing the extension.
const USE_LOCAL_BACKEND = true;

export const API_BASE_URL = USE_LOCAL_BACKEND
  ? "http://127.0.0.1:8000"
  : "https://focusguard-ai-backend.onrender.com";
