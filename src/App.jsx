import { useState, useEffect } from 'react';

const API_URL = 'https://script.google.com/macros/s/AKfycbyKFw45pPWKejSzLQCuEfojivSG9qbB42uAbl4u7UV-rkhuZTgztfxglUbT4aqUYuPL/exec';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});

  const users = {
    manager: '123456',
    employee1: 'abcd',
    employee2: 'abcd'
  };

  const today = new Date().toISOString().slice(0, 10);

  const login = () => {
    if (!user || !pass) return setError('請輸入帳號與密碼');
    if (users[user] && users[user] === pass) {
      setRole(user === 'manager' ? 'manager' : 'employee');
      setError('');
    } else setError('帳號或密碼錯誤');
  };

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}?sheet=商品清單`);
    const json = await res.json();
    const filtered = json.data.filter(i => i.分類 === selectedCategory);
    setItems(filtered);
    const initialForm = {};
    filtered.forEach(i => {
      initialForm[i.品項] = { 數量: '', 有效日期: '', 進貨日期: today };
    });
    setFormData(initialForm);
  };

  const submitData = async () => {
    const entries = Object.entries(formData).map(([name, data]) => ({
      分類: selectedCategory,
      品項: name,
      數量: data.數量,
      有效日期: data.有效日期,
      進貨日期: data.進貨日期,
      員工: user,
      日期: today
    }));
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ sheet: '盤點紀錄', data: entries }),
    });
    alert('✅ 已送出');
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (selectedCategory) fetchItems();
  }, [selectedCategory]);

  if (role === 'manager') return <div className="p-6">👩‍💼 歡迎主管！報表功能即將加入</div>;

  if (role === 'employee') {
    const categories = ['飲料', '冷凍品', '乾貨', '即食食品', '耗材'];
    if (!selectedCategory) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">請選擇分類進行盤點：</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className="p-4 bg-gray-200 rounded hover:bg-blue-200">{cat}</button>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">分類：{selectedCategory}</h2>
        {items.map(item => (
          <div key={item.品項} className="mb-3 border p-2 rounded bg-white">
            <div className="font-bold mb-1">{item.品項}</div>
            <input type="number" placeholder="盤點數量" value={formData[item.品項]?.數量 || ''} onChange={e => setFormData(prev => ({ ...prev, [item.品項]: { ...prev[item.品項], 數量: e.target.value } }))} />
            <input type="date" placeholder="有效日期" value={formData[item.品項]?.有效日期 || ''} onChange={e => setFormData(prev => ({ ...prev, [item.品項]: { ...prev[item.品項], 有效日期: e.target.value } }))} />
            <input type="date" value={formData[item.品項]?.進貨日期 || today} onChange={e => setFormData(prev => ({ ...prev, [item.品項]: { ...prev[item.品項], 進貨日期: e.target.value } }))} />
          </div>
        ))}
        <div className="flex gap-4 mt-4">
          <button onClick={() => setSelectedCategory(null)} className="px-4 py-2 bg-gray-300 rounded">← 返回分類</button>
          <button onClick={submitData} className="px-4 py-2 bg-green-500 text-white rounded">📤 送出盤點資料</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">盤點系統登入</h2>
        <input type="text" placeholder="帳號" className="border w-full px-3 py-2 rounded mb-3" value={user} onChange={e => setUser(e.target.value)} />
        <input type="password" placeholder="密碼" className="border w-full px-3 py-2 rounded mb-3" value={pass} onChange={e => setPass(e.target.value)} />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button onClick={login} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded">登入</button>
      </div>
    </div>
  );
}
