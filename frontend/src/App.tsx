import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    fetch('http://localhost:3000/hello')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching message:', error))
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  console.log(session?.user?.email)
  console.log(session?.user?.user_metadata)

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
  };

  const signUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  if (!session) {
    return (
      <>
        {/* <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />; */}
        <button type='button' onClick={signUp}>Sign in with Google</button>
      </>
    )
  }
  else {
    return (
      <div>
        <h2>Welcome, {session?.user?.user_metadata.name}</h2>
        <p>Email: {session?.user?.email}</p>
        <p>server message from hello route: {message}</p>
        <button type='button' onClick={signOut}>Sign out</button>
      </div>
    )
  }
}