(function () {

    const script = document.currentScript
    const userId = script?.dataset?.userId
    console.log(userId)

    const theme = "dark"
    let assistantConfig = null

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://shifra-d82z.onrender.com/assistant.css"
    document.head.appendChild(link)

    const popup = document.createElement("div")
    popup.className = `shifra-popup theme-${theme}`
    popup.innerHTML = `
    <div class="shifra-overlay"></div>
    <div class="shifra-content">
      <div class="shifra-top">
        <div class="shifra-orb-wrap">
          <div class="shifra-orb-glow"></div>
          <div class="shifra-orb"></div>
        </div>
        <h2 class="shifra-title">Hello! I'm Shifra AI</h2>
        <p class="shifra-sub">
          Your smart voice assistant.<br/>Ask anything about your website.
        </p>
        <div class="shifra-status">Tap button to speak</div>
        <div class="shifra-wave">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
        <div class="shifra-user-text"></div>
        <div class="shifra-ai-text"></div>
      </div>
      <div class="shifra-bottom">
        <button class="shifra-mic">
          <img src="https://shifra-d82z.onrender.com/mic.svg" alt="mic" class="shifra-mic-icon"/>
        </button>
      </div>
    </div>
    `
    document.body.appendChild(popup)

    const button = document.createElement("button")
    button.className = `shifra-btn theme-${theme}`
    button.innerHTML = `<img src="https://shifra-d82z.onrender.com/logo.png" alt="logo"/>`
    document.body.appendChild(button)

    let open = false
    button.onclick = () => {
        open = !open
        popup.style.display = open ? "flex" : "none"
    }

    const loadAssistant = async () => {
        try {
            const res = await fetch(`https://ai-voice-agentserver.onrender.com/api/assistant/config/${userId}`)
            const data = await res.json()
            if (data) {
                assistantConfig = data.user
                applyConfig()
            }
        } catch (error) {
            console.log("assistant error load", error)
        }
    }

    const applyConfig = () => {
        if (!assistantConfig) return
        popup.className = `shifra-popup theme-${assistantConfig.theme}`
        button.className = `shifra-btn theme-${assistantConfig.theme}`
        const title = popup.querySelector(".shifra-title")
        title.innerHTML = `Hello! I'm ${assistantConfig.assistantName}`
        const subTitle = popup.querySelector(".shifra-sub")
        subTitle.innerHTML = `Welcome to ${assistantConfig.businessName}<br/>Ask anything about your website`
    }

    loadAssistant()

    const status = popup.querySelector(".shifra-status")
    const wave = popup.querySelector(".shifra-wave")
    const userText = popup.querySelector(".shifra-user-text")
    const aiText = popup.querySelector(".shifra-ai-text")
    const mic = popup.querySelector(".shifra-mic")

    const speak = (text) => {
        window.speechSynthesis.cancel()
        aiText.innerText = text
        status.innerText = "AI Speaking..."

        const speech = new SpeechSynthesisUtterance(text)
        speech.lang = "hi-IN"
        speech.rate = 1
        speech.pitch = 1
        speech.volume = 1

        speech.onend = () => {
            status.innerText = "Tap Button to speak"
            wave.style.opacity = "0"
        }
        window.speechSynthesis.speak(speech)
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = "en-US"
        recognition.continuous = false
        recognition.interimResults = false

        mic.onclick = () => {
            wave.style.opacity = "1"
            status.innerText = "Listening..."
            userText.innerText = ""
            aiText.innerText = ""
            recognition.start()
        }

        recognition.onresult = (e) => {
            const text = e.results[0][0].transcript
            userText.innerText = "You: " + text
            recognition.stop()

            setTimeout(async () => {
                try {
                    status.innerText = "Thinking..."

                    const res = await fetch("https://ai-voice-agentserver.onrender.com/api/assistant/ask", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: text, userId })
                    })

                    // ✅ Fixed: added await
                    const data = await res.json()
                    console.log(data)

                    if (data.success) {
                        if (data.action === "navigate") {
                            speak(data.response)
                            setTimeout(() => {
                                window.location.href = data.path
                            }, 1500)
                        } else {
                            speak(data.aiResponse)
                        }
                    } else {
                        speak("Response Error: Please check your plan")
                    }

                } catch (error) {
                    console.log(error)
                    speak("AI server error")
                }
            }, 600)
        }

        recognition.onerror = () => {
            status.innerText = "Tap button to Speak"
            wave.style.opacity = "0"
        }

    } else {
        status.innerText = "Speech Recognition not Supported"
    }

})()
