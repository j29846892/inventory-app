import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [today] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  });

  const users = {
    manager: '123456',
    employee1: 'abcd',
    employee2: 'abcd'
  };

  const login = () => {
    if (!user || !pass) {
      setError('請輸入帳號與密碼');
      return;
    }
    if (users[user] && users[user] === pass) {
      setRole(user === 'manager' ? 'manager' : 'employee');
      setError('');
    } else {
      setError('帳號或密碼錯誤');
    }
  };

  useEffect(() => {
    if (!selectedCategory) return;
    fetch(
      `https://script.google.com/macros/s/AKfycbyKFw45pPWKejSzLQCuEfojivSG9qbB42uAbl4u7UV-rkhuZTgztfxglUbT4aqUYuPL/exec?sheet=商品清單`
    )
      .then(res => res.json())
      .then(json => {
        const all = json.data || [];
        const filtered = all.filter(item => item.分類 === selectedCategory);
        const withInputs = filtered.map(item => ({
          ...item,
          數量: '',
          有效日期: '',
          進貨日期: today,
          員工: user,
          盤點日期: today
        }));
        setItems(withInputs);
      })
      .catch(() => {
        alert("無法連線到 Google Sheets");
      });
  }, [selectedCategory]);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const submitData = () => {
    const payload = items.map(item => ({
      分類: item.分類,
      品項: item.品項,
      數量: item.數量,
      有效日期: item.有效日期,
      進貨日期: item.進貨日期,
      員工: user,
      盤點日期: today
    }));

    fetch(
      'https://script.google.com/macros/s/AKfycbyKFw45pPWKejSzLQCuEfojivSG9qbB42uAbl4u7UV-rkhuZTgztfxglUbT4aqUYuPL/exec',
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => res.text())
      .then(() => {
        alert("✅ 已成功送出盤點資料！");
        setSelectedCategory(null);
      });
  };

  if (role === 'manager') {
    return (
      <div className="p-6 text-xl">
        👩‍💼 歡迎主管！這裡會顯示報表（下一步實作）
      </div>
    );
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
                onClick={() => setSelectedCategory(cat)}
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
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">分類：{selectedCategory}</h2>

        {items.map((item, i) => (
          <div key={i} className="mb-4 p-3 bg-white rounded shadow">
            <h3 className="font-bold">{item.品項}（{item.單位}）</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <input
                type="number"
                placeholder="盤點數量"
                className="border px-2 py-1 rounded"
                value={item.數量}
                onChange={(e) => handleChange(i, '數量', e.target.value)}
              />
              <input
                type="text"
                placeholder="有效日期 (YYYYMMDD)"
                className="border px-2 py-1 rounded"
                value={item.有效日期}
                onChange={(e) => handleChange(i, '有效日期', e.target.value)}
              />
              <input
                type="text"
                value={today}
                readOnly
                className="border px-2 py-1 rounded bg-gray-100"
              />
            </div>
          </div>
        ))}

        <button
          className="mr-2 px-4 py-2 border rounded"
          onClick={() => setSelectedCategory(null)}
        >
          ← 返回分類
        </button>
        <button
          className="px-4 py-2 border rounded bg-blue-600 text-white"
          onClick={submitData}
        >
          📤 送出盤點資料
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
