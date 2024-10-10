import React from 'react';

export function ChatBubbleSkeleton({ isSender }: { isSender: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 ${isSender ? 'justify-end' : 'justify-start'} animate-pulse`}>
      {!isSender && (
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      )}
      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border border-gray-200 bg-gray-100 rounded-xl ${
          isSender ? 'rounded-tr-none rounded-br-xl' : 'rounded-tl-none rounded-bl-xl'
        }`}
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {isSender ? null : (
            <div className="h-3 w-16 bg-gray-300 rounded-md"></div>
          )}
          <div className="h-3 w-12 bg-gray-300 rounded-md"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded-md my-2.5"></div>
        <div className="h-4 w-16 bg-gray-300 rounded-md"></div>
      </div>
      {isSender && (
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      )}
    </div>
  );
}

export default function ChatboxSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Sender message 1 */}
      <ChatBubbleSkeleton isSender={true} />
      {/* Sender message 2 */}
      <ChatBubbleSkeleton isSender={true} />
      {/* Receiver message */}
      <ChatBubbleSkeleton isSender={false} />
    </div>
  );
}