import React, { useCallback, useState, useRef, useEffect } from "react";
import { MdOutlineLyrics } from "react-icons/md";
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";

interface LrcButtonProps {
  songLrc: string;
  currentSecond: number;
}

const LrcButton: React.FC<LrcButtonProps> = ({ songLrc, currentSecond }) => {
  const [isLrcOpen, setIsLrcOpen] = useState<boolean>(false);
  const lrcDivRef = useRef<HTMLDivElement>(null);

  // Find the div inside the lrcDivRef and give it a class of no-scrollbar
  useEffect(() => {
    if (!lrcDivRef.current) {
      return;
    }

    const lrcDiv = lrcDivRef.current;
    const lrcDivChild = lrcDiv.children[0];

    lrcDivChild.classList.add("no-scrollbar");
  }, [songLrc, isLrcOpen]);

  const toggleLrc = async () => {
    setIsLrcOpen(!isLrcOpen);
  };

  const lineRenderer = useCallback(
    ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
      <div
        className={` py-1 px-5 min-h-[10px] transition duration-[700ms] ${
          active
            ? "md:text-2xl text-lg text-white"
            : "md:text-md text-sm text-neutral-700"
        }`}
      >
        {content}
      </div>
    ),
    []
  );

  const { signal } = useRecoverAutoScrollImmediately();

  return (
    <div
      className="flex items-center relative
    "
    >
      <button
        onClick={toggleLrc}
        className="
                flex
                items-center
                justify-center
                hover:opacity-75
                transition
                p-2
                cursor-pointer
                "
      >
        <MdOutlineLyrics size={25} color="white" />
      </button>

      {isLrcOpen && (
        <div
          ref={lrcDivRef}
          className="
                        md:left-0
                        md:min-w-[400px]
                        absolute
                        top-[-340px]
                        left-[-200px]
                        w-[300px]
                        h-[300px]
                        max-h-[300px]
                        bg-black
                        rounded-2xl
                        flex
                        flex-col
                        "
        >
          <Lrc
            lrc={songLrc}
            currentMillisecond={currentSecond}
            lineRenderer={lineRenderer}
            verticalSpace
            recoverAutoScrollInterval={1000}
            recoverAutoScrollSingal={signal}
            style={{
              textAlign: "center",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LrcButton;
