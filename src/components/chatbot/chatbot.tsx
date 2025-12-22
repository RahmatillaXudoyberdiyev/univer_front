import Script from 'next/script'

const Chatbot = () => {
    const CRISP_WEBSITE_ID = 'cd89ab0a-684c-4a96-830c-222451b4334c'

    return (
        <div className="container-cs w-5">
            <Script id="crisp-chat" strategy="afterInteractive">
                {`
          window.$crisp = [];
          window.CRISP_WEBSITE_ID = "${CRISP_WEBSITE_ID}";
          (function() {
            const d = document;
            const s = d.createElement("script");
            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("head")[0].appendChild(s);
          })();
        `}
            </Script>
        </div>
    )
}

export default Chatbot
