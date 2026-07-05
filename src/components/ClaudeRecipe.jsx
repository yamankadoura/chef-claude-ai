import ReactMarkdown from 'react-markdown'

export default function ClaudeRecipe({ recipe }) {
    return (
        <section className='suggested-recipe-container' aria-live="polite">
            <h2>Chef Claude Recommends:</h2>
            <div className="recipe-markdown">
                <ReactMarkdown>{recipe}</ReactMarkdown>
            </div>
        </section>
    )
}