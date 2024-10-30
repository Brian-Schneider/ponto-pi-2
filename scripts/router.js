export const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

export const router = async () => {
    const routes = [
        { path: "/", view: () => "Welcome to the Home Page" },
        { path: "/pages/about.html", view: () => "Learn more About Us" },
        { path: "/pages/contact.html", view: () => "Contact Us Here" },
        { path: "/pages/login.html", view: () => "Login to Your Account" }
    ];

    const potentialMatches = routes.map(route => ({
        route: route,
        isMatch: location.pathname === route.path
    }));

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        };
    }

    document.querySelector("#app").innerHTML = await match.route.view();
};

window.addEventListener("popstate", router);

document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});