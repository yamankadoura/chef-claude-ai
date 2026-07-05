import OpenAI from "openai"

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has
and suggests a recipe they could make with some or all of those ingredients.

You don't need to use every ingredient they mention in your recipe.
The recipe can include a few additional ingredients if necessary.

Format your response in markdown.
`

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: import.meta.env.VITE_API_KEY,
    dangerouslyAllowBrowser: true,
})

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")

    try {
        const completion = await client.chat.completions.create({
            model: "meta-llama/Llama-3.1-8B-Instruct:novita",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: `I have ${ingredientsString}. Please recommend a recipe I can make!`,
                },
            ],
            temperature: 0.7,
            max_tokens: 1024,
        })

        return completion.choices[0].message.content
    } catch (error) {
        console.error("Recipe generation failed:", error)
        return "Something went wrong while generating your recipe. Please try again."
    }
}