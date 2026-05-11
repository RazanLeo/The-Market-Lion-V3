import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = { title: "إدارة المستخدمين" };

const seed = [
  { id: 1, name: "رزان توفيق", email: "razan.tawfiq@gmail.com", plan: "OWNER", status: "ACTIVE", capital: 10000 },
  { id: 2, name: "Trader A", email: "a@ex.com", plan: "INDIVIDUAL", status: "ACTIVE", capital: 5000 },
  { id: 3, name: "Trader B", email: "b@ex.com", plan: "INSTITUTION", status: "PAUSED", capital: 250000 },
];
export default function Users() {
  return (
    <>
      <Header variant="app"/>
      <main className="max-w-6xl mx-auto px-5 py-8">
        <h1 className="font-display gold-text text-2xl mb-4">إدارة المستخدمين</h1>
        <div className="gold-card p-4 overflow-x-auto">
          <table className="tbl">
            <thead><tr><th>#</th><th>الاسم</th><th>البريد</th><th>الباقة</th><th>الحالة</th><th>رأس المال</th><th>إجراءات</th></tr></thead>
            <tbody>
              {seed.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td>
                  <td><span className="chip-tier-A">{u.plan}</span></td>
                  <td><span className={u.status==="ACTIVE"?"chip-buy":"chip-neutral"}>{u.status}</span></td>
                  <td className="text-gold-400">${u.capital.toLocaleString()}</td>
                  <td className="space-x-2 space-x-reverse">
                    <button className="btn-ghost text-xs">إيقاف</button>
                    <button className="btn-ghost text-xs">تعديل</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer/>
    </>
  );
}
