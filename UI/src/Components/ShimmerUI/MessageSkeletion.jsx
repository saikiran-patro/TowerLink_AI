import React from 'react';

const MessageSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Incoming Message Skeleton (Left Side) */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse"></div>
        <div className="flex flex-col gap-2">
          <div className="w-52 h-4 rounded-lg bg-zinc-700 animate-pulse"></div>
          <div className="w-32 h-4 rounded-lg bg-zinc-700 animate-pulse"></div>
        </div>
      </div>

      {/* Outgoing Message Skeleton (Right Side) */}
      <div className="flex items-start justify-end gap-2">
        <div className="flex flex-col gap-2 items-end">
          <div className="w-40 h-4 rounded-lg bg-zinc-700 animate-pulse"></div>
          <div className="w-24 h-4 rounded-lg bg-zinc-700 animate-pulse"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse"></div>
      </div>

      {/* Another Incoming Skeleton (Left Side) */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse"></div>
        <div className="flex flex-col gap-2">
          <div className="w-48 h-4 rounded-lg bg-zinc-700 animate-pulse"></div>
          <div className="w-28 h-4 rounded-lg bg-zinc-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
