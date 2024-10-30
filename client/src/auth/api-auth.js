const base_url = import.meta.env.VITE_API_BASE_URL;
const signin = async (user) => {
    try {
        let resp = await fetch(base_url+'/auth/api/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        resp = await resp.json();
        console.log(resp);
        return resp;
    } catch (err) {
        console.log(err);
    }
}

const signout = async () => {
    try {
        let resp = await fetch(base_url+'/auth/api/signout/', {
            method: 'GET'
        });
        return await resp.json();
    } catch (err) {
        console.log(err);
    }
}

export { signin, signout };