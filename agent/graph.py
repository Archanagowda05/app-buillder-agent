from dotenv import load_dotenv
from langchain.globals import set_verbose,set_debug
from langchain_groq.chat_models import ChatGroq
from langgraph.constants import END
from langgraph.graph import StateGraph
from langgraph.prebuilt import create_react_agent

from agent.prompt import *
from agent.states import *
from agent.tools import write_file, read_file, get_current_directory, list_files,run_cmd



_ = load_dotenv()

set_debug(True)
set_verbose(True)

# Best for planning & structured output
llm = ChatGroq(
    model="llama-3.3-70b-versatile"
)

coder_llm = ChatGroq(
    model="openai/gpt-oss-120b"
)

coder_tools = [read_file, write_file, list_files, get_current_directory,run_cmd]
react_agent = create_react_agent(coder_llm, coder_tools)

def planner_agent(state:dict)->dict:
    user_prompt=state["user_prompt"]
    resp = llm.with_structured_output(Plan).invoke(planner_prompt(user_prompt))
    if resp is None:
        raise ValueError("Planner did not return a valid response")
    return {"plan":resp}


def architect_agent(state: dict) -> dict:
    """Creates TaskPlan from Plan."""
    plan: Plan = state["plan"]
    resp = llm.with_structured_output(TaskPlan).invoke(
        architect_prompt(plan=plan.model_dump_json())
    )
    if resp is None:
        raise ValueError("Planner did not return a valid response.")

    #resp.plan = plan
    print(resp.model_dump_json())
    return {"task_plan": resp}

def coder_agent(state: dict) -> dict:
    """LangGraph tool-using coder agent."""
    coder_state: CoderState = state.get("coder_state")
    if coder_state is None:
        coder_state = CoderState(task_plan=state["task_plan"], current_step_idx=0)

    steps = coder_state.task_plan.implementation_steps
    if coder_state.current_step_idx >= len(steps):
        return {"coder_state": coder_state, "status": "DONE"}

    current_task = steps[coder_state.current_step_idx]
    normalized_filepath = current_task.filepath.lstrip("/")
    existing_content = read_file.func(normalized_filepath)
    if len(existing_content) > 1500:
        existing_content = existing_content[:1500] + "\n... (truncated, use read_file for full content)"

    system_prompt = f"""
    Current File: {normalized_filepath}

    {coder_system_prompt()}
    """
    user_prompt = (
        f"Task: {current_task.task_description}\n"
        f"File: {normalized_filepath}\n"
        f"Existing content:\n{existing_content}\n"
        "Use write_file(path, content) to save your changes."
    )

    for attempt in range(2):  # original attempt + 1 retry
        react_agent.invoke(
            {
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            },
            {"recursion_limit": 50}
        )

        generated_content = read_file.func(normalized_filepath)
        if generated_content.strip():
            break
        print(f"WARNING: attempt {attempt + 1} produced no content for {normalized_filepath}")

    if not generated_content.strip():
        print(f"WARNING: skipping {normalized_filepath} after retries — file was not generated")

    coder_state.current_step_idx += 1
    return {"coder_state": coder_state}


graph=StateGraph(dict)
graph.add_node("planner",planner_agent)
graph.add_node("architect",architect_agent)
graph.add_node("coder", coder_agent)

graph.add_edge("planner" , "architect")
graph.add_edge("architect" , "coder")
graph.add_conditional_edges(
    "coder",
    lambda s: "END" if s.get("status") == "DONE" else "coder",
    {"END": END, "coder": "coder"}
)

graph.set_entry_point("planner")
agent=graph.compile()


if __name__ == "__main__":
    user_prompt = input("Enter your project prompt: ")
    result = agent.invoke(
        {"user_prompt": user_prompt},
        {"recursion_limit": 50}
    )
    print("Final State:", result)