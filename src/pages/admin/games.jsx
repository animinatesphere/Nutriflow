import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const ADMIN_EMAIL = 'youradmin@email.com'; // Change this to your admin email

const AdminGames = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Check auth on mount
  useEffect(() => {
    const getUser = async () => {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) setAuthError(error.message);
      setUser(data?.user || null);
      setAuthLoading(false);
    };
    getUser();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser());
    return () => listener?.subscription?.unsubscribe();
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    });
    if (error) setAuthError(error.message);
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    skill: '',
    difficulty: '',
    duration: '',
    is_premium: false,
    is_new: false,
    time_limit: 300,
    steps: [] // JSON array of steps
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all games
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    const fetchGames = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setGames(data || []);
      setLoading(false);
    };
    fetchGames();
  }, [user]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = { ...form, steps: JSON.stringify(form.steps) };
    let result;
    if (editingId) {
      result = await supabase.from('games').update(payload).eq('id', editingId);
    } else {
      result = await supabase.from('games').insert(payload);
    }
    if (result.error) setError(result.error.message);
    else window.location.reload();
  };

  // Handle edit
  const handleEdit = (game) => {
    setEditingId(game.id);
    setForm({ ...game, steps: game.steps ? JSON.parse(game.steps) : [] });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this game?')) return;
    await supabase.from('games').delete().eq('id', id);
    window.location.reload();
  };

  if (authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) {
    return (
      <div className="max-w-sm mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        {authError && <div className="text-red-500 mb-2">{authError}</div>}
        <form onSubmit={handleLogin} className="space-y-3">
          <input name="email" type="email" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full p-2 border rounded" required />
          <input name="password" type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" className="w-full p-2 border rounded" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
        </form>
      </div>
    );
  }
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You are not authorized to access this page.</p>
        <button onClick={handleLogout} className="text-blue-600 underline">Logout</button>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin: Manage Games</h1>
        <button onClick={handleLogout} className="text-blue-600 underline">Logout</button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded mb-8">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" />
        <input name="skill" value={form.skill} onChange={handleChange} placeholder="Skill" className="w-full p-2 border rounded" />
        <input name="difficulty" value={form.difficulty} onChange={handleChange} placeholder="Difficulty" className="w-full p-2 border rounded" />
        <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" className="w-full p-2 border rounded" />
        <input name="time_limit" type="number" value={form.time_limit} onChange={handleChange} placeholder="Time Limit (seconds)" className="w-full p-2 border rounded" />
        <label className="block"><input type="checkbox" name="is_premium" checked={form.is_premium} onChange={handleChange} /> Premium</label>
        <label className="block"><input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} /> New</label>
        {/* Steps JSON input (for now, raw JSON) */}
        <textarea name="steps" value={JSON.stringify(form.steps, null, 2)} onChange={e => setForm(f => ({ ...f, steps: JSON.parse(e.target.value || '[]') }))} placeholder="Steps (JSON)" className="w-full p-2 border rounded" rows={4} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'} Game</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', image: '', category: '', skill: '', difficulty: '', duration: '', is_premium: false, is_new: false, time_limit: 300, steps: [] }); }} className="ml-2 px-4 py-2 rounded border">Cancel</button>}
      </form>
      <h2 className="text-xl font-semibold mb-2">All Games</h2>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Skill</th>
              <th className="p-2 border">Difficulty</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game.id}>
                <td className="p-2 border">{game.title}</td>
                <td className="p-2 border">{game.skill}</td>
                <td className="p-2 border">{game.difficulty}</td>
                <td className="p-2 border">
                  <button onClick={() => handleEdit(game)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(game.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminGames;
