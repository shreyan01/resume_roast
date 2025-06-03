import { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { openCheckout } from '@/lib/lemon-squeezy';

interface ATSScoringProps {
  resumeText: string;
  jobDescription?: string;
}

export function ATSScoring({ resumeText, jobDescription }: ATSScoringProps) {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateScore = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/ats-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate ATS score');
      }

      const data = await response.json();
      setScore(data.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = () => {
    openCheckout();
  };

  if (!score) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Unlock ATS Score Analysis</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Get detailed insights into how your resume performs in ATS systems
          </p>
        </div>
        <Button
          onClick={handleUnlock}
          className="w-full"
          disabled={loading}
        >
          Unlock for $1
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">ATS Score</h3>
          <span className="text-2xl font-bold">{score}%</span>
        </div>
        <Progress value={score} className="h-2" />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Recommendations</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Optimize keywords based on job description</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Improve formatting for better readability</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Add relevant skills and certifications</span>
          </li>
        </ul>
      </div>

      <Button
        onClick={calculateScore}
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Calculating...' : 'Recalculate Score'}
      </Button>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
} 