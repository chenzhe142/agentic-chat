'use client';

import {
  ChangeEventHandler,
  FC,
  SubmitEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  const [userMsgId, setUserMsgId] = useState<string>('');
  const { start, stop, isStreaming } = useStream();

  const msgRefs = useRef<Map<string, HTMLElement>>(new Map());

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

      const uuid = crypto.randomUUID();
      const message: Message = {
        id: uuid,
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
          setUserMsgId(uuid);
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

  useEffect(() => {
    msgRefs.current
      .get(userMsgId)
      ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [messages, userMsgId]);

  const messageView = useMemo(() => {
    return messages.map(({ id, role, content }) => {
      if (role === 'assistant') {
        return (
          <div
            ref={(el) => {
              if (el) {
                msgRefs.current.set(id, el);
              } else {
                msgRefs.current.delete(id);
              }
            }}
            key={id}
            className="flex"
          >
            <div className="mt-8 mb-8">
              <p>{content}</p>
            </div>
          </div>
        );
      }

      return (
        <div
          ref={(el) => {
            if (el) {
              msgRefs.current.set(id, el);
            } else {
              msgRefs.current.delete(id);
            }
          }}
          key={id}
          className="flex justify-end"
        >
          <div className="bg-blue-300 rounded-lg p-2">
            <p>{content}</p>
          </div>
        </div>
      );
    });
  }, [messages]);

  return (
    <div className="flex justify-between flex-col h-full items-center">
      <section className="w-full max-w-3xl mx-auto mt-8 pr-8 overflow-y-auto subtle-scrollbar">
        {messageView}
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
