import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Union
from pydantic import BaseModel
import uvicorn
import openai
import re

# Put your URI end point:port here for your local inference server (in LM Studio)
openai.api_base = 'http://localhost:1234/v1'
# Put in an empty API Key
openai.api_key = ''


def get_completion(options):
    formatted_system_prompt = f"{options.system_prompt}"
    formatted_user_prompt = f"{options.user_prompt}"
    messages = [
        {"role": "system", "content": formatted_system_prompt},
        {"role": "user", "content": formatted_user_prompt}
    ]
    print(f'\nYour prompt: {formatted_user_prompt}\n')
    response = openai.ChatCompletion.create(
        model="local model",
        messages=messages,
        temperature=options.temperature,
        max_tokens=options.max_tokens,
        stream=options.stream,
    )
    return response.choices[0].message["content"]


app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    system_prompt: str
    user_prompt: str
    temperature: Union[int, float] = 0.0
    max_tokens: Union[int, float] = -1
    stream: bool = False


@app.post("/generate-code/{component_name}")
def generate_code(component_name: str, request_body: PromptRequest):
    if request_body is None:
        print("No request_body provided.")
        raise HTTPException(
            status_code=400,
            detail="No prompt provided",
        )

    print(request_body)
    response = get_completion(request_body)
    print(response)

    # Re-create the React component file with extracted generated component code
    react_jsx_code = re.search('```jsx(.*?)```', response, flags=re.DOTALL)
    if react_jsx_code is not None:
        text_file = open(
            f"../frontend/src/components/{component_name}.jsx", "w")
        code_string = react_jsx_code.group(1)
        n = text_file.write(code_string)

        if n == len(code_string):
            print("Success! String written to jsx file.")
        else:
            print("Failure! String not written to jsx file.")

        # Close file
        text_file.close()

    return {"status": "success", "detail": str(response), "code": str(react_jsx_code.group(1) if react_jsx_code is not None else "")}


if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        reload=True,
        port=8000,
    )
