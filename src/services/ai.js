const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has
and suggests a recipe they could make with some or all of those ingredients.

You don't need to use every ingredient they mention.

The recipe can include additional ingredients they didn't mention,
but try not to include too many extras.

Format your response in Markdown.
`;

const apiKey = import.meta.env.VITE_API_KEY;
let clientPromise;

async function getClient() {
  if (!apiKey) {
    return null;
  }

  if (!clientPromise) {
    clientPromise = import("@huggingface/inference").then(
      ({ InferenceClient }) => new InferenceClient(apiKey)
    );
  }

  return clientPromise;
}

export async function getRecipeFromMistral(ingredientsArr) {
  if (!ingredientsArr.length) {
    return "Please add some ingredients first.";
  }

  const client = await getClient();

  if (!client) {
    return "Missing API key. Add VITE_API_KEY to your .env file.";
  }

  try {
    const ingredientsString = ingredientsArr.join(", ");

    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please recommend a recipe.`,
        },
      ],
      max_tokens: 1024,
    });

    const recipeText = response?.choices?.[0]?.message?.content;

    if (!recipeText) {
      throw new Error("Model returned an empty response.");
    }

    return recipeText;
  } catch (error) {
    console.error("Recipe generation failed:", error);

    return "Something went wrong while generating your recipe. Please try again.";
  }
}