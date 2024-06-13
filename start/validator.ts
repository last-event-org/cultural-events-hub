import vine, { SimpleMessagesProvider } from '@vinejs/vine'

// TODO: THIS FILE IS NOT USED YET BUT WILL BE FOR i18n TRANSLATIONS
// https://docs.adonisjs.com/guides/digging-deeper/i18n#translating-validation-messages

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',
  'email': 'The value is not a valid email address',

  'title.required': 'Please provide a title for the event',
})
