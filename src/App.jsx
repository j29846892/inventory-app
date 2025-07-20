import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [dates, setDates] = useState({});
  const [message, setMessage] = useState('');

  const users = {
    manager: '123456',
    employee1: 'abcd',
    employee2: 'abcd'
  };

  const today = new Date().toISOString().slice(0, 10).replaceAll('-', '');

  const login = () => {
    if (!user || !pass) return setError('請輸入帳號與密碼');
    if (users[user] === pass) {
      setRole(user === 'manager' ? 'manager' : 'employee');
      setError('');
    } else {
      setError('帳號或密碼錯誤');
    }
  };

  const fetchItems = async (category) => {
    const url = `https://script.google.com/macros/s/AKfycbyKFw45pPWKejSzLQCuEfojivSG9qbB42uAbl4u7UV-rkhuZTgztfxglUbT4aqUYuPL/exec?sheet=商品清單`;
    const res = await fetch(url);
    const json = await res.json();
    const filtered = json.data.filter(row => row.分類 === category);
    setItems(filtered);
  };

  const handleSubmit = async () => {
    const payload = items.map(item => ({
      分類: item.分類,
      品項: item.品項,
      數量: quantities[item.品項] || '',
      有效日期: dates[item.品項] || '',
      進貨日期: today,
      員工: user,
      盤點日期: today
    })).filter(row => row.數量 !== '');

    if (payload.length === 0) {
      setMessage('請至少輸入一筆數量');
      return;
    }

    try {
      const res = await fetch('https://script.google.com/macros/s/AKfycbyKFw45pPWKejSzLQCuEfojivSG9qbB42uAbl4u7UV-rkhuZTgztfxglUbT4aqUYuPL/exec', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });
      const text = await res.text();
      if (text === 'Success') {
        setMessage('✅ 送出成功');
        setQuantities({});
        setDates({});
      } else {
        setMessage('❌ 發送失敗');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ 發送錯誤');
    }
  };

  if (role === 'manager') {
    return <div className="p-6 text-xl">👩‍💼 歡迎主管！報表功能待建置</div>;
  }

  if (role === 'employee') {
    const categories = ['飲料', '冷凍品', '乾貨', '即食食品', '耗材'];
    if (!selectedCategory) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">請選擇分類進行盤點：</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  fetchItems(cat);
                  setMessage('');
                }}
                className="p-4 bg-gray-200 rounded hover:bg-blue-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold mb-2">{selectedCategory} 盤點</h2>
        {items.map(item => (
          <div key={item.品項} className="bg-white p-3 rounded shadow">
            <div className="font-bold">{item.品項} ({item.單位})</div>
            <input
              type="number"
              placeholder="數量"
              value={quantities[item.品項] || ''}
              onChange={e => setQuantities(prev => ({ ...prev, [item.品項]: e.target.value }))}
              className="border p-1 mt-1 mr-2 w-24"
            />
            <input
              type="text"
              placeholder="有效日期 (YYYYMMDD)"
              value={dates[item.品項] || ''}
              onChange={e => setDates(prev => ({ ...prev, [item.品項]: e.target.value }))}
              className="border p-1 mt-1 w-40"
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          送出盤點資料
        </button>
        {message && <div className="text-red-500">{message}</div>}
        <button className="text-blue-600 underline" onClick={() => setSelectedCategory(null)}>
          ← 返回分類
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">盤點系統登入</h2>
        <input
          type="text"
          placeholder="帳號"
          className="border w-full px-3 py-2 rounded mb-3"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="密碼"
          className="border w-full px-3 py-2 rounded mb-3"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
        >
          登入
        </button>
      </div>
    </div>
  );
}
