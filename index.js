import { fromEvent, partition, scan, skipUntil, take, takeWhile, tap, timeInterval } from "rxjs";
import { gameArea, moveRandom, setDotText, updateResults, updateError, endGame, init, isPlaying } from "./utils";

const NUM_TRIES = 10;

const onHit = (state, timeInterval, index) => {
  return index ? [...state, timeInterval.interval] : state;
};

const [hit$, miss$] = partition(fromEvent(gameArea, "click"), (e) =>
  e.target.classList.contains("dot")
);

hit$
  .pipe(
    tap(moveRandom),
    timeInterval(),
    scan(onHit, []),
    take(NUM_TRIES + 1))
  .subscribe({
    next: (next) => {
      updateResults(next);
      setDotText(NUM_TRIES - next.length);
    },
    error: (error) => { },
    complete: () => {
      endGame();
    },
  });

miss$
  .pipe(
    skipUntil(hit$),
    scan((err) => ++err, 0),
    takeWhile(() => isPlaying)
  )
  .subscribe({ next: (err) => updateError(err) });

init();
