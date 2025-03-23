import { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/03/23/07/20250323073845-02Z0NY9Y.js";
    script2.async = true;
    document.body.appendChild(script2);
  }, []);

  return null;
};

export default Chatbot;
