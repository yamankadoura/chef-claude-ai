import chefClaudeLogo from "./../images/chef.png"

export default function Header() {
    return (
        <header>
            <img src={chefClaudeLogo} alt="Chef Claude logo" />
            <div>
                <p className="app-kicker">AI Kitchen Assistant</p>
                <h1>Chef Claude</h1>
            </div>
        </header>
    )
}