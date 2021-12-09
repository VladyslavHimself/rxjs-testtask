import React, { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

const App = () => {
  const stopwatchTemplate = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    isInProgress: false,
  };

  const [timerData, setTimerData] = useState(stopwatchTemplate);
  const [Obs, setObs] = useState(null);

  useEffect(() => {

    const MAXIMUM_SECONDS_COUNT = 60;
    const MAXIMUM_MINUTES_COUNT = 60;
    const FULL_DAY_CYCLE = 24;
    if (timerData.seconds === MAXIMUM_SECONDS_COUNT) {
      setTimerData(prevData => {
        return {
          ...prevData,
          minutes: prevData.minutes + 1,
          seconds: 0
        };
      });
    }

    if (timerData.minutes === MAXIMUM_MINUTES_COUNT) {
      setTimerData((prevData) => {
        return {
          ...prevData,
          hours: prevData.hours + 1,
          minutes: 0
        };
      });
    }

    if (timerData.hours === FULL_DAY_CYCLE) {
      setTimerData((prevData) => {
        return {
          ...prevData,
          seconds: 0,
          minutes: 0,
          hours: 0,
        };
      });
    }
  }, [timerData.seconds, timerData.minutes, timerData.hours]);


  const observable = new Observable(observer => {
    let subscribeId = setInterval(() => observer.next(1), 1000);
    return {
      unsubscribe() {
        clearInterval(subscribeId);
      }
    };
  });

  const incrementSeconds = (value) => {
    setTimerData((prevData) => {
      return {
        ...prevData,
        seconds: prevData.seconds + value,
      };
    });
  }

  const runTimer = () => {
    setTimerData((prevData) => {
      return {
        ...prevData,
        isInProgress: true
      };
    });
    const ObsHandler = observable.subscribe({
      next: value => incrementSeconds(value),
    });
    setObs(ObsHandler);
  }

  const stopTimer = () => {
    setTimerData({ ...stopwatchTemplate });
    Obs.unsubscribe();
  }

  // start timer button event
  const onToggleTimerHandler = () => {
    !timerData.isInProgress ? runTimer() : stopTimer();
  };

  // pause timer button event
  const onPauseTimerHandler = () => {
    if (!timerData.isInProgress)
      runTimer();
    if (timerData.isInProgress) {
      setTimerData((prevData) => {
        return { ...prevData, isInProgress: false, };
      });
      Obs.unsubscribe();
    };
  };

  // reset timer button event
  const onResetTimerHandler = () => {
    setTimerData(prevData => {
      return {
        ...prevData,
        seconds: 0,
        minutes: 0,
        hours: 0,
      };
    });
  };

  const seconds = timerData.seconds;
  const minutes = timerData.minutes;
  const hours = timerData.hours;

  return (
    <div>
      <h1>
        <span>{timerData.hours < 10 ? `0${hours}` : hours}</span>:
        <span>{timerData.minutes < 10 ? `0${minutes}` : minutes}</span>:
        <span>{timerData.seconds < 10 ? `0${seconds}` : seconds}</span>
      </h1>
      <button onClick={onToggleTimerHandler}>
        {(timerData.isInProgress) ? 'stop' : 'start'}
      </button>
      <button onDoubleClick={onPauseTimerHandler}>
        Pause
      </button>
      <button onClick={onResetTimerHandler}>
        Reset
      </button>
    </div>);
}

export default App;
