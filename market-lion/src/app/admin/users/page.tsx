"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, UserPlus, Edit2, Power, Link2 } from "lucide-react";


const INITIAL_USERS = [
  { id: 1, name: "Razan Tawfiq",  email: "razan.tawfiq@gmail.com", plan: "OWNER",       status: "ACTIVE",    broker: "Exness",      mt5: "260842468", capital: 10000,  country: "SA", note: "Owner — full access no subscription" },
  { id: 2, name: "Trader-218",  email: "trader218@gmail.com",    plan: "INDIVIDUAL",  status: "ACTIVE",    broker: "Exness",      mt5: "12345678",  capital: 5000,   country: "AE", note: "" },
  { id: 3, name: "Trader-091",  email: "user091@gmail.com",      plan: "INDIVIDUAL",  status: "ACTIVE",    broker: "Capital.com", mt5: "55512345",  capital: 8500,   country: "EG", note: "" },
  { id: 4, name: "Trader-302",  email: "ahmad302@hotmail.com",   plan: "INSTITUTION", status: "ACTIVE",    broker: "IC Markets",  mt5: "98765432",  capital: 250000, country: "KW", note: "" },
  { id: 5, name: "Trader-741",  email: "fatima741@yahoo.com",    plan: "INDIVIDUAL",  status: "PAUSED",    broker: "Exness",      mt5: "21458790",  capital: 3000,   country: "JO", note: "" },
  { id: 6, name: "Trader-118",  email: "user118@outlook.com",    plan: "INDIVIDUAL",  status: "CANCELLED", broker: "FBS",         mt5: "32109876",  capital: 0,      country: "MA", note: "" },
];

const PLAN_CHIP: Record<string,string> = {
  OWNER: "chip-tier-S", ADMIN: "chip-tier-S",
  INSTITUTION: "chip-tier-A", INDIVIDUAL: "chip-tier-B", FREE: "chip-neutral",
};
const STATUS_CHIP: Record<string,string> = {
  ACTIVE: "chip-buy", PAUSED: "chip-neutral", CANCELLED: "chip-sell",
};

