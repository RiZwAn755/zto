// Predefined prompts and custom responses
export const predefinedPrompts = [
  {
    "id": 1,
    "title": "What is Zonal Talent?",
    "prompt": "What is Zonal Talent?",
    "customResponse": "Zonal Talent is an educational platform that helps students prepare for competitive exams and provides personalized learning experiences through AI-powered doubt assistance.",
    "useCustomResponse": true
  },
  {
    "id": 2,
    "title": "How to register for exams?",
    "prompt": "How do I register for exams?",
    "customResponse": "To register for exams:\n1. Go to the registration section\n2. Fill out the required form\n3. Upload necessary documents\n4. Pay the registration fee\n5. You'll receive a confirmation email",
    "useCustomResponse": true
  },
  {
    "id": 3,
    "title": "Contact information",
    "prompt": "What is your contact information?",
    "customResponse": "You can contact us at:\n📧 Email: support@zonaltalent.com\n📞 Phone: +91-6386137862\n⏰ Hours: Monday-sunday, 9 AM - 6 PM",
    "useCustomResponse": true
  },
  {
    "id": 4,
    "title": "Study tips for competitive exams",
    "prompt": "Give me study tips for competitive exams",
    "customResponse": "Here are some effective study tips:\n\n📚 **Create a Study Schedule**\n- Plan your daily study routine\n- Allocate time for each subject\n- Include breaks and revision time\n\n🎯 **Focus on Weak Areas**\n- Identify your weak subjects\n- Spend more time on difficult topics\n- Practice regularly\n\n📝 **Practice with Mock Tests**\n- Take regular mock tests\n- Analyze your performance\n- Work on time management\n\n💡 **Use Active Learning**\n- Take notes while studying\n- Explain concepts to others\n- Use mind maps and diagrams\n\n🔄 **Regular Revision**\n- Review previous topics weekly\n- Create summary notes\n- Use flashcards for quick revision",
    "useCustomResponse": true
  },
  {
    "id": 5,
    "title": "Ask AI for general help",
    "prompt": "I need help with a question",
    "customResponse": null,
    "useCustomResponse": false
  }
];

// Function to check if a user question matches any predefined prompt
export function findMatchingPrompt(userQuestion) {
  const normalizedUserQuestion = userQuestion.toLowerCase().trim();
  
  for (const prompt of predefinedPrompts) {
    const normalizedPrompt = prompt.prompt.toLowerCase().trim();
    
    // Check for exact match or if user question contains the prompt keywords
    if (normalizedUserQuestion === normalizedPrompt || 
        normalizedUserQuestion.includes(normalizedPrompt) ||
        normalizedPrompt.includes(normalizedUserQuestion)) {
      return prompt;
    }
  }
  
  return null;
}

// Function to get all available prompt titles for the frontend
export function getPromptTitles() {
  return predefinedPrompts.map(prompt => ({
    id: prompt.id,
    title: prompt.title,
    prompt: prompt.prompt
  }));
}
