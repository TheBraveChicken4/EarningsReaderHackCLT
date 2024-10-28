import speech_recognition as sr
import openai
import time
import os
import numpy as np

os.environ["MODELRUNNING"] = "true"

def get_sentiment(prompt):
    #Enter API Key
    openai.api_key = key
    prompt = [
        {
        "role": "system", "content": "return a single number representing the sentiment of the statement from -1 to 1)"},
        {"role": "user", "content": prompt}
    ]
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=prompt
    )

    return response.choices[0].message.content


def convert_to_float(value):
    try:
        value = float(value)
        #value = np.min(value, 1)
        #value = np.max(-1, value)
        return value
    
    except ValueError:
        return float(0)


def write_to_file(data):
    with open("backend/output/sentiment.txt", "w") as f:
        f.write(data)

def live_transcribe():
    recognizer = sr.Recognizer()
    sent = [0]
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source)

        while True:
            try:
                audio_data = recognizer.listen(source)

                text = recognizer.recognize_google(audio_data)

                l_sent = get_sentiment(text)

                l_sent = convert_to_float(l_sent)


                sent.append(l_sent)
                data = str(np.mean(sent))
                write_to_file(data)
                print(text)
                print(data)

            except sr.UnknownValueError:
                sent.append(0)
                data = str(np.mean(sent))
                write_to_file(data)
            except sr.RequestError as e:
                sent.append(0)
                data = str(np.mean(sent))
                write_to_file(data)

if __name__ == "__main__":
    live_transcribe()