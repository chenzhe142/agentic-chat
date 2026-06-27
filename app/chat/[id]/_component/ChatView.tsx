'use client';

import { ChangeEventHandler, FC, SubmitEventHandler, useState } from 'react';

import { Message } from '@/types';

type Props = {
  id: string;
};

export const ChatView: FC<Props> = ({ id }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  const onUserTyping: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (
    e
  ) => {
    setUserInput(e.target.value);
  };

  const handleSend: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const trimmedUserInput = userInput.trim();
    if (!trimmedUserInput) {
      return;
    }

    const message: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedUserInput,
      timestampMsec: Date.now(),
    };
    // use functional updater: https://react.dev/reference/react/useState#setstate
    setMessages((prev) => [...prev, message]);
    setUserInput('');
  };

  return (
    <div className="flex justify-between flex-col h-full items-center">
      <section className="flex-1 overflow-y-scroll">
        {messages.map((msg) => {
          return <p key={msg.id}>{msg.content}</p>;
        })}
      </section>

      <form onSubmit={handleSend}>
        <input
          placeholder="Hello! How can I help you today?"
          className="w-80"
          onChange={onUserTyping}
          value={userInput}
        />
        <button disabled={!userInput.trim()}>Send</button>
      </form>
    </div>
  );
};
