exports.sendMessage = async (req, res) => {
  // Mesaj gönderme işlemi
  // req.body: { conversationId, content }
  // req.user.id: gönderen kullanıcı
  res.json({ message: 'Mesaj gönderildi (dummy)' });
};

exports.getMessages = async (req, res) => {
  // Belirli konuşmanın mesajlarını listeleme
  // req.params.conversationId
  res.json({ messages: [] });
};

exports.markAsRead = async (req, res) => {
  // Mesajı okundu olarak işaretleme
  // req.params.messageId
  res.json({ message: 'Mesaj okundu olarak işaretlendi (dummy)' });
};