# Text-to-3D with React-three-fibe

Example `react-three-fiber` app connected to a `FastAPI` backend that sits on top of `LM Studio`'s inference server and serves open-source LLMs. User can prompt the model to generate React component called `AIComponent` that should include generated 3D primitives.

### Usage

Install backend deps and start the server

```bash
cd backend
pip install -r requirements.txt
python server.py
```

In another terminal window, install frontend deps and start client app

```bash
cd backend
pip install -r requirements.txt
python server.py
```

Now you can navigate to http://localhost:5137