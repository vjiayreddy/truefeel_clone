import React from "react";
import { FaTimes } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { MdAddToHomeScreen } from "react-icons/md";
import { ImArrowUp } from "react-icons/im";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToMobileChrome(props: Props) {
  const { closePrompt, doNotShowAgain } = props;

  return (
    <div>
      <ImArrowUp />
      <div>
        <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
          <FaTimes className="text-2xl" />
        </button>
        <p className="text-lg">
          For the best experience, we recommend installing the Valley Trader app
          to your home screen!
        </p>
        <div className="flex gap-2 items-center text-lg">
          <p>Click the</p>
          <HiDotsVertical className="text-4xl" />
          <p>icon</p>
        </div>
        <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
          <p>Scroll down and then click:</p>
          <div className="bg-zinc-50 flex justify-between items-center w-full px-4 py-2 rounded-lg text-zinc-900">
            <MdAddToHomeScreen className="text-2xl" />
            <p>Add to Home Screen</p>
          </div>
        </div>
        <button className="border-2 p-1" onClick={doNotShowAgain}>
          Don&apos;t show again
        </button>
      </div>
    </div>
  );
}
