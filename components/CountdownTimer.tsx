import React, { useState, useEffect } from 'react';

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
  let timeLeft = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  };

  if (difference > 0) {
    timeLeft = {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
      minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
    };
  }

  return timeLeft;
};

const TimeUnit: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="flex gap-1">
      <div className="bg-amber-400 text-black rounded-md p-2 w-12 h-16 sm:p-3 sm:w-20 sm:h-24 md:p-4 md:w-24 md:h-28 flex justify-center items-center">
        <span className="text-4xl sm:text-6xl md:text-7xl font-bold tabular-nums">{value[0]}</span>
      </div>
      <div className="bg-amber-400 text-black rounded-md p-2 w-12 h-16 sm:p-3 sm:w-20 sm:h-24 md:p-4 md:w-24 md:h-28 flex justify-center items-center">
        <span className="text-4xl sm:text-6xl md:text-7xl font-bold tabular-nums">{value[1]}</span>
      </div>
    </div>
    <span className="text-xs sm:text-sm md:text-base uppercase tracking-wider mt-3 text-white">{label}</span>
  </div>
);

const Colon: React.FC = () => (
  <div className="hidden sm:flex flex-col items-center justify-start h-16 sm:h-24 md:h-28 pt-2 sm:pt-3 md:pt-4">
    <span className="text-4xl sm:text-6xl md:text-7xl font-bold text-white">:</span>
  </div>
);

const CountdownTimer: React.FC = () => {
  const getTargetDate = () => {
      const now = new Date();
      // Countdown to the end of November. Target is Dec 1st.
      const target = new Date(now.getFullYear(), 11, 1); // Month is 0-indexed, so 11 is December.
      return target;
  }
  
  const [targetDate] = useState(getTargetDate());
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-center text-white w-full max-w-4xl px-2">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider mb-8 sm:mb-10 md:mb-12 text-white">Black November</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:flex sm:flex-row sm:justify-center sm:items-center sm:gap-2 md:gap-3">
        <TimeUnit value={timeLeft.days} label="Dias" />
        <Colon />
        <TimeUnit value={timeLeft.hours} label="Horas" />
        <Colon />
        <TimeUnit value={timeLeft.minutes} label="Minutos" />
        <Colon />
        <TimeUnit value={timeLeft.seconds} label="Segundos" />
      </div>
    </div>
  );
};

export default CountdownTimer;