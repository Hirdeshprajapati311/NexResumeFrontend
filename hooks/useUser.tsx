import  { useEffect, useState } from 'react';

interface User{
  _id: string;
  username: string;
  email: string;
  hasResume: boolean;
  seenOnboarding: boolean;
}

const useUser = () => {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true);
  const [token,setToken] = useState<string | null>(null)

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null)
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")

    if (!storedToken) {
      setLoading(false);
      return
    }

    setToken(storedToken);

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization:`Bearer ${storedToken}`,
      }
    }).then((res) => res.json()).then((data) => {
      if (data.error) {
        setUser(null)
      } else {
        setUser(data);
      }
      setLoading(false);
    }).catch(() => {
      setUser(null);
      setLoading(false)
    })
  },[])

  return {user, loading, logout,setUser,setLoading,token}
}

export default useUser;
