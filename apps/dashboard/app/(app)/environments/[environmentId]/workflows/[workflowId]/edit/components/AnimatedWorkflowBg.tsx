import { useState } from "react";

import { TWorkflow } from "@typeflowai/types/workflows";

interface AnimatedWorkflowBgProps {
  localWorkflow?: TWorkflow;
  handleBgChange: (bg: string, bgType: string) => void;
}

export default function AnimatedWorkflowBg({ localWorkflow, handleBgChange }: AnimatedWorkflowBgProps) {
  const [color, setColor] = useState(localWorkflow?.styling?.background?.bg || "#ffff");
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

  const animationFiles = {
    "/animated-bgs/Thumbnails/1_Thumb.mp4": "/animated-bgs/4K/1_4k.mp4",
    "/animated-bgs/Thumbnails/2_Thumb.mp4": "/animated-bgs/4K/2_4k.mp4",
    "/animated-bgs/Thumbnails/3_Thumb.mp4": "/animated-bgs/4K/3_4k.mp4",
    "/animated-bgs/Thumbnails/4_Thumb.mp4": "/animated-bgs/4K/4_4k.mp4",
    "/animated-bgs/Thumbnails/5_Thumb.mp4": "/animated-bgs/4K/5_4k.mp4",
    "/animated-bgs/Thumbnails/6_Thumb.mp4": "/animated-bgs/4K/6_4k.mp4",
    "/animated-bgs/Thumbnails/7_Thumb.mp4": "/animated-bgs/4K/7_4k.mp4",
    "/animated-bgs/Thumbnails/8_Thumb.mp4": "/animated-bgs/4K/8_4k.mp4",
    "/animated-bgs/Thumbnails/9_Thumb.mp4": "/animated-bgs/4K/9_4k.mp4",
    "/animated-bgs/Thumbnails/10_Thumb.mp4": "/animated-bgs/4K/10_4k.mp4",
    "/animated-bgs/Thumbnails/11_Thumb.mp4": "/animated-bgs/4K/11_4k.mp4",
    "/animated-bgs/Thumbnails/12_Thumb.mp4": "/animated-bgs/4K/12_4k.mp4",
    "/animated-bgs/Thumbnails/13_Thumb.mp4": "/animated-bgs/4K/13_4k.mp4",
    "/animated-bgs/Thumbnails/14_Thumb.mp4": "/animated-bgs/4K/14_4k.mp4",
    "/animated-bgs/Thumbnails/15_Thumb.mp4": "/animated-bgs/4K/15_4k.mp4",
    "/animated-bgs/Thumbnails/16_Thumb.mp4": "/animated-bgs/4K/16_4k.mp4",
    "/animated-bgs/Thumbnails/17_Thumb.mp4": "/animated-bgs/4K/17_4k.mp4",
    "/animated-bgs/Thumbnails/18_Thumb.mp4": "/animated-bgs/4K/18_4k.mp4",
    "/animated-bgs/Thumbnails/19_Thumb.mp4": "/animated-bgs/4K/19_4k.mp4",
    "/animated-bgs/Thumbnails/20_Thumb.mp4": "/animated-bgs/4K/20_4k.mp4",
    "/animated-bgs/Thumbnails/21_Thumb.mp4": "/animated-bgs/4K/21_4k.mp4",
    "/animated-bgs/Thumbnails/22_Thumb.mp4": "/animated-bgs/4K/22_4k.mp4",
    "/animated-bgs/Thumbnails/23_Thumb.mp4": "/animated-bgs/4K/23_4k.mp4",
    "/animated-bgs/Thumbnails/24_Thumb.mp4": "/animated-bgs/4K/24_4k.mp4",
    "/animated-bgs/Thumbnails/25_Thumb.mp4": "/animated-bgs/4K/25_4k.mp4",
    "/animated-bgs/Thumbnails/26_Thumb.mp4": "/animated-bgs/4K/26_4k.mp4",
    "/animated-bgs/Thumbnails/27_Thumb.mp4": "/animated-bgs/4K/27_4k.mp4",
    "/animated-bgs/Thumbnails/28_Thumb.mp4": "/animated-bgs/4K/28_4k.mp4",
    "/animated-bgs/Thumbnails/29_Thumb.mp4": "/animated-bgs/4K/29_4k.mp4",
    "/animated-bgs/Thumbnails/30_Thumb.mp4": "/animated-bgs/4K/30_4k.mp4",
  };

  const handleMouseEnter = (index: number) => {
    setHoveredVideo(index);
    playVideo(index);
  };

  const handleMouseLeave = (index: number) => {
    setHoveredVideo(null);
    pauseVideo(index);
  };

  // Function to play the video
  const playVideo = (index: number) => {
    const video = document.getElementById(`video-${index}`) as HTMLVideoElement;
    if (video) {
      video.play();
    }
  };

  // Function to pause the video
  const pauseVideo = (index: number) => {
    const video = document.getElementById(`video-${index}`) as HTMLVideoElement;
    if (video) {
      video.pause();
    }
  };

  const handleBg = (x: string) => {
    setColor(x);
    handleBgChange(x, "animation");
  };
  return (
    <div>
      <div className="mt-4 grid grid-cols-6 gap-4">
        {Object.keys(animationFiles).map((key, index) => {
          const value = animationFiles[key];
          return (
            <div
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => handleBg(value)}
              className="relative cursor-pointer overflow-hidden rounded-lg">
              <video
                disablePictureInPicture
                id={`video-${index}`}
                autoPlay={hoveredVideo === index}
                className="h-46 w-96 origin-center scale-105 transform">
                <source src={`${key}`} type="video/mp4" />
              </video>
              <input
                className="absolute right-2 top-2 h-4 w-4 rounded-sm bg-white "
                type="checkbox"
                checked={color === value}
                onChange={() => handleBg(value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
