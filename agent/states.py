from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class File(BaseModel):
    path: str = Field(
        description="t=he path of the file which should be created or modified"
    )
    purpose: str = Field(
        description="the purpose of that specified file eg:'main application logic','data visulaization model'"
    )

class Plan(BaseModel):
    name: str = Field(
        description="The name of the app to be built"
    )
    description: str =Field(
        description="A oneline description of the app to be built , eg: 'A web application for tracking job applications"
    )
    techstack: str = Field(
        description="the teschstack which are used to build app eg:'python','javascript','java'"
    )
    features: list[str] = Field(
        description="A list of features the app should have eg:'user authentication','dashboard','data visualization'"
    )
    files : list[File] = Field(
        description="A list of files to be create for the app eg:'index.html','style.css','script.js'"
    )

class ImplementationTask(BaseModel):
    filepath: str = Field(
        description="The path to the file to be modified"
    )
    task_description: str = Field(
        description="The detailed description of the task to be performed on the file eg:'add user authentication'"
    )

class TaskPlan(BaseModel):
    implementation_steps: list[ImplementationTask] = Field(
        description="A list of steps to be taken to complete the task "
    )
    model_config = ConfigDict(extra="allow")

class CoderState(BaseModel):
    task_plan: TaskPlan = Field(
        description="The plan for the task to be implemented"
    )
    current_step_idx: int = Field(
        0, description="The index of the current step in the implementation steps"
    )
    current_file_content: Optional[str] = Field(
        None, description="The content of the file currently being edited or created"
    )