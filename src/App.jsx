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
    return <div className="p-6 text-xl">🧑‍🔧 歡迎員工！這裡是盤點功能（之後建）</div>;
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
