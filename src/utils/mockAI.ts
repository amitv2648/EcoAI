export function generateBotResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
  
    if (lowerMessage.includes('tree') || lowerMessage.includes('forest')) {
      return "Trees are amazing! They absorb CO2, produce oxygen, prevent soil erosion, and provide homes for countless animals. A single mature tree can absorb about 48 pounds of CO2 per year. Planting and protecting trees is one of the best things we can do for our planet!";
    }
  
    if (lowerMessage.includes('recycle') || lowerMessage.includes('recycling')) {
      return "Recycling is super important! It reduces waste in landfills, conserves natural resources, and saves energy. Remember the 3 R's: Reduce (use less), Reuse (find new uses), and Recycle (process materials). Always check your local recycling guidelines to recycle correctly!";
    }
  
    if (lowerMessage.includes('ocean') || lowerMessage.includes('sea') || lowerMessage.includes('marine')) {
      return "Oceans cover 70% of Earth and produce over half of the world's oxygen! They regulate our climate, provide food for billions, and are home to incredible biodiversity. We can protect oceans by reducing plastic use, supporting sustainable fishing, and preventing pollution.";
    }
  
    if (lowerMessage.includes('climate change') || lowerMessage.includes('global warming')) {
      return "Climate change is the long-term shift in Earth's temperatures and weather patterns. It's mainly caused by burning fossil fuels, which releases greenhouse gases. We can help by using renewable energy, reducing waste, and making eco-friendly choices. Every action counts!";
    }
  
    if (lowerMessage.includes('energy') || lowerMessage.includes('solar') || lowerMessage.includes('wind')) {
      return "Renewable energy like solar and wind power is clean, sustainable, and increasingly affordable! Unlike fossil fuels, renewables don't produce harmful emissions. You can support clean energy by choosing renewable energy providers or even installing solar panels if possible.";
    }
  
    if (lowerMessage.includes('animal') || lowerMessage.includes('wildlife') || lowerMessage.includes('species')) {
      return "Wildlife is incredibly important for healthy ecosystems! Every species plays a role. We can protect animals by preserving habitats, supporting conservation organizations, reducing pollution, and making sustainable choices in what we buy and eat.";
    }
  
    if (lowerMessage.includes('water') || lowerMessage.includes('conservation')) {
      return "Water is precious! Only 3% of Earth's water is fresh, and much of that is frozen. We can conserve water by taking shorter showers, fixing leaks, turning off taps when not in use, and using water-efficient appliances. Every drop saved matters!";
    }
  
    if (lowerMessage.includes('plastic') || lowerMessage.includes('pollution')) {
      return "Plastic pollution is a huge problem, but we can make a difference! Use reusable bags, bottles, and containers. Avoid single-use plastics when possible. Participate in clean-up events. And remember, refusing plastic is even better than recycling it!";
    }
  
    if (lowerMessage.includes('carbon footprint') || lowerMessage.includes('emissions')) {
      return "Your carbon footprint is the total greenhouse gases you produce. You can reduce it by walking/biking more, eating less meat, using less energy at home, buying local products, and choosing sustainable options. Small changes add up to big impacts!";
    }
  
    if (lowerMessage.includes('bee') || lowerMessage.includes('pollinator')) {
      return "Bees and other pollinators are essential! They pollinate 75% of our crops. Help them by planting native flowers, avoiding pesticides, providing water sources, and supporting organic farming. A bee-friendly garden benefits the whole ecosystem!";
    }
  
    if (lowerMessage.includes('food waste') || lowerMessage.includes('composting')) {
      return "Food waste is a big problem, but composting helps! Composting turns food scraps into nutrient-rich soil. Plan meals, store food properly, and use leftovers creatively. If you can't compost at home, check for local composting programs!";
    }
  
    if (lowerMessage.includes('electric') || lowerMessage.includes('car') || lowerMessage.includes('transport')) {
      return "Transportation creates about 27% of greenhouse gas emissions. Consider walking, biking, or using public transit when possible. If you need a car, electric vehicles produce zero direct emissions and are becoming more affordable!";
    }
  
    if (lowerMessage.includes('help') || lowerMessage.includes('what can i do') || lowerMessage.includes('start')) {
      return "Great question! Start small: reduce single-use plastics, conserve water and energy, eat more plant-based meals, use public transport or bike, recycle properly, and learn more about environmental issues. Share what you learn with others. Every positive action helps!";
    }
  
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm GreenBot, your friendly environmental assistant. Ask me anything about climate change, nature, pollution, sustainability, or how you can help protect our planet. What would you like to learn about?";
    }
  
    return "That's an interesting question! While I'm a simple bot with limited knowledge, I encourage you to explore environmental topics like climate change, renewable energy, wildlife conservation, recycling, ocean protection, and sustainable living. What specific area interests you most?";
  }
  