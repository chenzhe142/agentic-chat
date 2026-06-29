'use client';

import {
  ChangeEventHandler,
  FC,
  SubmitEventHandler,
  useCallback,
  useState,
} from 'react';

import { useStream } from '@/hooks/useStream';
import { Message, StreamEvent } from '@/types';

type Props = {
  id: string;
};

export const ChatView: FC<Props> = ({ id }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const { start, stop, isStreaming } = useStream();

  const onUserTyping: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (
    e
  ) => {
    setUserInput(e.target.value);
  };

  const handleSend: SubmitEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
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

      // once post request fires, append user message

      const modelMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestampMsec: Date.now(),
      };

      await start(
        { input: trimmedUserInput },
        () => {
          // use functional updater: https://react.dev/reference/react/useState#setstate
          setMessages((prev) => [...prev, message]);
          setUserInput('');
          setMessages((prev) => [...prev, modelMessage]);
        },
        (event: StreamEvent) => {
          if (event.type !== 'token') {
            return;
          }
          // typewriter effect - need to use setState to trigger page re-rendering
          setMessages((prev) =>
            prev.map((m) =>
              m.id === modelMessage.id
                ? { ...m, content: m.content + event.payload }
                : m
            )
          );
        }
      );
    },
    [start, userInput]
  );

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
        {isStreaming ? (
          <button type="button" onClick={stop}>
            Stop
          </button>
        ) : (
          <button disabled={!userInput.trim()}>Send</button>
        )}
      </form>
    </div>
  );
};
