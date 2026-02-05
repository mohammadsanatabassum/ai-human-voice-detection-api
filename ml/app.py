from fastapi import FastAPI
import base64
import librosa
import torch
from transformers import Wav2Vec2Processor, Wav2Vec2ForSequenceClassification

app = FastAPI()

# Load pretrained model & processor
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base")
model = Wav2Vec2ForSequenceClassification.from_pretrained(
    "facebook/wav2vec2-base",
    num_labels=2
)

@app.post("/predict")
def predict(data: dict):
    try:
        # Decode base64 audio
        audio_bytes = base64.b64decode(data["audioBase64"])

        # Save temp file
        with open("temp.mp3", "wb") as f:
            f.write(audio_bytes)

        # Load audio
        audio, sr = librosa.load("temp.mp3", sr=16000)

        # Prepare input
        inputs = processor(audio, sampling_rate=16000, return_tensors="pt")

        # Run inference
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)

        p_human = probs[0][0].item()
        p_ai = probs[0][1].item()

        if p_ai > p_human:
            return {
                "classification": "AI_GENERATED",
                "confidenceScore": round(p_ai, 3)
            }
        else:
            return {
                "classification": "HUMAN",
                "confidenceScore": round(p_human, 3)
            }

    except Exception as e:
        return {
            "classification": "ERROR",
            "confidenceScore": 0.0,
            "message": str(e)
        }
