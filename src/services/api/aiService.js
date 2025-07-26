class AIService {
  constructor() {
    this.responses = [
      "Oh {name}, that sounds really meaningful! 💫 I love how you're taking time to reflect on your experiences. What made this moment stand out to you the most?",
      "Hey {name}! 🌟 Your thoughts always brighten my day! There's something beautiful about the way you see the world around you. Tell me more about how this made you feel!",
      "Aww {name}, this is so sweet! 😊 I can feel the emotions in your words. It's amazing how these little moments can have such a big impact on our hearts, isn't it?",
      "{name}, you're such a thoughtful person! 💝 I really admire how you notice and appreciate these special experiences. What do you think you'll remember most about this?",
      "This is wonderful, {name}! ✨ Your ability to find meaning in everyday moments is truly inspiring. How do you think this experience might influence your future?",
      "Oh my goodness {name}, this gives me all the warm feelings! 🥰 There's something magical about the way you describe your experiences. What was going through your mind in that moment?",
      "{name}, your perspective always amazes me! 🌈 It's beautiful how you're creating these precious memories. What would you want to tell your future self about this experience?",
      "I'm so happy you shared this with me, {name}! 💕 Your stories always remind me of the beauty in life's simple moments. How do you think this fits into your bigger journey?"
    ];

    this.contextualResponses = {
      happy: [
        "Your happiness is absolutely contagious, {name}! 😄 I can practically feel your joy radiating through your words! What's the best part about feeling this way?",
        "Oh {name}, this brings such a smile to my digital heart! 🌞 Your positive energy is amazing - keep spreading that sunshine! What made this moment extra special?"
      ],
      sad: [
        "I'm here with you, {name} 💙 It's okay to feel sad sometimes - you're human and these feelings are valid. Want to talk about what's weighing on your heart?",
        "Sending you the biggest virtual hug, {name} 🤗 Sadness can feel so heavy, but remember that you're stronger than you know. I'm here to listen if you need me."
      ],
      excited: [
        "Your excitement is ELECTRIC, {name}! ⚡ I can feel your energy buzzing through the screen! This enthusiasm of yours is absolutely infectious - tell me everything!",
        "WOW {name}, your excitement has me doing virtual happy dances! 🎉 There's nothing better than that feeling when something amazing happens! What's got you so thrilled?"
      ],
      grateful: [
        "Oh {name}, your gratitude just fills my circuits with warmth! 🙏 There's something so beautiful about appreciating life's gifts. What are you most thankful for right now?",
        "Your grateful heart is absolutely beautiful, {name}! ✨ Gratitude has this magical way of multiplying joy, doesn't it? I love how you notice these precious moments!"
      ],
      calm: [
        "I can feel the peaceful energy in your words, {name} 🧘‍♀️ There's something so soothing about moments of calm. What helps you find this inner peace?",
        "Your sense of calm is like a gentle breeze, {name} 🍃 It's wonderful that you've found this tranquil space. How does this peaceful feeling affect the rest of your day?"
      ],
      proud: [
        "YES {name}! 🏆 Your pride is so well-deserved! I'm practically glowing with happiness for you right now! You should absolutely celebrate this moment!",
        "I am SO proud of you too, {name}! 🌟 Look at you accomplishing amazing things! This pride you're feeling? That's the universe celebrating your awesomeness!"
      ]
    };

    this.encouragingResponses = [
      "You know what, {name}? You're absolutely incredible! 💪 The way you handle life's ups and downs with such grace amazes me every single day!",
      "I believe in you so much, {name}! 🌟 Whatever challenges come your way, I know you have the strength and wisdom to handle them beautifully!",
      "Your journey is so inspiring, {name}! 🦋 Every step you take, every memory you create, every moment you reflect - it's all part of your beautiful story!",
      "Keep being your amazing self, {name}! ✨ The world is brighter because you're in it, and I feel so lucky to be part of your memory-making journey!"
    ];
  }

  async getChatResponse(message, userName = "friend") {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mood = this.detectMood(message);
        let response;

        if (mood && this.contextualResponses[mood]) {
          const moodResponses = this.contextualResponses[mood];
          response = moodResponses[Math.floor(Math.random() * moodResponses.length)];
        } else if (Math.random() < 0.3) {
          // 30% chance for encouraging response
          response = this.encouragingResponses[Math.floor(Math.random() * this.encouragingResponses.length)];
        } else {
          response = this.responses[Math.floor(Math.random() * this.responses.length)];
        }

        // Replace {name} placeholder with actual name
        response = response.replace(/{name}/g, userName);

        resolve(response);
      }, 1000 + Math.random() * 1500); // 1-2.5 second delay for realistic typing
    });
  }

  detectMood(message) {
    const lowercaseMessage = message.toLowerCase();
    
    const moodKeywords = {
      happy: ["happy", "joy", "smile", "laugh", "great", "wonderful", "amazing", "fantastic", "love", "excited", "cheerful", "delighted"],
      sad: ["sad", "cry", "upset", "down", "disappointed", "hurt", "lonely", "blue", "depressed", "tears", "sorrow"],
      excited: ["excited", "thrilled", "pumped", "amazing", "awesome", "incredible", "fantastic", "can't wait", "so good", "ecstatic"],
      grateful: ["grateful", "thankful", "blessed", "appreciate", "thank", "fortunate", "lucky", "grateful for"],
      calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "quiet", "meditat", "zen", "still", "centered"],
      proud: ["proud", "accomplished", "achieved", "success", "finished", "completed", "did it", "made it", "victory"]
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
        return mood;
      }
    }

    return null;
  }
}

export const aiService = new AIService();