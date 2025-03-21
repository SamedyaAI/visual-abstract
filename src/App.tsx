import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { VisualAbstract } from './components/VisualAbstract';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ThemeSelector } from './components/ThemeSelector';
import { generateVisualAbstract } from './utils/llm';
import type { VisualAbstractData } from './types/abstract';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [abstractData, setAbstractData] = useState<VisualAbstractData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('Modern Medical');

  const handleSubmit = async (summary: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateVisualAbstract(summary);
      setAbstractData(data);
    } catch (err) {
      setError('Failed to generate visual abstract. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAbstractData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Research Visual Abstract Generator</h1>
          <p className="text-center mt-2 text-blue-100">
            Transform your research summaries into beautiful visual abstracts instantly
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ThemeSelector 
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
          />
          
          <InputForm 
            onSubmit={handleSubmit} 
            onReset={handleReset}
            loading={loading} 
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {loading && (
            <div className="mt-8">
              <LoadingSpinner />
            </div>
          )}

          {abstractData && !loading && (
            <div className="mt-8">
              <VisualAbstract 
                data={abstractData} 
                theme={selectedTheme}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}