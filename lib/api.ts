export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

type ResumeVersionResponse = {
  resume: any;
  newVersion: any;
};

export async function register(data: { username: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error((await res.json()).error || "Registration failed")
  return res.json()
}


export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if(!res.ok) throw new Error((await res.json()).error || "Login failed")
  return res.json()
}


export async function createResume(token: string,
  data: { title: string; personal?: any; education?: any; experience?: any; skills?:string[]}
) {
  const res = await fetch(`${API_URL}/resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to create resume");
  }
  return res.json()
}

export async function getUserResumes(token:string) {
  const res = await fetch(`${API_URL}/resume`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch resumes")
  }
  return res.json()
}

export async function getResumeById(token: string, id: string) {
  const res = await fetch(`${API_URL}/resume/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch resume")
  }
  return res.json()
}


export async function updateResumeVersion(token: string, resumeId: string, versionId: string, data: any) {
  const res = await fetch(`${API_URL}/resume/${resumeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to update resume version")
  }
  return res.json()

}

export const createNewResumeVersion = async(token: string, resumeId: string, versionData: any, newTitle: string):Promise<ResumeVersionResponse> => {
  const res = await fetch(`${API_URL}/resume/${resumeId}/versions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ ...versionData, _id: undefined, title: newTitle })
  });
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create new resume version');
    }
    throw new Error(res.statusText || 'Failed to create new resume version');
  }
  return res.json()
}

export async function deleteResume(token: string, id: string) {

  const res = await fetch(`${API_URL}/resume/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete resume');
    }
    throw new Error(res.statusText || 'Failed to delete resume');
  }
}