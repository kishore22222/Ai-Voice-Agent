const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

export const generateGeminiResponse = async ({
    prompt,
    apiKey,
    user
}) => {
    try {
        if (!apiKey) {
            throw new Error("Gemini API key missing")
        }
        const response = await fetch(`${Gemini_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [
                        { text: "You are a helpful AI voice assistant. Answer all questions clearly and accurately, including general knowledge. Keep responses short and natural for voice playback." }
                    ]
                },
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            })
        })

        if (!response.ok) {
            if (response.status === 400 || response.status === 401) {
                user.geminiStatus = "invalid"
                await user.save()
            }
            if (response.status === 429) {
                user.geminiStatus = "quota_exceeded"
                await user.save()
            }
            const err = await response.text()
            throw new Error(err)
        }

        user.geminiStatus = "active"
        await user.save()

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
            throw new Error("No text returned from Gemini")
        }

        return text.trim()

    } catch (error) {
        console.error("Gemini fetch error:", error.message)
        throw new Error("Gemini API fetch failed")
    }
}
