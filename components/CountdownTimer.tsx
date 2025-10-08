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
    <div className="flex gap-1 sm:gap-2">
      <div className="bg-amber-400 text-black rounded-md p-2 sm:p-4 w-16 h-20 sm:w-24 sm:h-28 flex justify-center items-center">
        <span className="text-5xl sm:text-7xl font-bold tabular-nums">{value[0]}</span>
      </div>
      <div className="bg-amber-400 text-black rounded-md p-2 sm:p-4 w-16 h-20 sm:w-24 sm:h-28 flex justify-center items-center">
        <span className="text-5xl sm:text-7xl font-bold tabular-nums">{value[1]}</span>
      </div>
    </div>
    <span className="text-sm sm:text-base uppercase tracking-wider mt-3 text-white">{label}</span>
  </div>
);

const Colon: React.FC = () => (
  <div className="flex flex-col items-center pt-4 sm:pt-6 px-1 sm:px-0">
    <span className="text-5xl sm:text-7xl font-bold text-white">:</span>
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
    <div className="text-center text-white w-full max-w-4xl">
      <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-wider mb-10 sm:mb-12 text-white">Black November</h2>
      <div className="flex justify-center items-start gap-1 sm:gap-3">
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