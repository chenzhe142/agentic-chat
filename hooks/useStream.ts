import { useCallback, useRef, useState } from 'react';

import { ChatRequest, StreamEvent } from '@/types';

const apiServer = 'http://localhost:8001';

export const useStream = () => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (
      req: ChatRequest,
      onRequestSent: () => void,
      onStreamEvent: (obj: StreamEvent) => void
    ) => {
      abortRef.current = new AbortController();
      setIsStreaming(true);

      const url = `${apiServer}/chat/stream`;
      try {
        onRequestSent();

        const response = await fetch(url, {
          signal: abortRef.current.signal,
          headers: { 'content-type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(req),
        });

        if (!response.body) {
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer: string = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split('\n\n');
          buffer = frames.pop() ?? ''; // keep incomplete chunk in buffer

          for (const f of frames) {
            const line = f.trim();
            if (!line.startsWith('data:')) {
              continue;
            }
            onStreamEvent(JSON.parse(line.slice(5).trim()) as StreamEvent);
          }
        }

        // - first attempt, will break when split chunk is not a complete json string

        // for await (const chunk of response.body) {
        //   if (abortRef.current.signal.aborted) {
        //     throw abortRef.current.signal.reason;
        //   }
        //   let content = new TextDecoder().decode(chunk, { stream: true });

        //   // trim "data: "
        //   if (content.startsWith('data:')) {
        //     content = content.substring('data:'.length);
        //   }
        //   const obj = JSON.parse(content);
        //   onStreamEvent({
        //     type: obj['type'],
        //     payload: obj.payload,
        //   });
        // }
      } catch (e) {
        console.error(`unable to fetch ${url} error: ${e}`);
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { start, stop, isStreaming };
};
