export const formatMessage = (msg: string) => {
    if (typeof msg !== 'string') {
      return '';
    }
  
    // Escape HTML characters for code blocks
    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
  
    // Replace `code blocks` with <code>text</code> and escape HTML characters inside them
    let formattedMessage = msg.replace(/```(.*?)```/gs, (_match:string, p1:any) => `<code>${escapeHtml(p1)}</code>`);
  
    // Replace '\n' with <br /> for line breaks
    formattedMessage = formattedMessage.replace(/\n/g, '<br />');
    
    // Additional formatting (bold, italic, strikethrough, etc.)
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedMessage = formattedMessage.replace(/_(.*?)_/g, '<em>$1</em>');
    formattedMessage = formattedMessage.replace(/~(.*?)~/g, '<del>$1</del>');
  
    return formattedMessage;
  };