import json

import autogen
from autogen import GroupChat

import config
# import langchain_tools
from agent import LMStudioAgent, LMStudioChatManager
from utils import generate_llm_config

SEED = 1238

# google = langchain_tools.GoogleSearchTool()

# open_ai_llm_config = {"config_list": config.open_ai_config_list, "seed": SEED,
#                       "functions": [generate_llm_config(google)]}
assistants_configuration = {"config_list": config.assistants, "seed": SEED}
code_assistants_configuration = {"config_list": config.coders, "seed": SEED}

autogen.ChatCompletion.start_logging()


def check_termination(x):
    if "content" in x and x["content"] is not None:
        if x["content"].endswith("TERMINATE"):
            return True
    return False


user_proxy = autogen.UserProxyAgent(
    name="User_proxy",
    code_execution_config={"last_n_messages": 10, "work_dir": f"groupchat"},
    human_input_mode="NEVER",
    default_auto_reply="default_auto_reply",
    max_consecutive_auto_reply=10,
    is_termination_msg=check_termination
)

# user_proxy.register_function(
#     function_map={
#         "google_search": google._run
#     }
# )

pm = LMStudioAgent(
    name="Manager",
    system_message="You are a manager coordinating researcher and prepare briefings for them. You coordinate gathering results and letting coders prepare these results files once there are results.",
    llm_config=assistants_configuration,
    default_auto_reply="default_auto_reply"
)

researcher = LMStudioAgent(
    name="Researcher",
    system_message="You are a researcher. You prepare research reports for the manager. You can get current data from your research assistants. You prepare the results for the manager. You prepare the briefings for the research assistants in order for them to find good quality results.",
    llm_config=assistants_configuration,
    default_auto_reply="default_auto_reply",
)

file_coder = LMStudioAgent(
    name="Coder",
    system_message="You are a coder that creates python code. Your are speciliazed in creating python programs that create html result pages for researchers.",
    llm_config=code_assistants_configuration,
    default_auto_reply="default_auto_reply",
)

research_assistant_with_function = autogen.AssistantAgent(
    name="Rearch_Assistant",
    system_message="You are an assistant to the researcher. Your task is to find current results on google. You can search google with a query and you return the most promising results to the researcher.",
    # llm_config=open_ai_llm_config,
    llm_config=code_assistants_configuration,
    default_auto_reply="default_auto_reply",
)

group_chat = GroupChat(agents=[user_proxy, pm, researcher, research_assistant_with_function, file_coder], messages=[],
                       max_round=50)

manager = LMStudioChatManager(groupchat=group_chat, llm_config=assistants_configuration, name="Conversation_manager")

user_proxy.initiate_chat(manager,
                         message="I want to get an overview of current stock market trends. Today is the 22.10.2023. There should be a program that generates a HTML page as a result. All information can be hardcoded.")