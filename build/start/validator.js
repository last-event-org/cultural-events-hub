import vine, { SimpleMessagesProvider } from '@vinejs/vine';
vine.messagesProvider = new SimpleMessagesProvider({
    'required': 'The {{ field }} field is required',
    'string': 'The value of {{ field }} field must be a string',
    'email': 'The value is not a valid email address',
    'title.required': 'Please provide a title for the event',
});
//# sourceMappingURL=validator.js.map