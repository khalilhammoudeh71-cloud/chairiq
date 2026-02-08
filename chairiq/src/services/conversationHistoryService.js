/**
 * Conversation History Service
 * Manages patient Q&A conversation storage and retrieval using browser localStorage
 * Organizes conversations by procedure for easy revisiting throughout treatment plan
 */

const STORAGE_KEY = 'chairiq_conversation_history';
const MAX_CONVERSATIONS_PER_PROCEDURE = 50; // Limit to prevent excessive storage

/**
 * Gets all conversation history
 * @returns {Object} All conversations organized by procedure ID
 */
export function getAllConversations() {
  try {
    const stored = localStorage?.getItem(STORAGE_KEY);
    return stored ? JSON?.parse(stored) : {};
  } catch (error) {
    console?.error('Error loading conversation history:', error);
    return {};
  }
}

/**
 * Gets conversation history for a specific procedure
 * @param {string} procedureId - The procedure identifier
 * @returns {Array} Array of conversations for the procedure
 */
export function getConversationsByProcedure(procedureId) {
  const allConversations = getAllConversations();
  return allConversations?.[procedureId] || [];
}

/**
 * Saves a new conversation message
 * @param {string} procedureId - The procedure identifier
 * @param {Object} message - The message object {role, content, timestamp}
 * @param {string} conversationId - Optional conversation ID (creates new if not provided)
 * @returns {string} The conversation ID
 */
export function saveMessage(procedureId, message, conversationId = null) {
  try {
    const allConversations = getAllConversations();
    
    if (!allConversations?.[procedureId]) {
      allConversations[procedureId] = [];
    }

    const conversations = allConversations?.[procedureId];
    
    // Find or create conversation
    let conversation = conversationId
      ? conversations?.find(c => c?.id === conversationId)
      : null;

    if (!conversation) {
      // Create new conversation
      conversation = {
        id: `conv_${Date?.now()}_${Math?.random()?.toString(36)?.substr(2, 9)}`,
        procedureId,
        messages: [],
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        title: null // Will be set after first user message
      };
      conversations?.push(conversation);
    }

    // Add message to conversation
    conversation?.messages?.push({
      ...message,
      timestamp: message?.timestamp || new Date()?.toISOString()
    });
    
    conversation.updatedAt = new Date()?.toISOString();

    // Set conversation title from first user message
    if (!conversation?.title && message?.role === 'user') {
      conversation.title = message?.content?.substring(0, 50) + (message?.content?.length > 50 ? '...' : '');
    }

    // Limit conversations per procedure
    if (conversations?.length > MAX_CONVERSATIONS_PER_PROCEDURE) {
      conversations?.shift(); // Remove oldest conversation
    }

    allConversations[procedureId] = conversations;
    localStorage?.setItem(STORAGE_KEY, JSON?.stringify(allConversations));

    return conversation?.id;
  } catch (error) {
    console?.error('Error saving conversation:', error);
    return null;
  }
}

/**
 * Gets a specific conversation by ID
 * @param {string} procedureId - The procedure identifier
 * @param {string} conversationId - The conversation ID
 * @returns {Object|null} The conversation object or null if not found
 */
export function getConversation(procedureId, conversationId) {
  const conversations = getConversationsByProcedure(procedureId);
  return conversations?.find(c => c?.id === conversationId) || null;
}

/**
 * Deletes a conversation
 * @param {string} procedureId - The procedure identifier
 * @param {string} conversationId - The conversation ID to delete
 * @returns {boolean} Success status
 */
export function deleteConversation(procedureId, conversationId) {
  try {
    const allConversations = getAllConversations();
    
    if (allConversations?.[procedureId]) {
      allConversations[procedureId] = allConversations?.[procedureId]?.filter(
        c => c?.id !== conversationId
      );
      localStorage?.setItem(STORAGE_KEY, JSON?.stringify(allConversations));
      return true;
    }
    
    return false;
  } catch (error) {
    console?.error('Error deleting conversation:', error);
    return false;
  }
}

/**
 * Clears all conversation history
 * @returns {boolean} Success status
 */
export function clearAllConversations() {
  try {
    localStorage?.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console?.error('Error clearing conversations:', error);
    return false;
  }
}

/**
 * Exports conversation history as JSON
 * @param {string} procedureId - Optional procedure ID to export specific conversations
 * @returns {string} JSON string of conversations
 */
export function exportConversations(procedureId = null) {
  const conversations = procedureId
    ? { [procedureId]: getConversationsByProcedure(procedureId) }
    : getAllConversations();
    
  return JSON?.stringify(conversations, null, 2);
}

/**
 * Gets conversation statistics
 * @param {string} procedureId - Optional procedure ID for specific stats
 * @returns {Object} Statistics object
 */
export function getConversationStats(procedureId = null) {
  const conversations = procedureId
    ? getConversationsByProcedure(procedureId)
    : Object?.values(getAllConversations())?.flat();

  return {
    totalConversations: conversations?.length,
    totalMessages: conversations?.reduce((sum, c) => sum + (c?.messages?.length || 0), 0),
    oldestConversation: conversations?.length > 0
      ? new Date(Math?.min(...conversations?.map(c => new Date(c?.createdAt))))
      : null,
    newestConversation: conversations?.length > 0
      ? new Date(Math?.max(...conversations?.map(c => new Date(c?.updatedAt))))
      : null
  };
}