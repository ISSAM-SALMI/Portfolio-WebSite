from openai import OpenAI
import os

# Chargement du contenu du fichier
with open("CV_Issam_Salmi.txt", "r", encoding="utf-8") as f:
    cv_text = f.read()

# Initialisation du client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
)

# Création de la complétion avec le contenu du CV comme contexte
completion = client.chat.completions.create(
    extra_headers={
        "HTTP-Referer": "https://yourwebsite.com",  # Modifie par ton site réel si nécessaire
        "X-Title": "MonAssistantAI",                # Nom de ton outil/site
    },
    model="google/gemini-2.0-flash-exp:free",
    messages=[
        {
            "role": "system",
            "content": "Tu es un assistant intelligent qui répond uniquement en te basant sur ce CV :\n" + cv_text
        },
        {
            "role": "user",
            "content": "Donne moi numero de téléphone d'Issam et aussi email et link of linkedin ?"
        }
    ]
)

# Affichage de la réponse
print(completion.choices[0].message.content)
