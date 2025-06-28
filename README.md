
# Getting Start
works only for **node** version upper `20`.

### 1. Gemini cli
install gemini cli (i prefer globally)
```
npm install -g gemini-cli
```

next

### 2. API Key
it is free. so go to `https://aistudio.google.com` get `Get API Key` and store to your `.bashrc`, `.bash` or similar
```
export GEMINI_API_KEY=AIza....
```
and don't forget check your limit usage.

done

# Usage

```
import { getGeminiCliResponse } from "@isengin/touch-gemini-cli"

const geminiCliPath = `.../bin/gemini` // you check with "which gemini"
const prompt = "Make poems to appreciate gemini cli"

getGeminiCliResponse({ geminiCliPath, prompt }).then(console.log)
or 
(async () => await geminiCliResponse({geminiCliPath, prompt}))
```
