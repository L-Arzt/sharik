'use client';

import { useState } from 'react';

export default function TestBotPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBot = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get-chat-id');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to test bot' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Тест Telegram Бота</h1>
      
      <button 
        onClick={testBot}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Проверяем...' : 'Проверить бота'}
      </button>

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Результат:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 