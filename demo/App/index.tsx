import React, { FC, MouseEvent, ChangeEvent } from "react";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import {
  root,
  container,
  title,
  subtitle,
  mask,
  block,
  text,
  heart,
  btn,
  slider,
} from "./styles";
import useWebAnimations from "../../src";

const App: FC = () => {
  const { ref: blockRef, getAnimation: getBlockAnim } = useWebAnimations<
    HTMLDivElement
  >({
    autoPlay: false,
    keyframes: { width: ["0", "100%", "0"], left: ["0", "0", "100%"] },
    timing: {
      duration: 2000,
      fill: "forwards",
      easing: "cubic-bezier(0.74, 0.06, 0.4, 0.92)",
    },
  });
  const { ref: textRef, getAnimation: getTextAnim } = useWebAnimations<
    HTMLDivElement
  >({
    autoPlay: false,
    keyframes: { opacity: ["0", "1"] },
    timing: {
      delay: 1600,
      duration: 1000,
      fill: "forwards",
    },
  });
  const { ref: heartRef, getAnimation: getHeartAnim } = useWebAnimations<
    HTMLDivElement
  >({
    autoPlay: false,
    keyframes: {
      transform: ["translate3d(0, 0, 0)", "translate3d(0, -100%, 0)"],
    },
    timing: {
      delay: 2000,
      duration: 250,
      fill: "forwards",
      easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
  });

  const handlePlayback = (e: MouseEvent) => {
    const method = (e.target as HTMLButtonElement).id;

    (getBlockAnim() as any)[method]();
    (getTextAnim() as any)[method]();
    (getHeartAnim() as any)[method]();
  };

  const handleSeek = (e: ChangeEvent) => {
    const value = parseInt((e.target as HTMLInputElement).value, 10);

    const blockAnim = getBlockAnim();
    const blockTiming = blockAnim.effect.getTiming();
    if (blockAnim.playState === "running") blockAnim.pause();
    blockAnim.currentTime = ((blockTiming.duration as number) / 100) * value;

    const textAnim = getTextAnim();
    const textTiming = textAnim.effect.getTiming();
    if (textAnim.playState === "running") textAnim.pause();
    textAnim.currentTime =
      ((textTiming.delay + (textTiming.duration as number)) / 100) * value;

    const heartAnim = getHeartAnim();
    const heartTiming = heartAnim.effect.getTiming();
    if (heartAnim.playState === "running") heartAnim.pause();
    heartAnim.currentTime =
      ((heartTiming.delay + (heartTiming.duration as number)) / 100) * value;
  };

  return (
    <>
      <Global
        styles={css`
          ${normalize}
          ${root}
        `}
      />
      <div css={container}>
        <GitHubCorner url="https://github.com/wellyshen/use-web-animations" />
        <h1 css={title}>useWebAnimations</h1>
        <p css={subtitle}>
          React hook for highly-performant and manipulable animations using Web
          Animations API.
        </p>
        <div css={mask}>
          <div css={block} ref={blockRef} />
          <span css={text} ref={textRef}>
            BLACK LIVES MATTER
          </span>
          <span css={heart} ref={heartRef}>
            ❤
          </span>
        </div>
        <div>
          <div>
            <button id="play" css={btn} type="button" onClick={handlePlayback}>
              PLAY
            </button>
            <button id="pause" css={btn} type="button" onClick={handlePlayback}>
              PAUSE
            </button>
            <button
              id="reverse"
              css={btn}
              type="button"
              onClick={handlePlayback}
            >
              REVERSE
            </button>
            <button
              id="finish"
              css={btn}
              type="button"
              onClick={handlePlayback}
            >
              FINISH
            </button>
          </div>
          <input
            css={slider}
            type="range"
            defaultValue="0"
            onChange={handleSeek}
          />
        </div>
      </div>
    </>
  );
};

export default App;
