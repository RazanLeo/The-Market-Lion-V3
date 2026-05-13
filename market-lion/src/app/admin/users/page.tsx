"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, UserPlus, Edit2, Power, Link2 } from "lucide-react";


const INITIAL_USERS = [
  { id: 1, name: "رزان توفيق",  email: "razan.tawfiq@gmail.com", plan: "OWNER",       status: "ACTIVE",    broker: "Exness",      mt5: "260842468", capital: 10000,  country: "SA", note: "المالك — وصول كامل بلا اشتراك" },
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
      name:    form.name    || "مستخدم جديد",
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
            <Link href="/admin" className="text-gold-400 text-sm inline-flex items-center gap-1 mb-2"><ChevronLeft size={14}/> لوحة الإدارة</Link>
            <h1 className="font-display text-3xl gold-text">إدارة المستخدمين</h1>
            <p className="text-zinc-400 text-sm mt-1">إجمالي: {users.length} مستخدم • نشط: {users.filter(u=>u.status==="ACTIVE").length}</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="btn-gold flex items-center gap-2">
            <UserPlus size={16}/> إضافة مستخدم جديد
          </button>
        </div>

        {saved && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
            ✅ تم إضافة المستخدم بنجاح
          </div>
        )}

        {/* Add User Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="gold-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-gold-400 font-bold text-xl mb-4 flex items-center gap-2">
                <UserPlus size={20}/> إضافة مستخدم جديد
              </h2>
              <form onSubmit={handleAdd} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">الاسم الكامل *</label>
                    <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold-500/50"
                      placeholder="رزان توفيق"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">البريد الإلكتروني *</label>
                    <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold-500/50"
                      placeholder="user@example.com"/>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">الباقة</label>
                    <select value={form.plan} onChange={e=>setForm(f=>({...f,plan:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none">
                      <option value="FREE">مجاني — Free (بدون اشتراك)</option>
                      <option value="INDIVIDUAL">أفراد — Individual</option>
                      <option value="INSTITUTION">مؤسسات — Institution</option>
                      <option value="ADMIN">مدير — Admin</option>
                      <option value="OWNER">مالك — Owner</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">الحالة</label>
                    <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none">
                      <option value="ACTIVE">نشط — Active</option>
                      <option value="PAUSED">موقوف — Paused</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">الوسيط</label>
                    <input value={form.broker} onChange={e=>setForm(f=>({...f,broker:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="Exness"/>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">رقم حساب MT5</label>
                    <input value={form.mt5} onChange={e=>setForm(f=>({...f,mt5:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none font-mono"
                      placeholder="260842468"/>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">رأس المال ($)</label>
                    <input type="number" value={form.capital} onChange={e=>setForm(f=>({...f,capital:Number(e.target.value)}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="10000"/>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">الدولة</label>
                    <input value={form.country} onChange={e=>setForm(f=>({...f,country:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="SA"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">ملاحظة (اختياري)</label>
                    <input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}
                      className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="مثلاً: عائلة بدون اشتراك، أو مستخدم تجريبي"/>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn-gold flex-1">إضافة المستخدم</button>
                  <button type="button" onClick={()=>setShowAdd(false)} className="btn-ghost">إلغاء</button>
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
                <th>#</th><th>الاسم</th><th>البريد</th><th>الباقة</th><th>الحالة</th>
                <th>الوسيط</th><th>حساب MT5</th><th>رأس المال</th><th>الدولة</th><th>ملاحظة</th>
                <th>إجراءات</th>
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
                        {u.status === "ACTIVE" ? "إيقاف" : "تفعيل"}
                      </button>
                      <button className="btn-ghost text-xs flex items-center gap-1">
                        <Link2 size={12}/> MT5
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
            <h3 className="text-gold-400 font-bold mb-2">🆓 باقة Free (بدون اشتراك)</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              لإضافة أفراد العائلة والأصدقاء بدون اشتراك، اختر الباقة <strong className="text-zinc-300">"Free"</strong> عند الإضافة.
              يحصلون على نفس وصول المنصة الكاملة دون الحاجة للدفع.
            </p>
          </div>
          <div className="gold-card p-4">
            <h3 className="text-gold-400 font-bold mb-2">💳 الاشتراك المدفوع</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              المستخدمون الذين يشتركون من خلال صفحة الأسعار يُضافون تلقائيًا بباقة Individual أو Institution
              ويظهرون هنا بعد اكتمال الدفع.
            </p>
          </div>
          <div className="gold-card p-4">
            <h3 className="text-gold-400 font-bold mb-2">🔗 ربط حساب MT5</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              بعد إضافة المستخدم، اضغط على زر "MT5" لربط حساب الميتاتريدر الخاص به
              بمعلومات الوسيط ورقم الحساب وكلمة المرور.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
