"use client"

import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function Home() {
  const [celExpression, setCelExpression] = useState("header.match('x-github-event', 'push') &&\nbody.commits.exists(commit,\n            commit.modified.exists(path, path.startsWith('service-pix-spi/')) ||\n            commit.added.exists(path, path.startsWith('service-pix-spi/')) ||\n            commit.removed.exists(path, path.startsWith('service-pix-spi/'))\n          )");
  const [httpRequest, setHttpRequest] = useState("POST /foo HTTP/1.1\nContent-Length: 29\nContent-Type: application/json\nX-Header: tacocat\n\n{\"test\": {\"nested\": \"value\"}}\n");
  const [result, setResult] = useState(null);

  const handleEvaluate = async () => {
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          celExpression,
          httpRequest
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error evaluating CEL:', error);
      setResult(error.message || 'An error occurred');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>CEL Playground</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>CEL Expression</h2>
          <Editor
            height="300px"
            defaultLanguage="javascript"
            value={celExpression}
            onChange={(value) => setCelExpression(value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2>HTTP Request</h2>
          <Editor
            height="300px"
            defaultLanguage="plaintext"
            value={httpRequest}
            onChange={(value) => setHttpRequest(value)}
          />
        </div>
      </div>
      <button onClick={handleEvaluate} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Evaluate
      </button>
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}