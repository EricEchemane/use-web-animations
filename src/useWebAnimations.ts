import { RefObject, useState, useRef, useCallback, useEffect } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";

import useLatest from "./useLatest";

export const polyfillErr =
  "> 💡use-web-animations: please enable polyfill to use this hook. See https://github.com/wellyshen/use-web-animations#disable-polyfill";
export const eventErr = (type: string): string =>
  `> 💡use-web-animations: the browser doesn't support ${type} event, please use onUpdate to monitor the animation's state instead. See https://github.com/wellyshen/use-web-animations#basic-usage`;

type Keyframes = Keyframe[] | PropertyIndexedKeyframes;
type PlayState = string | null;
interface AnimConf {
  id?: string;
  playbackRate?: number;
  autoPlay?: boolean;
  timing?: number | KeyframeAnimationOptions;
}
interface Animate {
  (args: AnimConf & { keyframes: Keyframes }): void;
}
interface Callback {
  (event: {
    playState: PlayState;
    animate: Animate;
    animation: Animation;
  }): void;
}
export interface Options<T> extends AnimConf {
  ref?: RefObject<T>;
  keyframes?: Keyframes;
  onReady?: Callback;
  onUpdate?: Callback;
  onFinish?: Callback;
}
interface Return<T> {
  ref: RefObject<T>;
  readonly playState: PlayState;
  readonly getAnimation: () => Animation;
  readonly animate: Animate;
}

const useWebAnimations = <T extends HTMLElement>({
  ref: refOpt,
  id,
  playbackRate,
  autoPlay,
  keyframes,
  timing,
  onReady,
  onUpdate,
  onFinish,
}: Options<T> = {}): Return<T> => {
  const [playState, setPlayState] = useState<PlayState>(null);
  const animRef = useRef<Animation>();
  const prevPendingRef = useRef<boolean>();
  const prevPlayStateRef = useRef<string>();
  const onReadyRef = useLatest<Callback>(onReady);
  const onUpdateRef = useLatest<Callback>(onUpdate);
  const onFinishRef = useLatest<Callback>(onFinish);
  const refVar = useRef<T>(null);
  const ref = refOpt || refVar;

  const getAnimation = useCallback(() => animRef.current, []);

  const animate: Animate = useCallback(
    (args) => {
      if (!ref.current || !args.keyframes) return;
      if (!ref.current.animate) {
        console.error(polyfillErr);
        return;
      }

      animRef.current = ref.current.animate(args.keyframes, args.timing);
      const { current: anim } = animRef;

      if (args.autoPlay === false) anim.pause();
      if (args.id) anim.id = args.id;
      if (args.playbackRate) anim.playbackRate = args.playbackRate;

      if (onReadyRef.current) {
        if (anim.ready) {
          anim.ready.then((animation) => {
            onReadyRef.current({
              playState: animation.playState,
              animate,
              animation,
            });
          });
        } else {
          console.error(eventErr("onReady"));
        }
      }

      if (onFinishRef.current) {
        if (anim.finished) {
          anim.finished.then((animation) => {
            onFinishRef.current({
              playState: animation.playState,
              animate,
              animation,
            });
          });
        } else {
          console.error(eventErr("onFinish"));
        }
      }

      prevPlayStateRef.current = undefined;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref]
  );

  useDeepCompareEffect(() => {
    animate({ id, playbackRate, autoPlay, keyframes, timing });
  }, [id, playbackRate, autoPlay, keyframes, timing, animate]);

  useEffect(() => {
    const update = () => {
      const animation = getAnimation();

      if (animation) {
        const { pending, playState: curPlayState } = animation;

        if (prevPlayStateRef.current !== curPlayState)
          setPlayState(curPlayState);

        if (
          onUpdateRef.current &&
          (prevPendingRef.current !== pending ||
            prevPlayStateRef.current !== curPlayState ||
            curPlayState === "running")
        )
          onUpdateRef.current({ playState: curPlayState, animate, animation });

        prevPendingRef.current = pending;
        prevPlayStateRef.current = curPlayState;
      }

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAnimation, animate]);

  return { ref, playState, getAnimation, animate };
};

export default useWebAnimations;
