import { toast } from "@/components/ui/use-toast";

export async function getUserTeams(userId: string | null) {
    try {
        if(userId === null) throw Error('User is not authenticated.')
        const response = await fetch(`http://localhost:5000/team/list/${userId}`)
        const teams = await response.json();
        return teams;
    } catch (error) {
        console.log(error);
    }
}

export async function addMember(userId: string | null, teamId: string) {
    try {
        if(userId === null) throw Error('User id is null');
        const response = await fetch(`http://localhost:5000/team/${teamId}/user/${userId}`);
        const team = await response.json();

        return team;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllUsers() {
    try {
        const response = await fetch('http://localhost:5000/auth/users');
        const users = await response.json();
        // const names = users.map((data: {name: string}) => data.name)

        // return names;
        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(userId: string) {
    try {
        const response = await fetch(`http://localhost:5000/auth/user/${userId}`);
        const user = await response.json();

        return user;
    } catch (error) {
        console.log(error);
    }
}

// /project/:teamId/create-project
export async function createProject(name: string, teamId: string | undefined) {
    try {
        const response = await fetch(`http://localhost:5000/project/${teamId}/create-project`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        });

        if (!response.ok) {
            // Handle non-successful responses (e.g., 4xx or 5xx status codes)
            throw new Error(`Failed to create project. Status: ${response.status}`);
        }

        // Assuming the server responds with JSON data, you can parse it
        const responseData = await response.json();

        // Do something with the responseData if needed
        console.log("Project created successfully:", responseData);

        return responseData;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
}

export async function getProjectsByTeam(teamId: string | undefined) {
    try {
        const response = await fetch(`http://localhost:5000/project/${teamId}`);

        // Check for a non-successful response
        if (!response.ok) {
            throw new Error(`Failed to fetch projects. Status: ${response.status}`);
        }

        const projects = await response.json();

        return projects;
    } catch (error) {
        console.log("Error getting projects by team id:", error );
        throw error;
    }
}

export async function getProjectById(projectId: string) {
    try {
        const response = await fetch(`http://localhost:5000/project/byId/${projectId}`);
        
        if (!response.ok) {
            // Handle non-successful responses (e.g., 404 Not Found)
            throw new Error(`Failed to fetch project. Status: ${response.status}`);
        }

        const project = await response.json();
        return project;
    } catch (error) {
        console.error('Error fetching project:', error);
        // You might want to throw the error again or handle it differently based on your requirements
        throw error;
    }
}

export const createTask = async (name: string, date: string, status: string, projectId: string | undefined) => {
    try {  
      // Make the API request using fetch directly
      const response = await fetch('http://localhost:5000/project/create-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            due_date: date,
            status: status,
            projectId: projectId
        }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to create task. Status: ${response.status}`);
      }
      // Parse the JSON data from the response
      const createdTask = await response.json();
  
      // Do something with the created task data if needed
      console.log('Task created successfully:', createdTask);

      toast({
        title: 'Your task has been created',
      })
  
      return createdTask;
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle the error or throw it again based on your requirements
      toast({
        title: "Oops! Something went wrong.",
        description: "Task creation failed.",
        variant: "destructive"
      })
      throw error;
    }
  };
  
export const getTasks = async (projectId: string | undefined) => {
    try {  
      // Make the API request using fetch directly
      const response = await fetch(`http://localhost:5000/project/tasks/${projectId}`);
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to create task. Status: ${response.status}`);
      }
  
      // Parse the JSON data from the response
      const allTasks = await response.json();
      
      return allTasks;
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle the error or throw it again based on your requirements
      throw error;
    }
  };

export const startSprint = async (projectId: string | undefined, durationInDays: number | undefined) => {
    try {  
      // Make the API request using fetch directly
      const response = await fetch('http://localhost:5000/project/start-sprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            projectId,
            durationInDays
        }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to start a sprint. Status: ${response.status}`);
      }
  
      // Parse the JSON data from the response
      const allTasks = await response.json();
      
      toast({
        title: "Sprint started successfully! Time to achieve greatness."
      })

      return allTasks;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Unable to start sprint. Please try again.",
        variant: "destructive"
      })
      // Handle the error or throw it again based on your requirements
      throw error;
    }
};

export const checkActiveSprint = async (projectId: string | undefined) => {
    try {
        const response = await fetch(`http://localhost:5000/project/check-sprint/${projectId}`);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Error checking active sprint.');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error checking active sprint.');
    }
};

export const activeSprintTasks = async (projectId: string, sprintId: string) => {
    try {
        const response = await fetch(`http://localhost:5000/project/tasks/${projectId}/${sprintId}`)
        const data = await response.json();

        if(response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Error getting active sprint tasks.');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error getting active sprint tasks.');
    }
}

export const finishSprint = async (sprintId: string | undefined) => {
    try {
      const response = await fetch(`http://localhost:5000/project/finish-sprint/${sprintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      const result = await response.json();

      toast({
        title: "Congratulations! Sprint finished successfully."
      })

      return result;
    } catch (error) {
      toast({
        description: `${error}`,
        variant: "destructive"
      })
      console.error(error);
      // Handle the error appropriately, e.g., show a message to the user
    }
};

export const updateTask = async (status: string, taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/project/task/${taskId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: status}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      const result = await response.json();

      toast({
        title: "Task status changed successfully."
      })

      return result;
    } catch (error) {
      toast({
        title: "Cannot change the status.",
        description: "Please try again.",
        variant: "destructive"
      })
      console.error(error);
      // Handle the error appropriately, e.g., show a message to the user
    }
};

