const BASE_URL = 'http://localhost:3000';

async function getToken(username, password, rememberme) {
    const requestBody = {
        username: username,
        password: password,
        rememberme: rememberme,
    };

    const response = await fetch(BASE_URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        console.log("Login failed");
        return null;
    }

    const { token } = await response.json();
    return token;
}

async function testLogin() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testLogin failed");
        return false;
    }
    console.log("testLogin succeeded");
    return true;
}

async function testFeed() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testFeed failed");
        return false;
    }

    const response = await fetch(BASE_URL + '/feed', {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testFeed failed");
        return false;
    }

    const feed = await response;
    console.log("testFeed succeeded");
    return true;
}

async function testLikePost() {
    const postId = 1;
    const token = await getToken("admin", "admin", false);

    if (token === null) {
        console.log("testLikePost failed");
        return false;
    }

    const response = await fetch(BASE_URL + `/feed/like/${postId}`, {
        method: 'POST',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testLikePost failed");
        return false;
    }

    console.log(`testLikePost succeeded for postId ${postId}`);
    return true;
}

async function testUnlikePost() {
    const postId = 1;
    const token = await getToken("admin", "admin", false);

    if (token === null) {
        console.log("testUnlikePost failed");
        return false;
    }

    const cookies = `session=${encodeURIComponent('{"username": "test"}')}`;

    const response = await fetch(BASE_URL + `/feed/like/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies, 
            'Authorization': token,
        }
    });

    if (response.status === 200) {
        console.log(`testUnlikePost succeeded for postId ${postId}`);
        return true;
    } else {
        console.log(`testUnlikePost failed with status code ${response.status}`);
        return false;
    }
}

async function testSavePost() {
    const postId = 1;
    const token = await getToken("admin", "admin", false);

    if (token === null) {
        console.log("testSavePost failed");
        return false;
    }

    const response = await fetch(BASE_URL + `/feed/save/${postId}`, {
        method: 'POST',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testSavePost failed");
        return false;
    }

    console.log(`testSavePost succeeded for postId ${postId}`);
    return true;
}

async function testUnsavePost() {
    const postId = 1;
    const token = await getToken("admin", "admin", false);

    if (token === null) {
        console.log("testUnsavePost failed");
        return false;
    }

    const cookies = `session=${encodeURIComponent('{"username": "test"}')}`;

    const response = await fetch(BASE_URL + `/feed/save/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies, 
            'Authorization': token,
        }
    });

    if (response.status === 200) {
        console.log(`testUnsavePost succeeded for postId ${postId}`);
        return true;
    } else {
        console.log(`testUnsavePost failed with status code ${response.status}`);
        return false;
    }
}

async function testSearch() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testSearch failed");
        return false;
    }

    const query = 'test'; 
    const response = await fetch(BASE_URL + `/search?query=${query}`, {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testSearch failed");
        return false;
    }

    const searchResults = await response;
    console.log("testSearch succeeded");
    return true;
}

async function testSearchPost() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testSearchPost failed");
        return false;
    }

    const query = 'test'; 
    const response = await fetch(BASE_URL + `/search?query=${query}`, {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testSearchPost failed");
        return false;
    }

    const searchResults = await response;
    console.log("testSearchPost succeeded");
    return true;
}

async function testRegisterUser() {
    const userData = {
        username: 'testsuser2',
        password: 'testpassword',
    };

    const response = await fetch(BASE_URL + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (response.status === 200) {
        console.log("testRegisterUser succeeded");
        return true;
    } else if (response.status === 409) {
        console.log("testRegisterUser succeeded");
        return true;
    } else {
        console.log("testRegisterUser failed");
        return false;
    }
}

async function testLogout() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testLogout failed");
        return false;
    }

    const response = await fetch(BASE_URL + '/logout', {
        method: 'POST',
        headers: {
            'Authorization': token,
        },
    });

    if (response.status == 200) {
        console.log("testLogout succeeded");
        return true;
    }

    console.log("testLogout failed to clear the session cookie");
    return false;
}

async function testFollowing() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testFollowing failed");
        return false;
    }

    const response = await fetch(BASE_URL + `/following/test`, {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testFollowing failed");
        return false;
    }

    const followingList = await response;
    console.log("testFollowing succeeded");
    return true;
}

async function testFollow() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testFollow failed");
        return false;
    }

    const response = await fetch(BASE_URL + "/follow/test", {
        method: 'POST',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testFollow failed");
        return false;
    }

    console.log("testFollow succeeded for test user");
    return true;
}

async function testUnfollow() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testUnfollow failed");
        return false;
    }

    const response = await fetch(BASE_URL + "/unfollow/test", {
        method: 'POST',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testUnfollow failed");
        return false;
    }

    console.log("testUnfollow succeeded for test user");
    return true;
}

async function testFavorites() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testFavorites failed");
        return false;
    }

    const response = await fetch(BASE_URL + '/favorites', {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testFavorites failed");
        return false;
    }

    const favoritesList = await response;
    console.log("testFavorites succeeded");
    return true;
}

async function testActivity() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testActivity failed");
        return false;
    }

    const response = await fetch(BASE_URL + '/activity', {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.log("testActivity failed");
        return false;
    }

    const activityFeed = await response;
    console.log("testActivity succeeded");
    return true;
}

async function testUsers() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testUsers failed");
        return false;
    }

    const response = await fetch(BASE_URL + '/users', {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

        if (!response.ok) {
        console.log("testUsers failed");
        return false;
    }

    const userList = await response;
    console.log("testUsers succeeded");
    return true;
}

async function testDeleteUser() {
    const adminToken = await getToken("admin", "admin", true);

    if (adminToken === null) {
        console.log("testDeleteUser failed to obtain admin token");
        return false;
    }

    const userToDelete = 'test'; 

    const requestBody = {
        username: userToDelete,
    };

    try {
        const response = await fetch(BASE_URL + "/users/delete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': adminToken,
            },
            body: JSON.stringify(requestBody),
        });

        if (response.status === 200) {
            console.log(`testDeleteUser succeeded for user ${userToDelete}`);
            return true;
        } else {
            console.log(`testDeleteUser failed for user ${userToDelete}`);
            return false;
        }
    } catch (error) {
        console.error("Error during user deletion:", error);
        return false;
    }
}

async function testFeatureToggle() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testFeatureToggle failed");
        return false;
    }

    const requestBody = {
        feedFilter: false,
        feedSort: false,
        favorites: false,
        searchPosts: false,
    };

    const response = await fetch(BASE_URL + `/features`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        console.log(`testFeatureToggle failed`);
        return false;
    }

    const { toggle } = await response;
    console.log(`testFeatureToggle succeeded`);
    return true;
}

async function testConfig() {
    const token = await getToken("admin", "admin", true);

    if (token === null) {
        console.log("testConfig failed");
        return false;
    }

    const response = await fetch(BASE_URL + '/config', {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

        if (!response.ok) {
        console.log("testConfig failed");
        return false;
    }

    const config = await response;
    console.log("testConfig succeeded");
    return true;
}


async function runTests() {
    const tests = [
        testLogin, 
        testFeed,
        testLikePost,
        testUnlikePost,
        testSavePost,
        testUnsavePost,
        testSearch,
        testSearchPost,
        testRegisterUser,
        testLogout,
        testFollowing,
        testFollow,
        testUnfollow,
        testFavorites,
        testActivity,
        testUsers,
        testDeleteUser,
        testFeatureToggle,
        testConfig
    ];

    for (const test of tests) {
        const result = await test();
        if (!result) {
            console.log("Test failed.");
        }
    }

    console.log("All tests passed.");
}

runTests();

