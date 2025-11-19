// API service for communicating with DPI backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Send a chat message to the DPI assistant
 * @param {string} message - The user's question
 * @param {Array} chatHistory - Previous chat messages
 * @param {string} persona - The selected persona (Default, Technical, etc.)
 * @returns {Promise<Object>} Chat response from the backend
 */
export async function sendChatMessage(message, chatHistory = [], persona = 'Default') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        chatHistoryArray: chatHistory,
        persona,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

/**
 * Send feedback for a message
 * @param {string} messageId - The ID of the message to provide feedback for
 * @param {'up' | 'down'} feedback - Whether the response was helpful
 * @returns {Promise<Object>} Feedback submission response
 */
export async function sendFeedback(messageId, feedback) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId,
        feedback,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
}
