import styles from './App.module.scss';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [counter, setCounter] = useState(1);
  const [fizzBuzzArray, setFizzBuzzArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [limit, setLimit] = useState(100);
  const displayRef = useRef(null);

  useEffect(() => {
    let fizzBuzzInterval;

    if (isRunning && !isPaused) {
      fizzBuzzInterval = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 500);
    }

    if (counter > limit) {
      clearInterval(fizzBuzzInterval);
    }

    return () => clearInterval(fizzBuzzInterval);
  }, [isRunning, isPaused, counter, limit]);

  useEffect(() => {
    let text = '';
    let className = styles.gridItem; 
    let imageSrc = null;

    if (counter % 3 === 0 && counter % 5 === 0) {
      text = 'FizzBuzz';
      className = `${styles.gridItem} ${styles.fizzbuzz}`;
      imageSrc = '/img/fizz-buzz.png'; 
    } else if (counter % 3 === 0) {
      text = 'Fizz';
      className = `${styles.gridItem} ${styles.fizz}`;
      imageSrc = '/img/fizz.png'; 
    } else if (counter % 5 === 0) {
      text = 'Buzz';
      className = `${styles.gridItem} ${styles.buzz}`;
      imageSrc = '/img/buzz.png'; 
    } else {
      text = counter.toString();
    }

    if (isRunning && !isPaused && counter <= limit) {
      setFizzBuzzArray((prevArray) => [
        ...prevArray,
        { text, className, imageSrc }
      ]);

      setTimeout(() => {
        setFizzBuzzArray((prevArray) => {
          const newArray = [...prevArray];
          newArray[newArray.length - 1].className += ` ${styles.visible}`;
          return newArray;
        });
      }, 100);
    }
  }, [counter, isRunning, isPaused, limit]);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [fizzBuzzArray]);

  const handleStartStop = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCounter(1);
    setFizzBuzzArray([]);
  };

  const handleLimitChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setLimit("");
    } else {
      const parsedValue = parseInt(value, 10);
      setLimit(parsedValue > 0 ? parsedValue : 100);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cont}>
        <div className={`${isRunning ? styles.displayGrid : styles.display}`} ref={displayRef}>
          {!isRunning && (
            <div className={styles.inputContainer}>
              <h1>Fizz Buzz</h1>
              <label>
                Limit:
                <input
                  type="number"
                  placeholder="Enter FizzBuzz limit"
                  value={limit || ''}
                  onChange={handleLimitChange}
                  className={styles.input}
                  min="1"
                />
              </label>
            </div>
          )}
          {fizzBuzzArray.map((item, index) => (
            <div key={index} className={item.className}>
              {item.imageSrc ? (
                <img src={item.imageSrc} alt={item.text} className={styles.image} />
              ) : (
                item.text
              )}
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.reset} onClick={handleReset}>
            Reset
          </button>
          <button className={styles.send} onClick={handleStartStop}>
            {isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
