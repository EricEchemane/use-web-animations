import React, { FC, useRef } from "react";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import { root, container, title, subtitle } from "./styles";
import useWebAnimations from "../../src";

const App: FC = () => {
  // const ref = useRef();

  const {
    ref,
    animation,
    play,
    pause,
    reverse,
    finish,
    cancel,
  } = useWebAnimations<HTMLDivElement>({
    keyframes: [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
    timing: { duration: 5000, fill: "forwards" },
  });

  console.log("LGO ===> animation: ", animation);

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
        <p css={subtitle}>React hook for Web Animations API.</p>
        <div>
          <button
            onClick={() => {
              play();
            }}
            type="button"
          >
            Play
          </button>
          <button
            onClick={() => {
              pause();
            }}
            type="button"
          >
            Pause
          </button>
          <button
            onClick={() => {
              reverse();
            }}
            type="button"
          >
            Reverse
          </button>
          <button
            onClick={() => {
              finish();
            }}
            type="button"
          >
            Finish
          </button>
          <button
            onClick={() => {
              cancel();
            }}
            type="button"
          >
            Cancel
          </button>
        </div>
        <div
          style={{
            marginTop: "5rem",
            width: "100px",
            height: "100px",
            background: "#000",
          }}
          ref={ref}
        />
      </div>
    </>
  );
};

export default App;
