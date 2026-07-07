const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const chatWithAI = async (req, res) => {

    try {

        const { message } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"
        });

        const prompt = `
You are an Agricultural AI Assistant.

Help farmers with:
- Crop recommendations
- Fertilizer guidance
- Disease symptoms
- Weather impacts
- Irrigation
- Market advice

Question:
${message}
`;

        const result =
            await model.generateContent(prompt);

        const response =
            result.response.text();

        res.json({
            success: true,
            reply: response
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

};

module.exports = {
    chatWithAI
};