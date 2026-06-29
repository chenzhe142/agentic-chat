/* eslint-disable @typescript-eslint/no-explicit-any */
export type Role = 'user' | 'assistant';

export type Message = {
  id: string;
  role: Role;
  content: string;
  timestampMsec: number;
  isStreaming?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};

type TokenStreamEvent = {
  type: 'token';
  payload: any;
};

type ToolStreamEvent = {
  type: 'tool';
  payload: any;
};

type DoneStreamEvent = {
  type: 'done';
  payload: any;
};

type ErrorStreamEvent = {
  type: 'error';
  payload: any;
};

export type StreamEvent =
  | TokenStreamEvent
  | ToolStreamEvent
  | DoneStreamEvent
  | ErrorStreamEvent;

export type StreamEventType = StreamEvent['type'];

export type ChatRequest = {
  input: string;
};
