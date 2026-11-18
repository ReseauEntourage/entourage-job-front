export interface MessagingSuggestionItem {
  name: string;
  // Absent (default): fills the editor with `message`. 'open-ai-assistant':
  // opens the AI assistant panel and launches a response proposal instead —
  // `message` is unused (empty) for this action.
  action?: 'open-ai-assistant';
  message: string;
}
