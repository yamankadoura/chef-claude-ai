import React from "react"
import ClaudeRecipe from "./components/ClaudeRecipe.jsx"
import IngredientsList from "./components/IngredientsList.jsx"
import {getRecipeFromMistral} from "./services/ai.js"


export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [isLoadingRecipe, setIsLoadingRecipe] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    
    function addIngredient(formData) {
        const submittedIngredient = formData.get("ingredient")
        const normalizedIngredient = typeof submittedIngredient === "string"
            ? submittedIngredient.trim()
            : ""

        if (!normalizedIngredient) {
            return
        }

        setIngredients((prevIngredients) => {
            if (prevIngredients.includes(normalizedIngredient)) {
                return prevIngredients
            }

            return [...prevIngredients, normalizedIngredient]
        })

        setErrorMessage("")
    }

    async function getRecipe() {
        setIsLoadingRecipe(true)
        setErrorMessage("")

        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients)
            setRecipe(recipeMarkdown)
        } catch (error) {
            console.error(error)
            setErrorMessage("Could not generate a recipe right now. Please try again.")
        } finally {
            setIsLoadingRecipe(false)
        }
    }

    return (
        <main>
            <section className="intro-panel" aria-label="Chef Claude intro">
                <h2>Cook confidently with what you already have</h2>
                <p>
                    Add at least four ingredients from your kitchen and Chef Claude will propose
                    a complete, markdown-formatted recipe in seconds.
                </p>
            </section>

            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                    required
                />
                <button type="submit">Add ingredient</button>
            </form>

            {errorMessage && (
                <p className="error-message" role="alert">
                    {errorMessage}
                </p>
            )}

            {ingredients.length > 0 && <IngredientsList
                ingredients={ingredients}
                onGetRecipe={getRecipe}
                isLoading={isLoadingRecipe}
            />}

            {recipe && <ClaudeRecipe
                recipe={recipe}
            />}
        </main>
    )
}