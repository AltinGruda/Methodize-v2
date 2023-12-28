import { toast } from "@/components/ui/use-toast";
import { FieldValues } from 'react-hook-form';

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

// Get team projects when user has multiple teams
export async function getProjectsByTeams(teamIds: string[] | undefined) {
  try {
      if (!teamIds || teamIds.length === 0) {
          // Handle the case when there are no teamIds
          return [];
      }
      // Use Promise.all to concurrently fetch projects for each team
      const projectPromises = teamIds.map(async (teamId) => {
          const response = await fetch(`http://localhost:5000/project/${teamId}`);
          
          if (!response.ok) {
              throw new Error(`Failed to fetch projects for team ${teamId}. Status: ${response.status}`);
          }

          return response.json();
      });

      const projectsArrays = await Promise.all(projectPromises);

      // Flatten the array of arrays into a single array of projects
      const projects = projectsArrays.flat();

      return projects;
  } catch (error) {
      console.log("Error getting projects by team ids:", error);
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

export const createTask = async (name: string, date: string, status: string, projectId: string | undefined, assigneeId: string | undefined = undefined, sprint: string | undefined) => {
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
            projectId: projectId,
            assigneeId: assigneeId,
            sprint: sprint
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
      const response = await fetch(`http://localhost:5000/project/${projectId}/tasks`);
  
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

// Get all tasks of a specific user 
  export const getUserTasks = async (userId: string | undefined) => {
    try {  
      // Make the API request using fetch directly
      const response = await fetch(`http://localhost:5000/project/tasks/${userId}`);
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to get tasks. Status: ${response.status}`);
      }
  
      // Parse the JSON data from the response
      const allTasks = await response.json();
      return allTasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

// to do: find a way to dynamically update 1 or more field
export const updateStatus = async (taskId: string, status: string) => {
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
      title: "Task updated successfully."
    })

    return result;
  } catch (error) {
    toast({
      title: "Cannot update the task.",
      description: "Please try again.",
      variant: "destructive"
    })
    console.error(error);
    // Handle the error appropriately, e.g., show a message to the user
  }
};

export const updateTask = async (taskId: string, updateParams: Record<string, string>) => {
    try {
      console.log(updateParams);
      const response = await fetch(`http://localhost:5000/project/task/${taskId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateParams),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      const result = await response.json();

      toast({
        title: "Task updated successfully."
      })

      return result;
    } catch (error) {
      toast({
        title: "Cannot update the task.",
        description: "Please try again.",
        variant: "destructive"
      })
      console.error(error);
      // Handle the error appropriately, e.g., show a message to the user
    }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await fetch(`http://localhost:5000/project/delete-task/${taskId}`, {
      method: 'DELETE'
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data);    
    }

    toast({
      title: "Task deleted successfully."
    })

    return data;
  } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting task.",
        description: "Please try again."
      })
      throw new Error('Error deleting task.');
  }
};

// create a meeting room to attend to
export async function createRoom(roomName: FieldValues) {
    try {
        
        const response = await fetch('https://gleaming-blue-spacesuit.cyclic.app/room/createRoom', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: roomName,
            })
        });

        if (response.ok) {
            console.log('Room created, redirecting soon!');
        }
    } catch (error) {
        console.error("Error creating room:", error);
        // Handle error, show error message, etc.
    }
}

// get all meeting rooms to show
export async function getAllRooms() {
    try {
        const response = await fetch('https://gleaming-blue-spacesuit.cyclic.app/room/rooms');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}