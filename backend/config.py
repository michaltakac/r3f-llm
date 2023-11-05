import autogen

open_ai_config_list = autogen.config_list_from_json(
    "openai-key",
    filter_dict={
        "model": ["gpt-3.5-turbo"],
    },
)
'''
Change localhost to an IP of the machine running LM Studio if on local network.
'''
coders = [{
    "api_type": "open_ai",
    "api_base": "http://localhost:1234/v1",
    "api_key": "NULL",
}]
'''
Change localhost to an IP of the machine running LM Studio if on local network.
'''
coders = [{
    "api_type": "open_ai",
    "api_base": "http://localhost:1234/v1",
    "api_key": "NULL",
}]
'''
Change localhost to an IP of the machine running LM Studio if on local network.
'''
assistants = [{
    "api_type": "open_ai",
    "api_base": "http://localhost:1234/v1",
    "api_key": "NULL",
}]