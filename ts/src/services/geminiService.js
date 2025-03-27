const API_URL = "http://localhost:5000/api/gemini/generate"; // Backend API

export const fetchGeminiResponse = async (userPrompt) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    console.log("Gemini Response:", data);
    return data; // Return response to the calling component
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return { error: "Failed to get response from AI." }; // Prevents crashes
  }
};
