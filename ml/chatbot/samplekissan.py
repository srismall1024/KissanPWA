import streamlit as st
from google import genai
from google.genai import types
from PIL import Image
import os
from gtts import gTTS
import io
from dotenv import load_dotenv

load_dotenv()

# Set up the page layout
st.set_page_config(page_title="Sahayak AI - Agriculture Assistant", page_icon="🌾", layout="centered")

st.title("🌾 Sahayak AI")
st.caption("Your multilingual, image-analyzing smart agricultural companion.")

# 1. Initialize Gemini Client safely using the Environment Variable
if "GEMINI_API_KEY" not in os.environ:
    st.error("⚠️ GEMINI_API_KEY is not set in your system environment variables. Please set it and restart.")
    st.stop()

@st.cache_resource
def get_gemini_client():
    return genai.Client()

client = get_gemini_client()

# 2. Maintain Chat Memory / Session State exactly like a real chat app
if "messages" not in st.session_state:
    st.session_state.messages = []

if "gemini_chat" not in st.session_state:
    config = types.GenerateContentConfig(
        system_instruction=(
            "You are an expert agriculture AI assistant named Sahayak. Help farmers with crop diagnostics, "
            "cultivation timelines, general weather rules, and advice. Always reply in the exact same language "
            "the farmer uses (e.g., Hindi, Tamil, Telugu, etc.). Keep responses relatively concise and clear "
            "so they are easy to understand when read aloud. If an image of a plant or leaf is provided, "
            "analyze it carefully for pests, nutrient deficiencies, or diseases, and give simple remedies."
        ),
        temperature=0.4,
    )
    # Initialize the real-time chat instance
    st.session_state.gemini_chat = client.chats.create(model="gemini-2.5-flash", config=config)

# 3. Render previous conversation history from the session state (Including prior Audio tracks)
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        if "text" in message:
            st.markdown(message["text"])
        if "image" in message:
            st.image(message["image"], caption="Uploaded Crop Image", width=300)
        if "audio" in message:
            st.audio(message["audio"], format="audio/mp3")

# 4. Sidebar options for Image Uploading & Native Audio Recording
st.sidebar.header("📸 Crop Diagnostic Center")
uploaded_file = st.sidebar.file_uploader("Upload an image of your crop/leaf if it shows signs of damage:", type=["jpg", "jpeg", "png"])

uploaded_image = None
if uploaded_file:
    uploaded_image = Image.open(uploaded_file)
    st.sidebar.image(uploaded_image, caption="Ready to analyze!", use_container_width=True)

st.sidebar.markdown("---")
st.sidebar.header("🎙️ Voice Assistant")
# Native Streamlit audio recorder component
audio_file = st.sidebar.audio_input("Record your question here:")

voice_payload = None
if audio_file is not None:
    # Read the dynamic browser audio recording into raw bytes for Gemini
    audio_bytes = audio_file.read()
    voice_payload = types.Part.from_bytes(data=audio_bytes, mime_type="audio/wav")

# 5. Handle Chat Inputs (Accepts text box enter OR voice file generation)
user_input = st.chat_input("Ask Sahayak anything about your crops...")

if user_input or voice_payload:
    
    # Render the user data immediately in the UI layout
    with st.chat_message("user"):
        if user_input:
            st.markdown(user_input)
        else:
            st.markdown("🎙️ *Sent a voice recording message*")
        if uploaded_image:
            st.image(uploaded_image, width=300)

    # Structure the message payload for Gemini (handles multi-modal structures effortlessly)
    payload = []
    if user_input:
        payload.append(user_input)
    if voice_payload:
        payload.append(voice_payload)
        payload.append("Listen to this spoken audio question from a farmer and answer it comprehensively.")
    if uploaded_image:
        payload.append(uploaded_image)

    # Save user message details to local UI session state log
    msg_store = {
        "role": "user", 
        "text": user_input if user_input else "🎙️ Spoken Voice Query",
    }
    if uploaded_image:
        msg_store["image"] = uploaded_image
    st.session_state.messages.append(msg_store)

    # Fetch response from Gemini chat engine
    with st.chat_message("assistant"):
        with st.spinner("Analyzing inputs and processing..."):
            try:
                response = st.session_state.gemini_chat.send_message(payload)
                st.markdown(response.text)
                
                # --- Text To Speech Integration ---
                # Basic checker: Defaults language voice to Hindi if standard indicators exist, else fallback to English
                detected_lang = 'hi' if ('है' in response.text or 'के' in response.text) else 'en'
                
                # Turn the text output into dynamic speech audio tracks
                tts = gTTS(text=response.text, lang=detected_lang, slow=False)
                audio_buffer = io.BytesIO()
                tts.write_to_fp(audio_buffer)
                audio_buffer.seek(0)
                
                # Output audio straight to browser speakers instantly
                st.audio(audio_buffer, format="audio/mp3", autoplay=True)
                
                # Save Assistant text along with its voice track bytes to preserve history logs
                st.session_state.messages.append({
                    "role": "assistant", 
                    "text": response.text,
                    "audio": audio_buffer
                })
            except Exception as e:
                st.error(f"Error calling Gemini API: {e}")