type User = typeof INITIAL_USERS[0];
type FormState = Partial<User & { password: string }>;

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", email: "", plan: "INDIVIDUAL", status: "ACTIVE",
    broker: "Exness", mt5: "", capital: 0, country: "SA", note: "", password: "",
  });
  const [saved, setSaved] = useState(false);

  function handleToggle(id: number) {
    setUsers(us => us.map(u => u.id === id
      ? { ...u, status: u.status === "ACTIVE" ? "PAUSED" : "ACTIVE" }
      : u));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const newUser: User = {
      id: Math.max(...users.map(u=>u.id)) + 1,
      name:    form.name    || "New user",
      email:   form.email   || "",
      plan:    (form.plan   || "INDIVIDUAL") as any,
      status:  (form.status || "ACTIVE")     as any,
      broker:  form.broker  || "Exness",
      mt5:     form.mt5     || "—",
      capital: Number(form.capital) || 0,
      country: form.country || "SA",
      note:    form.note    || "",
    };
    setUsers(us => [...us, newUser]);
    setShowAdd(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ name:"",email:"",plan:"INDIVIDUAL",status:"ACTIVE",broker:"Exness",mt5:"",capital:0,country:"SA",note:"",password:"" });
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-5 py-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <Link href="/admin" className="text-gold-400 text-sm inline-flex items-center gap-1 mb-2"><ChevronLeft size={14}/> Admin Panel</Link>
            <h1 className="font-display text-3xl gold-text">User Management</h1>
            <p className="text-zinc-400 text-sm mt-1">Total: {users.length} users • Active: {users.filter(u=>u.status==="ACTIVE").length}</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="btn-gold flex items-center gap-2">
            <UserPlus size={16}/> Add new user
          </button>
        </div>

        {saved && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
            ✅ User added successfully
          </div>
        )}

        {/* Add User Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="gold-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-gold-400 font-bold text-xl mb-4 flex items-center gap-2">
                <UserPlus size={20}/> Add new user
              </h2>
              <form onSubmit={handleAdd} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">Full name *</label>
                    <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold-500/50"
                      placeholder="Razan Tawfiq"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">Email *</label>
                    <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold-500/50"
                      placeholder="user@example.com"/>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Plan</label>
                    <select value={form.plan} onChange={e=>setForm(f=>({...f,plan:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none">
                      <option value="FREE">Free (no subscription)</option>
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="INSTITUTION">Institution</option>
                      <option value="ADMIN">Admin</option>
                      <option value="OWNER">Owner</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Status</label>
                    <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none">
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Broker</label>
                    <input value={form.broker} onChange={e=>setForm(f=>({...f,broker:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="Exness"/>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Capital.com login / Exness account ID</label>
                    <input value={form.mt5} onChange={e=>setForm(f=>({...f,mt5:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none font-mono"
                      placeholder="260842468"/>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Capital ($)</label>
                    <input type="number" value={form.capital} onChange={e=>setForm(f=>({...f,capital:Number(e.target.value)}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="10000"/>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Country</label>
                    <input value={form.country} onChange={e=>setForm(f=>({...f,country:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="SA"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">Note (optional)</label>
                    <input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="e.g. family no-subscription, or demo user"/>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn-gold flex-1">Add user</button>
                  <button type="button" onClick={()=>setShowAdd(false)} className="btn-ghost">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="gold-card p-4 overflow-x-auto">
          <table className="tbl text-sm">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Email</th><th>Plan</th><th>Status</th>
                <th>Broker</th><th>Account</th><th>Capital</th><th>Country</th><th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="text-zinc-400">{u.id}</td>
                  <td className="font-semibold">{u.name}</td>
                  <td className="text-zinc-400 text-xs">{u.email}</td>
                  <td><span className={`chip ${PLAN_CHIP[u.plan] || "chip-neutral"}`}>{u.plan}</span></td>
                  <td><span className={`chip ${STATUS_CHIP[u.status] || "chip-neutral"}`}>{u.status}</span></td>
                  <td className="text-zinc-300">{u.broker}</td>
                  <td className="text-zinc-400 font-mono text-xs">{u.mt5}</td>
                  <td className="text-gold-400 font-mono">${Number(u.capital).toLocaleString()}</td>
                  <td className="text-zinc-400">{u.country}</td>
                  <td className="text-zinc-500 text-xs max-w-[120px] truncate">{u.note}</td>
                  <td className="whitespace-nowrap">
                    <div className="flex gap-1">
                      <button onClick={() => handleToggle(u.id)}
                        className={`btn-ghost text-xs flex items-center gap-1 ${u.status === "ACTIVE" ? "text-red-400" : "text-green-400"}`}>
                        <Power size={12}/>
                        {u.status === "ACTIVE" ? "Pause" : "Activate"}
                      </button>
                      <button className="btn-ghost text-xs flex items-center gap-1">
                        <Link2 size={12}/> Broker
                      </button>
                      <button className="btn-ghost text-xs flex items-center gap-1">
                        <Edit2 size={12}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info boxes */}
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="gold-card p-4">
            <h3 className="text-gold-400 font-bold mb-2">🆓 Free plan (no subscription)</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              To add family/friends without a subscription, pick the <strong className="text-zinc-300">"Free"</strong> plan when adding.
              They get full platform access without payment.
            </p>
          </div>
          <div className="gold-card p-4">
            <h3 className="text-gold-400 font-bold mb-2">💳 Paid subscription</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Users who subscribe via the pricing page are auto-added with Individual or Institution plan
              and appear here after payment.
            </p>
          </div>
          <div className="gold-card p-4">
            <h3 className="text-gold-400 font-bold mb-2">🔗 Link broker account</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              After adding the user, click the broker button to link their account
              with broker info, account number, and password.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
