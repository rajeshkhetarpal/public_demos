// User global token so we don't have to copy paste by hand in the headers
// NOTE: The global TOKEN is not required for the CA but it is convinient
// when we try to run this code to test our API

var TOKEN = "";

var createUser = (user) => {
    const response = fetch(
        "/api/v1/users",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },  
            body: JSON.stringify(user)
        }
    ).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

// createUser({ email: "test", password: "test" });

var getAuthToken = async (user) => {
    const response = fetch(
        "/api/v1/auth/login",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },  
            body: JSON.stringify(user)
        }
    ).then(response => {
        response.json().then(json => {
            TOKEN = json.token; // The first time we request a token we set it in the global variable
            console.log(json);
        });
    })
};

// getAuthToken({ email: "test", password: "test" })

var createLink = async (link) => {
    const response = fetch(
        "/api/v1/links",
        {
            method: "POST",
            headers: {
                "Authorization": TOKEN, // We reed the token from the global variable (we must call getAuthToken first)
                "Accept": "application/json",
                "Content-Type": "application/json"
            },  
            body: JSON.stringify(link)
        }
    ).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

// createLink({ url: "cnn.com", title: "CNN" });

var getLinks = async () => {
    const response = fetch(
        "/api/v1/links/",
        {
            method: "GET"
        }
    ).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

// getLinks()

var deleteLink = async (linkId) => {
    const response = fetch(
        `/api/v1/links/${linkId}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": TOKEN // We reed the token from the global variable (we must call getAuthToken first)
            }
        }
    ).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

// deleteLink(6);

var upvoteLink = (linkId) => {
    const response = fetch(
        `/api/v1/links/${linkId}/upvote`,
        {
            method: "POST",
            headers: {
                "Authorization": TOKEN // We reed the token from the global variable (we must call getAuthToken first)
            }
        }
    ).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

// upvoteLink(3);

var downVoteLink = (linkId) => {
    const response = fetch(
        `/api/v1/links/${linkId}/downvote`,
        {
            method: "POST",
            headers: {
                "Authorization": TOKEN // We reed the token from the global variable (we must call getAuthToken first)
            }
        }
    ).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

// downVoteLink(4);

var getVotesForLink = (linkId) => {
    const response = fetch(
        `/api/v1/links/${linkId}/votes`,
        {
            method: "GET"
        }
    ).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

// getVotesForLink(4);
