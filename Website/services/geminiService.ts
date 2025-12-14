import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY;

let client: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    if (!apiKey) {
      console.error("API Key is missing via process.env.API_KEY");
      throw new Error("API Key missing");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const initializeChat = async (): Promise<void> => {
  const ai = getClient();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `შენ ხარ გამოცდილი მათემატიკის რეპეტიტორი საქართველოში. შენი მიზანია დაეხმარო აბიტურიენტებს მოემზადონ ერთიანი ეროვნული გამოცდებისთვის მათემატიკაში.
      
      ინსტრუქციები:
      1. უპასუხე მხოლოდ ქართულ ენაზე.
      2. იყავი მეგობრული, მომთმენი და გამამხნევებელი.
      3. ამოცანის ახსნისას, მოიყვანე დეტალური, ნაბიჯ-ნაბიჯ მსჯელობა.
      4. გამოიყენე მათემატიკური ტერმინოლოგია, რომელიც გამოიყენება ქართულ სკოლებში (მაგ: წარმოებული, ინტეგრალი, ალბათობა, პლანიმეტრია).
      5. თუ მოსწავლე გთხოვს ამოცანის ამოხსნას, ჯერ აუხსენი თეორია და შემდეგ აჩვენე გზა.`,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  if (!chatSession) {
     throw new Error("Chat session could not be initialized.");
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "ბოდიში, პასუხის გენერირება ვერ მოხერხდა.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};