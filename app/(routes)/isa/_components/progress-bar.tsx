import { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const targetPercentage = (current / total) * 100;
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedPercentage(targetPercentage);
    }, 50);

    return () => clearTimeout(timeout);
  }, [targetPercentage]);

  return (
    <div className='w-full relative h-3 rounded-full bg-gray-200 overflow-hidden'>
      <div
        className='h-full bg-primary transition-all duration-700 ease-out'
        style={{ width: `${animatedPercentage}%` }}
      />
      <div className='absolute right-0 -top-6 text-xs text-gray-500 font-medium'>
        {current}/{total}
      </div>
    </div>
  );
}
