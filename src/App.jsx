import { useState } from 'react';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [logged, setLogged] = useState(false);

  function login() {
    if (!user || !pass) return alert('請輸入帳號密碼');
    setLogged(true);
  }

  function submit() {
    // 這裡填入你提供的 Apps Script 網址
    const url = 'https://script.google.com/macros/s/AKfycbyKFw45pPWKejSzLQCuEfojivSG9qbB42uAbl4u7UV-rkhuZTgztfxglUbT4aqUYuPL/exec';
    const today = new Date().toISOString().split('T')[0];
    const payload = [
      {
        date: today,
        user,
        item: '測試商品',
        actualQty: 5,
        expiryDate: today,
        stockInQty: 2
      }
    ];
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ records: payload }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(r => alert(r.status === 'success' ? '送出成功' : '失敗'));
  }

  if (!logged) {
    return (
      <div>
        <input placeholder="帳號" onChange={e => setUser(e.target.value)} />
        <input type="password" placeholder="密碼" onChange={e => setPass(e.target.value)} />
        <button onClick={login}>登入</button>
      </div>
    );
  }

  return (
    <div>
      <h2>歡迎，{user}</h2>
      <button onClick={submit}>測試送出盤點</button>
    </div>
  );
}
