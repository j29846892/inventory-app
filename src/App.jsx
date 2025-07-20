import { useState } from 'react';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState(null);

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

  if (role === 'manager') {
    return <div className="p-6 text-xl">👩‍💼 歡迎主管！這裡會顯示報表（之後建）</div>;
  }
  if (role === 'employee') {
  const categories = ['飲料', '冷凍品', '乾貨', '即食食品', '耗材'];
  const [selectedCategory, setSelectedCategory] = useState(null);

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
      <h2 className="text-xl font-bold mb-4">{selectedCategory} 盤點畫面（下一步我會幫你實作）</h2>
      <button className="text-blue-600 underline" onClick={() => setSelectedCategory(null)}>← 返回分類</button>
    </div>
  );
}


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
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
