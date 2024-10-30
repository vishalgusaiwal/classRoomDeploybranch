const base_url = import.meta.env.VITE_API_BASE_URL;
const enrollmentStats = async (params, credentials, signal) => {
    try {
        let response = await fetch(base_url +'/enrollments/api/enrollment/stats/' + params.courseId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            signal: signal,
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}
const create = async (params, credentials) => {
    try {
        let response = await fetch(base_url + '/enrollments/api/enrollment/news/' + params.courseId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });
        response = await response.json();
        return response.result;
    } catch (err) {
        console.log(err);
    }
}
const read = async (params, credentials, signal) => {
    try {
        let response = await fetch(base_url + '/enrollments/api/enrollments/' + params.enrollmentId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });
        response = await response.json();
        return response;
    } catch (err) {
        console.log(err);
    }
}
const complete = async (params, credentials,updatedData) => {
    let response = await fetch(base_url + '/enrollments/api/enrollment/completes/' + params.enrollmentId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(updatedData)
    });
    response = await response.json();
    return response;
}
const listEnrollments = async (credentials, signal) => {
    try {
        let response = await fetch(base_url + '/enrollments/api/enrollment/enrolled', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            signal: signal
        });
        response = await response.json();
        return response;
    } catch (ex) {
        console.log(ex);
    }
}
export { enrollmentStats, create, read, complete, listEnrollments };